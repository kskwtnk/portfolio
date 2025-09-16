varying vec2 vUv;
uniform float scrollOffset;

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225  // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(cos(dot(p, k1)) * 12345.6789);
}

void main() {
  vec3 color1 = vec3(0.5, 0.25, 0.25);
  vec3 color2 = vec3(0.25, 0.5, 0.5);

  vec2 uv1 = vUv;
  vec2 uv2 = vUv;

  uv1 += scrollOffset;
  uv2 += scrollOffset;

  // Generate first noise pattern
  uv1.y *= random(vec2(uv1.y, 0.4));
  float noise1 = random(uv1);

  // Generate second noise pattern with different seed
  uv2.y *= random(vec2(uv2.y, 0.7));
  float noise2 = random(uv2);

  vec3 layer1 = color1 * (1.0 - noise1) + 0.9;
  vec3 layer2 = color2 * (1.0 - noise2) + 0.9;

  vec3 color = mix(layer1, layer2, 0.5) - 0.05;
  gl_FragColor = vec4(color, 1.0);
}
