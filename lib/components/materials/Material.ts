import Color from '../../basis/Color';
import {Component} from '../../basis/Component';
import Vector3 from '../../basis/Vector3';

/**
 * @author MikuroXina / https://github.com/MikuroXina
 */

function extractAttributes(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  const locations: {[name: string]: number} = {};
  for (let i = 0; i < attributeCount; ++i) {
    const attribute = gl.getActiveAttrib(program, i);
    if (attribute === null) continue;
    locations[attribute.name] = i;
  }
  return locations;
}

function extractUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const uniforms: {[name: string]: WebGLUniformLocation} = {};
  for (let i = 0; i < uniformCount; ++i) {
    const uniform = gl.getActiveUniform(program, i);
    if (uniform === null) continue;
    const loc = gl.getUniformLocation(program, uniform.name);
    if (loc === null) continue;
    uniforms[uniform.name] = loc;
  }
  return uniforms;
}

function compileShader(
    gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) throw new Error('Fail to create shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw new Error('Fail to compile shader.')
}

export type ShaderProgramSet = {
  vertexShaderProgram: string,
  fragmentShaderProgram: string
};

export type UniformUpdater =
    (location: WebGLUniformLocation, gl: WebGL2RenderingContext, newV: any) =>
        void;

export const defaultShaderSet: ShaderProgramSet = {
  vertexShaderProgram: `
attribute vec4 position;
uniform mat4 modelViewProjection;
void main() {
  gl_Position = modelViewProjection * position;
}
`,
  fragmentShaderProgram: `
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 0.5, 1);
}
`
};

export const ColorUniform =
    (loc: WebGLUniformLocation, gl: WebGL2RenderingContext, color: Color) =>
        gl.uniform4f(loc, color.r, color.g, color.b, color.a);


export const Vector3Uniform =
    (loc: WebGLUniformLocation, gl: WebGL2RenderingContext, vec: Vector3) =>
        gl.uniform3f(loc, vec.x, vec.y, vec.z);

type MaterialProgram = {
  use: (vao: WebGLVertexArrayObject) => void,
  uniforms: {[key: string]: WebGLUniformLocation},
  attributes: {[key: string]: number}
};

export default class Material extends Component {
  protected uniforms: {[locationName: string]: UniformUpdater} = {};
  protected shaders:
      ShaderProgramSet = {vertexShaderProgram: '', fragmentShaderProgram: ''};

  render(_gl: WebGL2RenderingContext, _drawCall: (mode: number) => void) {}

  protected program?: MaterialProgram = undefined;

  apply(gl: WebGL2RenderingContext) {
    if (this.program !== undefined) {
      return this.program;
    }

    const vertexShader =
        compileShader(gl, gl.VERTEX_SHADER, this.shaders.vertexShaderProgram);
    const fragmentShader = compileShader(
        gl, gl.FRAGMENT_SHADER, this.shaders.fragmentShaderProgram);
    const program = gl.createProgram();
    if (program === null) throw new Error('Fail to create program.');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Fail to link shaders.')
    }

    gl.useProgram(program);
    this.program = {
      use: (vao: WebGLVertexArrayObject) => {
        gl.useProgram(program);
        gl.bindVertexArray(vao);
      },
      uniforms: extractUniforms(gl, program),
      attributes: extractAttributes(gl, program)
    };
    return this.program;
  }
}