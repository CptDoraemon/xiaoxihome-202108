import * as BABYLON from 'babylonjs';

const initAnimations = (scene: BABYLON.Scene) => {
  propellerAnimation(scene);
  airShipAnimation(scene);
}

const propellerAnimation = (scene: BABYLON.Scene) => {
  const frameRate = 30;
  const rotation = new BABYLON.Animation(
    "propellerRotation",
    "rotation.x",
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );
  const keyFrames = [];
  keyFrames.push({
    frame: 0,
    value: 0,
  });
  keyFrames.push({
    frame: 2 * frameRate,
    value: 2 * Math.PI,
  });
  rotation.setKeys(keyFrames);

  const propeller = scene.getMeshByName('propeller');
  if (!propeller) return;
  propeller.animations.push(rotation);
  scene.beginAnimation(propeller, 0, 2 * frameRate, true);
}

const airShipAnimation = (scene: BABYLON.Scene) => {
  const airShipGroup = [
    scene.getMeshByName('propeller'),
    scene.getMeshByName('propeller.bearing'),
    scene.getMeshByName('wing.001'),
    scene.getMeshByName('wing.002'),
    scene.getMeshByName('airShipCar'),
    scene.getMeshByName('airShipCar.window'),
    scene.getMeshByName('airShipBody'),
    scene.getMeshByName('airShipCanada.001'),
    scene.getMeshByName('airShipCanada.002'),
    scene.getCameraByName('airShipCamera')
  ];
  const [
    propeller,
    propellerBearing,
    wing1,
    wing2,
    airShipCar,
    airShipCarWindow,
    airShipBody,
    airShipCanada1,
    airShipCanada2,
    airShipCamera
  ] = airShipGroup;

  const frameRate = 30;

  const root = new BABYLON.TransformNode('airshipRoot');
  const importedPosition = airShipBody?.position.clone() || new BABYLON.Vector3(0, 0, 0);
  root.position = importedPosition;
  root.position.z += 2;

  airShipGroup.forEach(mesh => {
    if (!mesh) return;
    mesh.parent = root;
    mesh.position.x -= importedPosition.x;
    mesh.position.y -= importedPosition.y;
    mesh.position.z -= importedPosition.z;
  });

  const r = new BABYLON.Animation(
    `airShipMove-r`,
    "rotation.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );
  r.setKeys([
    {
      frame: 0,
      value: -0.1 * Math.PI
    },
    {
      frame: 100 * frameRate,
      value: -0.1 * Math.PI + 2 * Math.PI,
    }
  ]);

  const y = new BABYLON.Animation(
    `airShipMove-r`,
    "position.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );
  y.setKeys([
    {
      frame: 0,
      value: importedPosition.y
    },
    {
      frame: 25 * frameRate,
      value: importedPosition.y,
    },
    {
      frame: 50 * frameRate,
      value: importedPosition.y + 1,
    },
    {
      frame: 75 * frameRate,
      value: importedPosition.y + 1,
    },
    {
      frame: 100 * frameRate,
      value: importedPosition.y,
    }
  ]);

  [r, y].forEach(ani => root.animations.push(ani));
  scene.beginAnimation(root, 0, 100 * frameRate, true);
}

export default initAnimations
