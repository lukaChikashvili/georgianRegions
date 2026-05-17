export const grassVertex = `
    uniform float uTime;

    varying vec2 vUv;
    varying float vElevation;


    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      vec3 permute(vec3 x) {
        return mod289(((x*34.0)+1.0)*x);
      }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626, // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute(
                    i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 x = fract(p * C.w) * 2.0 - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        vec2 g0 = vec2(a0.x, h.x);
        vec2 g1 = vec2(a0.y, h.y);
        vec2 g2 = vec2(a0.z, h.z);
        vec3 norm = inversesqrt(vec3(dot(g0,g0), dot(g1,g1), dot(g2,g2)));
        g0 *= norm.x;
        g1 *= norm.y;
        g2 *= norm.z;
        float n = dot(g0, x0.xy);
        n += dot(g1, x12.xy);
        n += dot(g2, x12.zw);
        return 70.0 * n;
      }

   void main() {
    
   vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = snoise(modelPosition.xz * 2.0);
  elevation *= 0.1;
  modelPosition.y += elevation;

  float sway = sin(modelPosition.x * 0.5 + uTime * 2.0) * 0.03;
  sway += cos(modelPosition.z * 0.8 + uTime * 1.5) * 0.5;
  modelPosition.x += sway;

  vElevation = elevation;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
   }

`;