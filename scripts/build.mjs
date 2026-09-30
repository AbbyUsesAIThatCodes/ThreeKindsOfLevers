import {beginBuild,finishBuild,attachIdentity} from './build-identity.mjs';
import {compileSite} from './compile-site.mjs';
const ciScope=process.env.CI?`local-ci-${process.env.GITHUB_RUN_ID||'unknown'}-${process.env.GITHUB_RUN_ATTEMPT||'1'}`:undefined;
const context=await beginBuild({scope:process.env.BUILD_SCOPE||ciScope||'local-jess-pc',target:process.env.BUILD_TARGET||'web-review'});
const {manifest}=context;
try{
  await compileSite(process.cwd(),'dist',process.cwd());
  await attachIdentity('dist',manifest);await finishBuild(context.ledgerRoot,context.reservation,{status:'success',fullId:manifest.fullId,sourceRevision:manifest.sourceRevision});
  console.log(`BUILD SUCCESS ${manifest.fullId}`);
}catch(error){await finishBuild(context.ledgerRoot,context.reservation,{status:'failed',fullId:manifest.fullId,error:error.message});console.error(`BUILD FAILED ${manifest.fullId}`);throw error;}
