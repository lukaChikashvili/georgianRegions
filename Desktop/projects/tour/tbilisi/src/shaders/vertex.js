export const vertex = `
   uniform float uBigWavesElevation;   

     void main() {
        

     vec3 newPosition = position;
     float elevation = sin(newPosition.x) * uBigWavesElevation;
     newPosition.y += elevation;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  }
`;
