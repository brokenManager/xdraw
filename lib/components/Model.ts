/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 * @author MikuroXina / https://github.com/MikuroXina
 */

import Transform from '../basis/Transform';
import Unlit from './materials/Unlit';
import BoxMesh from './meshes/BoxMesh';
import PlaneMesh from './meshes/PlaneMesh';
import Diffuse from './materials/Diffuse';

export function BackgroundPlane(width = 1, height = 1) {
  const t = new Transform;
  t.recieveRaycast = false;
  t.recieveShadow = false;
  t.castShadow = false;
  t.addComponent(new PlaneMesh(width, height));
  t.addComponent(new Unlit());
  return t;
}

export function BackgroundBox(width = 1, height = 1, depth = 1) {
  const t = new Transform;
  t.addComponent(new BoxMesh(width, height, depth));
  t.addComponent(new Unlit());
  return t;
}

export function SimpleBox(width = 1, height = 1, depth = 1) {
  const t = new Transform;
  t.addComponent(new BoxMesh(width, height, depth));
  t.addComponent(new Diffuse());
  return t;
}
