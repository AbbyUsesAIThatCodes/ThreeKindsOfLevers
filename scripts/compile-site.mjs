import {build} from 'esbuild';
import {rm,mkdir,cp,copyFile,readFile} from 'node:fs/promises';
import path from 'node:path';
export async function compileSite(sourceDir,output,dependencyRoot){
  const sourceLock=await readFile(path.join(sourceDir,'package-lock.json'),'utf8'),installedLock=await readFile(path.join(dependencyRoot,'package-lock.json'),'utf8');
  if(sourceLock.replace(/\r/g,'')!==installedLock.replace(/\r/g,''))throw Error('Snapshot dependencies differ; install its own locked dependencies before building.');
  const dist=path.resolve(output),localDist=path.resolve(sourceDir,'dist'),packageRoot=path.resolve(dependencyRoot,'review-packages');
  if(dist!==localDist&&!dist.startsWith(packageRoot+path.sep))throw Error('Build output must be dist or inside this checkout’s review-packages directory.');
  await rm(dist,{recursive:true,force:true});await mkdir(path.join(dist,'assets'),{recursive:true});await cp(path.join(sourceDir,'public'),dist,{recursive:true});
  for(const [weight,name] of [['400','regular'],['700','bold']])await copyFile(path.join(dependencyRoot,`node_modules/@fontsource/comic-neue/files/comic-neue-latin-${weight}-normal.woff2`),path.join(dist,`assets/comic-neue-${name}.woff2`));
  await build({absWorkingDir:sourceDir,entryPoints:{app:'src/app.js'},bundle:true,format:'esm',target:['chrome100','firefox100','safari16'],outdir:path.join(dist,'assets'),nodePaths:[path.join(dependencyRoot,'node_modules')],minify:true,legalComments:'eof'});
}
