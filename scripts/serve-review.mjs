import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'site'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const manifest=JSON.parse(await readFile(path.join(root,'build-manifest.json'),'utf8'));
http.createServer(async(req,res)=>{try{const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/ThreeKindsOfLevers\//,'/'),p=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}const data=await readFile(p);res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>{console.log(`REVIEW BUILD ${manifest.fullId}\nhttp://127.0.0.1:${port}/\nPress Ctrl+C to stop.`);if(process.platform==='win32'&&process.env.OPEN_BROWSER==='1')execFile('cmd.exe',['/c','start','',`http://127.0.0.1:${port}/`],{windowsHide:true});});
