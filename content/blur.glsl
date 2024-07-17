#define pow2(x) (x * x)

precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_mainTex;
uniform float u_sigma;

const float pi = atan(1.0) * 4.0;
const int samples = 16;

float gaussian(vec2 i, float sigma) {
  return 1.0 / (
    2.0 * pi * pow2(sigma)
  ) * exp(
    -((pow2(i.x) + pow2(i.y)) / (2.0 * pow2(sigma)))
  );
}

vec3 blur(sampler2D sp, vec2 uv, vec2 scale, float amount) {
  float sigma = float(samples) * clamp(amount, 0.00001, 1.0);
  vec4 tex = vec4(0.0);
  vec3 col = vec3(0.0);
  float accum = 0.0;
  float weight;
  vec2 offset;

  for (int x = -samples / 2; x < samples / 2; ++x) {
    for (int y = -samples / 2; y < samples / 2; ++y) {
      offset = vec2(x, y);
      weight = gaussian(offset, sigma);
      tex = texture2D(sp, uv + scale * offset).rgba;
      col += (tex.rgb * tex.a).rgb * weight;
      accum += weight;
    }
  }

  return col / accum;
}

void main() {
  vec2 ps = vec2(5.0) / u_resolution;
  vec2 uv = gl_FragCoord.xy / u_resolution;

  gl_FragColor = vec4(
    blur(u_mainTex, uv, ps, u_sigma).rgb,
    1.0
  );
}
