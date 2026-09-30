// Metres, right-handed coordinates, +Y up. Window wall = -Z; teacher nook = +Z.
// Photo-informed estimates, not surveyed dimensions. Keep these placements editable.
export const ROOM = Object.freeze({width: 7, length: 14, height: 3.6, nookStart: 4.8, nookHeight: 2.65});
export const BENCHES = [-4.5, -2.1, .3, 2.7].map((z, i) => ({id: `Workbench_${i + 1}`, x: -2.24, z, width: 2.35, depth: .95, height: .94}));
// Four separate tops in two pairs, checked against original photo 1000008855.jpg.
export const TABLES = [-3.8, .0].flatMap((z, pair) => [-1,1].map((side,i)=>({id:`Desk_Pair_${pair+1}_${i+1}`,pair:pair+1,x:1.05+side*.5525,z,width:1.08,depth:1.5,height:.9})));
export const VIEWS = {
  entrance: {label: 'Down the classroom', position: [0, 1.65, 4.35], target: [.1, 1.5, -6.8]},
  board: {label: 'ViewBoard & tables', position: [-.3, 1.65, 1.1], target: [3.25, 1.6, -1.5]},
  workshop: {label: 'Engineering benches', position: [-.74, 1.65, -1.36], target: [-3.15, 1.1, -2.1]},
  maker: {label: 'Printer corner', position: [-.4, 1.65, 4.4], target: [-.3, 1.25, 6.8]},
  window: {label: 'From the window', position: [0, 1.65, -5.9], target: [0, 1.5, 5.8]},
};
export const ANCHORS = [
  {name: 'PlayerSpawn', position: VIEWS.entrance.position, role: 'camera_spawn', note: 'Eye height, facing -Z'},
  {name: 'GameAnchor_Lever', position: [-2.24, .983, .3], role: 'tabletop', note: 'Centre of third wooden workbench; top surface'},
  {name: 'GameAnchor_Design', position: [1.05, .931, -.8], role: 'tabletop', note: 'Centre of middle lab table; top surface'},
  {name: 'GameAnchor_Skimmer', position: [0, .015, -1.5], role: 'floor', note: 'Centre aisle; no implicit race length'},
  {name: 'ViewBoard_Surface', position: [3.025, 1.79, -1.5], role: 'display', note: 'Screen centre; faces -X'},
  {name: 'MakerCorner', position: [-.3, 1.35, 6.4], role: 'point_of_interest'},
];
