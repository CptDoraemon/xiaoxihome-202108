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
  ];
  // const [
  //   propeller,
  //   propellerBearing,
  //   wing1,
  //   wing2,
  //   airShipCar,
  //   airShipCarWindow,
  //   airShipBody,
  //   airShipCanada1,
  //   airShipCanada2
  // ] = airShipGroup;

  const frameRate = 30;
  const move = new BABYLON.Animation(
    "airShipMove",
    "position.x",
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
    frame: 5 * frameRate,
    value: -1,
  });
  move.setKeys(keyFrames);

  airShipGroup.forEach(mesh => {
    mesh!.animations.push(move);
    scene.beginAnimation(mesh, 0, 5 * frameRate, true);
  });
}

export default initAnimations
