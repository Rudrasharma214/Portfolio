/**
 * Shaders for the hero point cloud.
 *
 * The morph runs here rather than in JS: `position` holds the shape the cloud
 * is leaving, `aTarget` the shape it is heading to, and `uProgress` drives the
 * blend. That keeps the per-frame cost on the GPU — JS only touches the buffers
 * once per mode change.
 */

/** How much of the progress range is spent staggering points, 0–1. */
const STAGGER = 0.35;

export const morphVertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uBreathe;

  attribute vec3 aTarget;
  attribute float aSeed;

  varying float vDepth;

  float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    // Offset each point's start by its seed so the shape ripples into place
    // instead of snapping across as one rigid body.
    float offset = aSeed * ${STAGGER.toFixed(2)};
    float t = clamp((uProgress - offset) / (1.0 - ${STAGGER.toFixed(2)}), 0.0, 1.0);
    vec3 morphed = mix(position, aTarget, easeInOut(t));

    // A slow outward breath, so the cloud is never completely inert.
    morphed += normalize(morphed + 0.0001)
             * sin(uTime * 0.6 + aSeed * 6.2831853)
             * 0.014 * uBreathe;

    vec4 mv = modelViewMatrix * vec4(morphed, 1.0);
    gl_Position = projectionMatrix * mv;

    // 0 at the front of the cloud, 1 at the back — drives colour and alpha.
    vDepth = clamp((-mv.z - 3.0) / 3.2, 0.0, 1.0);

    gl_PointSize = uSize * (1.0 - vDepth * 0.5) * (260.0 / -mv.z);
  }
`;

export const pointFragmentShader = /* glsl */ `
  uniform vec3 uNear;
  uniform vec3 uFar;

  varying float vDepth;

  void main() {
    // Carve a soft disc out of the square point sprite.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float edge = 1.0 - smoothstep(0.22, 0.5, d);
    float alpha = edge * mix(0.95, 0.18, vDepth);

    gl_FragColor = vec4(mix(uNear, uFar, vDepth), alpha);
  }
`;

export const lineFragmentShader = /* glsl */ `
  uniform vec3 uNear;
  uniform vec3 uFar;

  varying float vDepth;

  void main() {
    gl_FragColor = vec4(mix(uNear, uFar, vDepth), mix(0.4, 0.04, vDepth));
  }
`;
