/**
 * @author RkEclair / https://github.com/RkEclair
 */

import Color from '../basis/Color';
import { CombineOperation } from '../cameras/DrawTypes';
import Material from './Material';

export default class Unlit extends Material {
  color = new Color(0xffffff);

  map = null;

  lightMap = null;
  lightMapIntensity = 1.0;

  aoMap = null;
  aoMapIntensity = 1.0;

  specularMap = null;

  alphaMap = null;

  envMap = null;
  combine: CombineOperation = 'Multiply';
  reflectivity = 1;
  refractionRatio = 0.98;

  wireframe = false;
  wireframeLinewidth = 1;
  wireframeLinecap = 'round';
  wireframeLinejoin = 'round';

  skinning = false;
  morphTargets = false;

  lights = false;

  clone() {
    const newM = new Unlit();
    newM.color = this.color.clone();

    newM.map = this.map;

    newM.lightMap = this.lightMap;
    newM.lightMapIntensity = this.lightMapIntensity;

    newM.aoMap = this.aoMap;
    newM.aoMapIntensity = this.aoMapIntensity;

    newM.specularMap = this.specularMap;

    newM.alphaMap = this.alphaMap;

    newM.envMap = this.envMap;
    newM.combine = this.combine;
    newM.reflectivity = this.reflectivity;
    newM.refractionRatio = this.refractionRatio;

    newM.wireframe = this.wireframe;
    newM.wireframeLinewidth = this.wireframeLinewidth;
    newM.wireframeLinecap = this.wireframeLinecap;
    newM.wireframeLinejoin = this.wireframeLinejoin;

    newM.skinning = this.skinning;
    newM.morphTargets = this.morphTargets;
  }

  toJSON() {
    throw new Error('Not implemented');
  }
}
