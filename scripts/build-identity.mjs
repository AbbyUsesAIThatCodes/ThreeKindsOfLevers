import {readFile,writeFile,mkdir,rename,open,unlink,readdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const json=async(file,fallback)=>{try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw e;}};
async function atomic(file,data){await mkdir(path.dirname(file),{recursive:true});const temp=`${file}.${randomUUID()}.tmp`;await writeFile(temp,JSON.stringify(data,null,2)+'\n');await rename(temp,file);}
async function locked(dir,fn){await mkdir(dir,{recursive:true});const lock=path.join(dir,'allocator.lock');let handle;for(let n=0;n<100;n++){try{handle=await open(lock,'wx');break;}catch(e){if(e.code!=='EEXIST')throw e;await new Promise(r=>setTimeout(r,50));}}if(!handle)throw Error('Build allocator is busy. Do not delete a live lock or reuse an ordinal.');try{return await fn();}finally{await handle.close();await unlink(lock);}}
export async function reserveBuild(ledgerRoot,scope){
  if(!/^(pr-[1-9]\d*|local-[a-z0-9-]+|main|release)$/.test(scope))throw Error('Invalid build scope');
  const stateDir=path.join(ledgerRoot,'.build-state'),file=path.join(ledgerRoot,'build/ledger.json'),cache=path.join(stateDir,'ledger.json');
  return locked(stateDir,async()=>{const saved=await json(file,{schema:1,attempts:[]}),backup=await json(cache,{attempts:[]});const map=new Map([...saved.attempts,...backup.attempts].map(a=>[a.key,a]));const attempts=[...map.values()];const ordinal=1+Math.max(0,...attempts.filter(a=>a.scope===scope).map(a=>a.ordinal));const record={key:`${scope}/${ordinal}`,scope,ordinal,status:'reserved',reservedAtUtc:new Date().toISOString()};const ledger={...saved,attempts:[...attempts,record]};await atomic(cache,ledger);await atomic(file,ledger);return record;});
}
export async function finishBuild(ledgerRoot,reservation,details){
  const stateDir=path.join(ledgerRoot,'.build-state'),file=path.join(ledgerRoot,'build/ledger.json'),cache=path.join(stateDir,'ledger.json');
  await locked(stateDir,async()=>{const saved=await json(file,{schema:1,attempts:[]}),backup=await json(cache,{attempts:[]});const map=new Map([...saved.attempts,...backup.attempts].map(a=>[a.key,a]));if(!map.has(reservation.key))throw Error('Missing reserved build');map.set(reservation.key,{...map.get(reservation.key),...details,completedAtUtc:new Date().toISOString()});const ledger={...saved,attempts:[...map.values()]};await atomic(cache,ledger);await atomic(file,ledger);});
}
export function git(sourceDir,...args){return execFileSync('git',args,{cwd:sourceDir,encoding:'utf8',windowsHide:true}).trim();}
export async function fingerprint(sourceDir){
  const inputs=[];async function visit(rel){const abs=path.join(sourceDir,rel);let entries;try{entries=await readdir(abs,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')return;if(e.code==='ENOTDIR'){inputs.push(rel);return;}throw e;}for(const e of entries.sort((a,b)=>a.name.localeCompare(b.name))){const r=path.posix.join(rel,e.name);if(e.isDirectory())await visit(r);else if(e.isFile())inputs.push(r);}}
  for(const rel of ['src','public','scripts','package.json','package-lock.json','release.json'])await visit(rel);
  const hash=createHash('sha256');for(const rel of inputs.sort()){hash.update(rel+'\0');hash.update(await readFile(path.join(sourceDir,rel)));hash.update('\0');}return hash.digest('hex');
}
export async function beginBuild({sourceDir=process.cwd(),ledgerRoot,scope=process.env.BUILD_SCOPE||'local-jess-pc',target='web-review',packagerRoot}={}){
  ledgerRoot ||= path.dirname(path.resolve(sourceDir,git(sourceDir,'rev-parse','--git-common-dir')));packagerRoot ||= ledgerRoot;
  const release=await json(path.join(ledgerRoot,'release.json'));
  const sourceRevision=git(sourceDir,'rev-parse','HEAD');const sourceDirty=git(sourceDir,'status','--porcelain','--untracked-files=all')!=='';
  const sourceFingerprint=await fingerprint(sourceDir),packagerRevision=git(packagerRoot,'rev-parse','HEAD'),packagerFingerprint=await fingerprint(packagerRoot);
  const reservation=await reserveBuild(ledgerRoot,scope);
  // Capture once, immediately before injection/copy/bundling; reused on every surface.
  const builtAtUtc=new Date().toISOString(),stamp=builtAtUtc.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const fullId=`${release.version}_${release.codenameSlug}_${scope}_build-${String(reservation.ordinal).padStart(3,'0')}_${stamp}_g${sourceRevision.slice(0,12)}${sourceDirty?`_dirty-${sourceFingerprint.slice(0,8)}`:''}_${target}`;
  const manifest={schema:1,version:release.version,releaseStatus:release.status,codename:release.codename,codenameSlug:release.codenameSlug,codenameNote:release.codenameNote,scope,pr:scope.startsWith('pr-')?Number(scope.slice(3)):null,ordinal:reservation.ordinal,builtAtUtc,sourceRevision,sourceDirty,sourceFingerprint,packagerRevision,packagerFingerprint,target,fullId,identityLayer:'scripts/build-identity.mjs: static metadata overlay and report; game source snapshot identified separately'};
  console.log(`BUILD START ${fullId}`);return {manifest,reservation,ledgerRoot};
}
export async function attachIdentity(dist,manifest){
  await mkdir(path.join(dist,'assets'),{recursive:true});await atomic(path.join(dist,'build-manifest.json'),manifest);
  const css='#build-identity{position:fixed;bottom:0;left:0;right:0;z-index:10;background:#163b39;color:#fffcef;font:11px/1.3 "Comic Sans MS","Comic Sans","Comic Neue",cursive;padding:4px 10px;text-align:center;overflow-wrap:anywhere;user-select:text}#lesson{bottom:calc(var(--identity-space,32px) + 8px)!important}';
  const overlay=`const m=${JSON.stringify(manifest)};const el=document.createElement('div');el.id='build-identity';el.textContent='Review Build · '+m.fullId;el.title=m.codenameNote;document.body.append(el);const style=document.createElement('style');style.textContent=${JSON.stringify(css)};document.head.append(style);new ResizeObserver(()=>document.documentElement.style.setProperty('--identity-space',el.offsetHeight+'px')).observe(el);console.info('REVIEW BUILD '+m.fullId);`;
  await writeFile(path.join(dist,'assets/build-identity.js'),overlay);
  const file=path.join(dist,'index.html');let html=await readFile(file,'utf8');html=html.replace('</body>','<script type="module" src="./assets/build-identity.js"></script></body>');await writeFile(file,html);
  await writeFile(path.join(dist,'BUILD-REPORT.txt'),`Three Kinds of Levers — Review Build\n${manifest.fullId}\n\nVersion: ${manifest.version} (${manifest.releaseStatus})\nCodename: ${manifest.codename??'Unassigned — no accepted name in recovered history'}\nBuilt UTC: ${manifest.builtAtUtc}\nSource: ${manifest.sourceRevision}\nDirty: ${manifest.sourceDirty}\nSource Fingerprint (SHA256): ${manifest.sourceFingerprint}\nPackager: ${manifest.packagerRevision}\nPackager Fingerprint: ${manifest.packagerFingerprint}\nTarget: ${manifest.target}\nScope: ${manifest.scope}; Ordinal: ${manifest.ordinal}\n\nThis immutable output is independent of live GitHub Pages. Reopening or retesting does not create another build.\n`);
}
