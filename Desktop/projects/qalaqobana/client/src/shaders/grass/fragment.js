export const grassFragment = `
varying vec2 vUv;
varying float vElevation;

   void main() {
    vec3 lowGrass = vec3(0.1, 0.4, 0.1);
    vec3 highGrass = vec3(0.2, 0.6, 0.2);

    vec3 color = mix(lowGrass, highGrass, vElevation * 0.5 + 0.5);

     gl_FragColor = vec4(color, 1.0);

   }
`;

