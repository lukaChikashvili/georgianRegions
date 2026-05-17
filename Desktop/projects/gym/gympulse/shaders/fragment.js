export const grassFragment = `
varying vec2 vUv;
varying float vElevation;
uniform float uSeason;

void main() {
    vec3 color;
    float mixLevel = smoothstep(0.0, 2.5, vElevation);
  
    if(uSeason < 0.5) {
        // --- SPRING:  ---
        vec3 low  = vec3(0.01, 0.08, 0.03); 
        vec3 high = vec3(0.08, 0.35, 0.06);  
        color = mix(low, high, mixLevel);  
      
  
    } else if (uSeason < 1.5) {
        // --- SUMMER:  ---
        vec3 low  = vec3(0.02, 0.05, 0.02); 
     
        vec3 high = vec3(0.15, 0.22, 0.08); 
        color = mix(low, high, smoothstep(0.0, 2.5, vElevation));
        
       
        vec3 sunsetGlow = vec3(1.0, 0.4, 0.0); 
        float glowStrength = smoothstep(1.2, 2.8, vElevation);
        //color = mix(color, sunsetGlow, glowStrength * 0.02);
        color = mix(color, sunsetGlow, glowStrength * 0.6);
        
    } else if (uSeason < 2.5) {
        // --- AUTUMN: ---
        vec3 low  = vec3(0.20, 0.18, 0.05);
        vec3 high = vec3(0.65, 0.60, 0.20);
        color = mix(low, high, mixLevel);
  
    } else {
        // --- WINTER---
        vec3 low  = vec3(0.2, 0.25, 0.35);  // Icy blue-grey shadow
        vec3 high = vec3(0.9, 0.95, 1.0);   // Crisp white frost
       
        color = mix(low, high, smoothstep(0.0, 3.5, vElevation));
    }
  
    // --- Lighting & Shadow ---
   
    float ao = smoothstep(-0.2, 1.2, vElevation);
    color *= mix(0.15, 1.0, ao);
  
    gl_FragColor = vec4(color, 1.0);
  

}
`;