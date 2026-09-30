import {mkdir,copyFile,cp,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {beginBuild,finishBuild,attachIdentity} from './build-identity.mjs';
import {compileSite} from './compile-site.mjs';
const packagerRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [sourceArg,scope]=process.argv.slice(2);if(!sourceArg||!scope)throw Error('Usage: node scripts/package-snapshot.mjs SOURCE_DIRECTORY pr-N');
const sourceDir=path.resolve(sourceArg),ctx=await beginBuild({sourceDir,scope,ledgerRoot:packagerRoot,packagerRoot});
const out=path.join(packagerRoot,'review-packages',ctx.manifest.fullId);
try{
  await compileSite(sourceDir,path.join(out,'site'),packagerRoot);await attachIdentity(path.join(out,'site'),ctx.manifest);
  await copyFile(path.join(packagerRoot,'scripts/serve-review.mjs'),path.join(out,'serve-review.mjs'));
  await copyFile(path.join(packagerRoot,'scripts/Start Review.cmd'),path.join(out,'Start Review.cmd'));
  await cp(path.join(sourceDir,'docs'),path.join(out,'docs'),{recursive:true});await copyFile(path.join(sourceDir,'THIRD_PARTY_NOTICES.md'),path.join(out,'THIRD_PARTY_NOTICES.md'));
  await writeFile(path.join(out,'README.txt'),`Three Kinds of Levers — ${scope} Review\n${ctx.manifest.fullId}\n\nUnzip the entire folder, then double-click Start Review.cmd on Jess_PC.\nOther systems: install Node.js 22+, then run: node serve-review.mjs\nOpen http://127.0.0.1:43163/ . Keep the server running; Ctrl+C stops it.\nDo not open site/index.html directly. No npm install, accounts, internet connection or hosting subscription is needed to play.\n\nGame source: ${ctx.manifest.sourceRevision}\nSource dirty: ${ctx.manifest.sourceDirty}\nThis exact snapshot uses a review metadata overlay/launcher from packager ${ctx.manifest.packagerRevision}.\nSee site/build-manifest.json and site/BUILD-REPORT.txt for full provenance.\nThis is an independent review package; it never deploys or changes live GitHub Pages.\nThe integrated PR package is the recommended complete review. Earlier snapshots can retain limitations fixed in later PRs.\n`);
  await finishBuild(packagerRoot,ctx.reservation,{status:'success',fullId:ctx.manifest.fullId,sourceRevision:ctx.manifest.sourceRevision,outputDirectory:path.relative(packagerRoot,out)});
  console.log(`BUILD SUCCESS ${ctx.manifest.fullId}`);console.log(out);
}catch(error){await finishBuild(packagerRoot,ctx.reservation,{status:'failed',fullId:ctx.manifest.fullId,error:error.message});console.error(`BUILD FAILED ${ctx.manifest.fullId}`);throw error;}
