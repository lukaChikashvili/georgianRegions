export const clothVertex = `
   
    uniform float uAmplitude;
    uniform float uWaveLength;
    uniform float uTime;
    varying vec2 vUv;


   void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float waveX = sin(position.x * uWaveLength + uTime);
    float waveZ = cos(position.z * uWaveLength * 0.7 + uTime * 1.2);
    float waveOffset = sin((position.x + position.z) * 0.5 + uTime * 0.5);
  
    float wave = (waveX + waveZ + waveOffset) / 3.0;
  
    modelPosition.z += wave * uAmplitude * 5.0;
    modelPosition.y += wave * uAmplitude * 1.5; 

    vUv = uv;
  
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
   }
`;
