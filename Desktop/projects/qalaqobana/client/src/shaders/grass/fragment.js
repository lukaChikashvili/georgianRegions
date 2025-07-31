export const grassFragment = `
varying vec2 vUv;
varying float vElevation;

   void main() {
    vec3 grassLow = vec3(0.1, 0.4, 0.1);
  vec3 grassHigh = vec3(0.3, 0.7, 0.3);

  float blendFactor = smoothstep(0.0, 2.5, vElevation);
  vec3 color = mix(grassLow, grassHigh, blendFactor);

  gl_FragColor = vec4(color, 1.0);

   }
`;

