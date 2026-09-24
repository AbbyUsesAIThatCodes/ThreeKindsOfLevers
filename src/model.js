// Positions are millimeters along a 600 mm ideal, massless beam.
export const ROLES = ['effort', 'fulcrum', 'load'];
export const LIMIT = 250;
export const STEP = 25;
export const GAP = 75;
export const LIFT_ANGLE = Math.PI / 15;
export const PRESETS = Object.freeze({
  1: Object.freeze({ effort: -225, fulcrum: 0, load: 225 }),
  2: Object.freeze({ effort: 225, fulcrum: -225, load: 0 }),
  3: Object.freeze({ effort: 0, fulcrum: -225, load: 225 }),
});
export const LESSONS = Object.freeze({
  1: { name: 'First class', middle: 'fulcrum', example: 'Seesaw', explanation: 'The fulcrum is between the effort and the load.', connection: 'The seat you push down is the effort point. The center support is the fulcrum; the rider on the other end is the load.' },
  2: { name: 'Second class', middle: 'load', example: 'Wheelbarrow', explanation: 'The load is between the fulcrum and the effort.', connection: 'The wheel axle is the fulcrum. The contents are the load; your hands lift the handles at the effort point.' },
  3: { name: 'Third class', middle: 'effort', example: 'Tweezers', explanation: 'The effort is between the fulcrum and the load.', connection: 'On each arm, the joined end is the fulcrum. Your fingers apply effort between that end and the tip holding the load.' },
});
export function order(state) { return [...ROLES].sort((a,b) => state[a] - state[b]); }
export function leverClass(state) { return { fulcrum: 1, load: 2, effort: 3 }[order(state)[1]]; }
export function valid(state) {
  return !!state && ROLES.every(p => Number.isFinite(state[p]) && Math.abs(state[p]) <= LIMIT && state[p] % STEP === 0)
    && ROLES.every((p,i) => ROLES.slice(i+1).every(q => Math.abs(state[p]-state[q]) >= GAP));
}
export function move(state, role, value) {
  if (!ROLES.includes(role) || !Number.isFinite(Number(value))) return {...state};
  const target = Math.max(-LIMIT,Math.min(LIMIT,Math.round(Number(value)/STEP)*STEP));
  const available = [];
  for(let x=-LIMIT;x<=LIMIT;x+=STEP) if(ROLES.every(p => p===role || Math.abs(x-state[p]) >= GAP)) available.push(x);
  available.sort((a,b) => Math.abs(a-target)-Math.abs(b-target) || Math.abs(a-state[role])-Math.abs(b-state[role]));
  return {...state,[role]:available[0] ?? state[role]};
}
export function step(state,role,direction) {
  // One keypress must cross an occupied interval instead of getting stuck on it.
  for(let x=state[role]+STEP*direction;Math.abs(x)<=LIMIT;x+=STEP*direction)
    if(ROLES.every(p=>p===role||Math.abs(x-state[p])>=GAP)) return {...state,[role]:x};
  return {...state};
}
export function mirror(state) { return Object.fromEntries(ROLES.map(p=>[p,-state[p]])); }
export function measures(state) {
  const effortArm=state.effort-state.fulcrum, loadArm=state.load-state.fulcrum;
  return {effortArm:Math.abs(effortArm),loadArm:Math.abs(loadArm),
    // The downward load torque must be opposed by the effort torque.
    effortDirection:Math.sign(effortArm*loadArm),
    liftAngle:Math.sign(loadArm)*LIFT_ANGLE,
    ima:Math.abs(effortArm/loadArm)};
}
