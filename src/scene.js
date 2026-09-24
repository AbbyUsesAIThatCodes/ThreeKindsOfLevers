import * as THREE from 'three';
import { WorkshopScene } from './workshop.js';
import { ROLES, move, step, measures } from './model.js';
const HEIGHT=7, SCALE=25;
export const COLORS={effort:0x257e73,fulcrum:0x7952a0,load:0xbf8630};

export class LeverScene extends WorkshopScene {
  makeRoom() {
    super.makeRoom();
    // Same classroom backdrop as the latest Mechanical Advantage workbench.
    const wall=this.box(110,48,.4,0xd8dfd0,0,18,-32);
    wall.castShadow=false;wall.receiveShadow=false;
    this.classroom=[wall,this.box(30,12,.45,0x847453,1,15,-31.6),
      this.box(28.8,10.8,.16,0x355850,1,15,-31.3),this.box(31,.35,1.2,0xae9a76,1,8.9,-30.9)];
  }
  mesh(parent,geometry,color,xyz,owner) {
    const material=new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.4});
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...xyz);
    mesh.castShadow=mesh.receiveShadow=true;mesh.userData={part:owner};
    parent.add(mesh);this.meshes.push(mesh);if(owner)this.pickable.push(mesh);return mesh;
  }
  block(parent,w,h,d,color,x,y,z,owner) {return this.mesh(parent,new THREE.BoxGeometry(w,h,d),color,[x,y,z],owner);}
  cylinder(parent,r,h,color,x,y,z,owner) {return this.mesh(parent,new THREE.CylinderGeometry(r,r,h,32),color,[x,y,z],owner);}
  setState(state) {
    this.state={...state};this.motion={angle:0,velocity:0};this.lifted=false;
    for(const root of [this.moving,this.base]) {
      root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
      root.clear();
    }
    this.meshes=[];this.pickable=[];
    const pivot=state.fulcrum/SCALE,brass=0xb68d46,steel=0x8ba0a0;
    this.moving.position.set(pivot,HEIGHT,0);this.moving.rotation.z=0;this.base.position.set(pivot,0,0);
    this.block(this.base,3.7,.4,4.2,COLORS.fulcrum,0,.2,0,'fulcrum');
    for(const z of [-1.28,1.28]) {
      this.block(this.base,.5,HEIGHT-.4,.48,steel,0,(HEIGHT-.4)/2+.4,z,'fulcrum');
      const ring=this.mesh(this.base,new THREE.TorusGeometry(.4,.16,12,32),brass,[0,HEIGHT,z],'fulcrum');
      for(const x of [-1.35,1.35])this.cylinder(this.base,.14,.1,brass,x,.45,z,'fulcrum');
    }
    const axle=this.cylinder(this.base,.23,3.4,0xcbd6d4,0,HEIGHT,0,'fulcrum');axle.rotation.x=Math.PI/2;
    for(const z of [-1.8,1.8]) {const cap=this.cylinder(this.base,.36,.16,COLORS.fulcrum,0,HEIGHT,z,'fulcrum');cap.rotation.x=Math.PI/2;}
    // The full rail remains centered on the desk; its pivot can move along it.
    for(const y of [-.34,.34])this.block(this.moving,25.3,.16,1.7,steel,-pivot,y,0);
    for(let x=-12;x<=12;x++)this.block(this.moving,.15,.52,1.6,steel,x-pivot,0,0);
    for(const x of [-12.7,12.7])this.block(this.moving,.24,.9,1.85,brass,x-pivot,0,0);
    for(let i=-12;i<=12;i++)this.block(this.moving,.028,i%2===0?.22:.12,.018,0x193e39,i-pivot,.19,.865);
    this.attachments={};
    for(const role of ['effort','load']) {
      const x=(state[role]-state.fulcrum)/SCALE,col=COLORS[role];
      this.block(this.moving,.8,.18,2.2,col,x,.51,0,role);
      for(const z of [-1.04,1.04])this.block(this.moving,.65,1.25,.18,col,x,-.03,z,role);
      this.cylinder(this.moving,.18,.3,brass,x,.75,0,role);
      const pin=this.cylinder(this.moving,.12,2.5,brass,x,-.55,0,role);pin.rotation.x=Math.PI/2;
      const hanger=new THREE.Group();hanger.position.set(x,-.6,1.3);this.moving.add(hanger);this.attachments[role]=hanger;
      this.cylinder(hanger,.065,1,0xc4d1cc,0,-.5,0,role);
      if(role==='load') {
        this.cylinder(hanger,.8,1,col,0,-1.5,0,role);
        for(const y of [-1,-2])this.cylinder(hanger,.87,.12,brass,0,y,0,role);
      } else {
        this.mesh(hanger,new THREE.TorusGeometry(.55,.12,12,32),col,[0,-1.55,0],role);
      }
    }
    this.arrows={};
    const m=measures(state);
    for(const role of ['effort','load']) {
      const dir=role==='effort'?m.effortDirection:-1;
      const group=new THREE.Group();this.moving.add(group);this.arrows[role]=group;
      // Place force arrows beside the hanging handle/weight. Keeping the
      // entire arrow below the beam also clears the labels during a lift.
      group.position.set((state[role]-state.fulcrum)/SCALE+1.25,0,1.3);
      // Both force arrows are vertical in world space. The load arrow denotes
      // gravity; it does not reverse when the load moves upward.
      const arrow=new THREE.ArrowHelper(new THREE.Vector3(0,dir,0),new THREE.Vector3(0,dir===1?-3.05:-.65,0),2.4,COLORS[role],.65,.5);
      arrow.line.material.transparent=true;arrow.line.material.opacity=.9;
      arrow.cone.material.transparent=true;arrow.cone.material.opacity=.85;group.add(arrow);
    }
    this.highlight(this.hovered);this.dirty=true;this.draw();
  }
  highlight(part) {
    this.hovered=part;
    for(const mesh of this.meshes||[]) {mesh.material.emissive.set(mesh.userData.part&&(mesh.userData.part===(part||this.selected))?0x376b2a:0);mesh.material.emissiveIntensity=.35;}
    this.dirty=true;
  }
  setLifted(value) {this.lifted=value;this.dirty=true;}
  frame(time) {
    if(!this.active){this.frameTime=null;return;}
    const dt=this.frameTime===null?0:Math.max(0,Math.min(.1,(time-this.frameTime)/1000));this.frameTime=time;
    const old=this.motion.angle,target=this.state&&this.lifted&&!this.drag?measures(this.state).liftAngle:0;
    this.motion.angle=this.reduced?target:old+(target-old)*(1-Math.exp(-5*dt));
    if(Math.abs(this.motion.angle-target)<.0001)this.motion.angle=target;
    const changed=this.drag?false:this.controls.update();
    if(changed||this.dirty||old!==this.motion.angle)this.draw();
  }
  screenPositions() {
    if(!this.state)return {};
    const result={};
    for(const p of ROLES)result[p]=this.project(this.moving.localToWorld(new THREE.Vector3((this.state[p]-this.state.fulcrum)/SCALE,p==='fulcrum'?.1:.65,1.2)));
    return result;
  }
  draw() {
    if(!this.moving)return;
    this.scene.fog.near=Math.max(65,this.camera.position.distanceTo(this.controls.target)+35);this.scene.fog.far=this.scene.fog.near+80;
    for(const o of this.classroom||[])o.visible=this.camera.position.z>-28;
    this.moving.rotation.z=this.motion.angle;
    for(const group of [...Object.values(this.attachments||{}),...Object.values(this.arrows||{})])group.rotation.z=-this.motion.angle;
    this.scene.updateMatrixWorld(true);this.renderer.render(this.scene,this.camera);this.dirty=false;
    this.callbacks.onFrame?.({positions:this.screenPositions(),angle:this.motion.angle});
  }
  resetCamera() {
    const short=this.host.clientHeight<=500,center=short?7:8;
    const fit=Math.max(1,1.45/(this.host.clientWidth/this.host.clientHeight))*(short?1.3:1);
    this.controls.target.set(0,center,0);this.camera.position.set(10*fit,center+14*fit,47*fit);
    this.controls.maxDistance=Math.max(75,60*fit);this.controls.update();this.draw();
  }
  sideCamera() {
    const short=this.host.clientHeight<=500,center=short?7:8;
    const fit=Math.max(1,1.45/(this.host.clientWidth/this.host.clientHeight))*(short?1.3:1);
    this.controls.target.set(0,center,0);this.camera.position.set(0,center+.1,49*fit);this.controls.update();this.draw();
  }
  screenSign() {return this.project(new THREE.Vector3(10,HEIGHT,0)).x>=this.project(new THREE.Vector3(-10,HEIGHT,0)).x?1:-1;}
  beginDrag(event,part) {
    if(event.button!==0||!event.isPrimary||!this.state)return false;
    this.select(part);
    const a=this.project(new THREE.Vector3(-10,HEIGHT,0)),b=this.project(new THREE.Vector3(10,HEIGHT,0));
    const dx=b.x-a.x,dy=b.y-a.y,denom=dx*dx+dy*dy;
    if(denom<1600){this.callbacks.onNotice?.('Use Side view or the position controls to move along the beam.');return false;}
    event.preventDefault();event.stopImmediatePropagation();
    this.drag={part,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,startState:{...this.state},dx,dy,denom,target:event.currentTarget};
    this.controls.enabled=false;this.drag.target.setPointerCapture?.(event.pointerId);this.lifted=false;this.motion.angle=0;this.dirty=true;
    this.callbacks.onDrag?.();return true;
  }
  installPointers() {
    this.canvas.addEventListener('pointerdown',e=>{const p=this.hit(e);if(p)this.beginDrag(e,p);},true);
    this.canvas.addEventListener('pointermove',e=>{if(!this.drag){const p=this.hit(e);if(p!==this.hovered)this.highlight(p);this.canvas.style.cursor=p?'grab':'default';}});
    this.canvas.addEventListener('pointerleave',()=>{if(!this.drag)this.highlight(null);});
    window.addEventListener('pointermove',e=>{
      const d=this.drag;if(!d||d.pointerId!==e.pointerId)return;e.preventDefault();
      const delta=((e.clientX-d.startX)*d.dx+(e.clientY-d.startY)*d.dy)/d.denom*500;
      const next=move(this.state,d.part,d.startState[d.part]+delta);
      if(next[d.part]!==this.state[d.part])this.callbacks.onChange?.(next);
    },{capture:true,passive:false});
    for(const name of ['pointerup','pointercancel'])window.addEventListener(name,e=>{if(this.drag?.pointerId===e.pointerId)this.finishDrag(name==='pointercancel');},true);
    window.addEventListener('blur',()=>this.finishDrag(true));
    window.addEventListener('keydown',e=>{if(e.key==='Escape')this.finishDrag(true);});
    this.canvas.addEventListener('keydown',e=>{if(this.selected&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();this.callbacks.onChange?.(step(this.state,this.selected,(e.key==='ArrowRight'?1:-1)*this.screenSign()));}});
  }
}
