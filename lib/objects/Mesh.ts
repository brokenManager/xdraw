import EventSource from '../basis/EventSource';
import Sphere from '../basis/Sphere';
import Vector3 from '../basis/Vector3';

/**
 * @author RkEclair / https://github.com/RkEclair
 */
export default class Mesh extends EventSource {
  name = '';

  vertices: Vector3[] = [];
  colors = [];
  faces = [];
  faceVertexUvs = [[]];

  morphTargets = [];
  morphNormals = [];

  skinWeights = [];
  skinIndices = [];

  lineDistances = [];

  boundingBox = null;
  boundingSphere = new Sphere();

  // update flags
  elementsNeedUpdate = false;
  verticesNeedUpdate = false;
  uvsNeedUpdate = false;
  normalsNeedUpdate = false;
  colorsNeedUpdate = false;
  lineDistancesNeedUpdate = false;
  groupsNeedUpdate = false;

  computeBoundingSphere() {
    this.boundingSphere = Sphere.fromPoints(this.vertices);
  }

  mergeVertices() {
    const verticesMap = {};  // Hashmap for looking up vertices by position
                             // coordinates (and making sure they are unique)
    const unique = [], changes = [];

    const precisionPoints =
        4;  // number of decimal points, e.g. 4 for epsilon of 0.0001
    const precision = Math.pow(10, precisionPoints);

    for (let i = 0; i < this.vertices.length; i++) {
      const v = this.vertices[i];
      const key = Math.round(v.x * precision) + '_' +
          Math.round(v.y * precision) + '_' + Math.round(v.z * precision);

      if (verticesMap[key] === undefined) {
        verticesMap[key] = i;
        unique.push(this.vertices[i]);
        changes[i] = unique.length - 1;

      } else {
        // console.log('Duplicate vertex found. ', i, ' could be using ',
        // verticesMap[key]);
        changes[i] = changes[verticesMap[key]];
      }
    }


    // if faces are completely degenerate after merging vertices, we
    // have to remove them from the geometry.
    const faceIndicesToRemove = [];

    for (let i = 0; i < this.faces.length; ++i) {
      const face = this.faces[i];
      face.a = changes[face.a];
      face.b = changes[face.b];
      face.c = changes[face.c];
      const indices = [face.a, face.b, face.c];

      // if any duplicate vertices are found in a Face3
      // we have to remove the face as nothing can be saved
      for (let n = 0; n < 3; n++) {
        if (indices[n] === indices[(n + 1) % 3]) {
          faceIndicesToRemove.push(i);
          break;
        }
      }
    }

    for (const idx of faceIndicesToRemove) {
      this.faces.splice(idx, 1);
      this.faceVertexUvs.forEach(e => e.splice(idx, 1));
    }

    // Use unique set of vertices

    const diff = this.vertices.length - unique.length;
    this.vertices = unique;
    return diff;
  }
}
