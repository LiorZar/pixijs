// Pixi texture info
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// Tint
uniform vec4 uColor;

// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange
uniform float uFWidth;

//--------------------------------------------------------------------------------------------------------------------//
const float LINE = 0.45;
const float OUTTER_LINE_MIN = 0.4;
const float OUTTER_LINE_MAX = 0.7;
const float INNER_LINE_MIN = 0.51;
const float INNER_LINE_MAX = 0.55;
//--------------------------------------------------------------------------------------------------------------------//

void main(void) {

  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.
  vec4 texColor = texture2D(uSampler, vTextureCoord);

  // MSDF
  float median = texColor.r + texColor.g + texColor.b -
                  min(texColor.r, min(texColor.g, texColor.b)) -
                  max(texColor.r, max(texColor.g, texColor.b));
  // SDF
  median = min(median, texColor.a);

  float screenPxDistance = uFWidth * (median - 0.5);
  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
  if (median < 0.01) {
    alpha = 0.0;
  } else if (median > 0.99) {
    alpha = 1.0;
  }

  vec3 clr = uColor.rgb;
  // Gamma correction for coverage-like alpha
  float luma = dot(clr, vec3(0.299, 0.587, 0.114));
  float gamma = mix(1.0, 1.0 / 2.2, luma);
  float coverage = pow(uColor.a * alpha, gamma);  
  
  if(median <= OUTTER_LINE_MAX)
    clr = mix(vec3(0), clr, smoothstep(LINE, OUTTER_LINE_MAX, median));

  // NPM Textures, NPM outputs
  gl_FragColor = vec4(clr, coverage);
}
