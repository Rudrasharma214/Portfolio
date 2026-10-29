/**
 * The three arrangements the hero point cloud morphs between.
 *
 * Each generator fills one Float32Array of xyz triples for the same point
 * count, so morphing is a per-vertex lerp between two buffers — point `k` in
 * `mesh` becomes point `k` in `cluster`, which keeps the transition coherent
 * instead of scrambling.
 *
 * Ported from the prototype's canvas generator, which built the same
 * knot/sphere/helix triple.
 */

export type ShapeId = 'mesh' | 'cluster' | 'stream';

export const SHAPE_ORDER: ShapeId[] = ['mesh', 'cluster', 'stream'];

export const SHAPE_LABELS: Record<ShapeId, { label: string; caption: string }> = {
  mesh: { label: 'Mesh', caption: 'Pieces wired together' },
  cluster: { label: 'Cluster', caption: 'Horizontally scaled instances' },
  stream: { label: 'Stream', caption: 'An ordered event log' },
};

/** Points around the ring. */
export const RINGS = 110;
/** Points around each ring's tube. */
export const TUBE = 18;
export const POINT_COUNT = RINGS * TUBE;

const TAU = Math.PI * 2;

/** A trefoil-style knot with a tube swept around it: interconnected services. */
function meshPosition(u: number, v: number): [number, number, number] {
  const radius = 1.08 + 0.36 * Math.cos(3 * u);
  const tube = 0.3;
  const x = radius * Math.cos(2 * u);
  const y = radius * Math.sin(2 * u);
  const z = 0.36 * Math.sin(3 * u);
  const nx = Math.cos(2 * u) * Math.cos(v);
  const ny = Math.sin(2 * u) * Math.cos(v);
  const nz = Math.sin(v);
  return [x + tube * nx, y + tube * ny, z + tube * nz];
}

/** An even shell: a node cluster. */
function clusterPosition(u: number, v: number): [number, number, number] {
  const theta = u;
  const phi = v / 2;
  const r = 1.45;
  return [
    r * Math.cos(theta) * Math.sin(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(phi),
  ];
}

/** A tube wound along an axis: an append-only event log. */
function streamPosition(u: number, v: number): [number, number, number] {
  const tube = 0.27;
  const radius = 0.86 + tube * Math.cos(v);
  return [
    radius * Math.cos(2 * u),
    radius * Math.sin(2 * u),
    (u / TAU - 0.5) * 2.75 + tube * Math.sin(v),
  ];
}

const GENERATORS: Record<ShapeId, (u: number, v: number) => [number, number, number]> = {
  mesh: meshPosition,
  cluster: clusterPosition,
  stream: streamPosition,
};

/** Builds the xyz buffer for one shape. */
export function buildShape(id: ShapeId): Float32Array {
  const generator = GENERATORS[id];
  const out = new Float32Array(POINT_COUNT * 3);

  for (let i = 0; i < RINGS; i++) {
    const u = (i / RINGS) * TAU;
    for (let j = 0; j < TUBE; j++) {
      const v = (j / TUBE) * TAU;
      const [x, y, z] = generator(u, v);
      const k = (i * TUBE + j) * 3;
      out[k] = x;
      out[k + 1] = y;
      out[k + 2] = z;
    }
  }

  return out;
}

/**
 * Index pairs for the wireframe: each point links to its neighbour around the
 * tube and to the matching point on the next ring, which is what gives the
 * cloud its woven look.
 */
export function buildLineIndices(): Uint16Array {
  const out = new Uint16Array(POINT_COUNT * 4);
  let n = 0;

  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < TUBE; j++) {
      const self = i * TUBE + j;
      const nextInTube = i * TUBE + ((j + 1) % TUBE);
      const nextRing = ((i + 1) % RINGS) * TUBE + j;
      out[n++] = self;
      out[n++] = nextInTube;
      out[n++] = self;
      out[n++] = nextRing;
    }
  }

  return out;
}

/** A per-point random seed, used to stagger the morph so it ripples. */
export function buildSeeds(): Float32Array {
  const out = new Float32Array(POINT_COUNT);
  for (let i = 0; i < POINT_COUNT; i++) out[i] = Math.random();
  return out;
}
