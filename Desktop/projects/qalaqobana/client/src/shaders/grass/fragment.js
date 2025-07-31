export const grassFragment = `
varying vec2 vUv;
varying float vElevation;
uniform float uSeason;

   void main() {
     vec3 color;

     if(uSeason < 0.5) {
      //spring

      vec3 low = vec3(0.2, 0.6, 0.2);
      vec3 high = vec3(0.5, 0.9, 0.5);
      float blend = smoothstep(0.0, 2.5, vElevation);
      color = mix(low, high, blend);
     } else if (uSeason < 2.5) {
      //summer
      
      vec3 low = vec3(0.1, 0.4, 0.1);
      vec3 high = vec3(0.8, 0.7, 0.3);
      float blend = smoothstep(0.0, 2.5, vElevation);
      color = mix(low, high, blend);
    } else if (uSeason < 2.5) {
      // Autumn
      vec3 low = vec3(0.4, 0.25, 0.1);
      vec3 high = vec3(0.9, 0.6, 0.2);
      float blend = smoothstep(0.0, 2.5, vElevation);
      color = mix(low, high, blend);
    } else {
      //winter
      
      vec3 low = vec3(0.6, 0.6, 0.6);
      vec3 high = vec3(1.0, 1.0, 1.0);
      float blend = smoothstep(0.0, 2.5, vElevation);
      color = mix(low, high, blend);
    }

  gl_FragColor = vec4(color, 1.0);

   }
`;

