import * as BABYLON from 'babylonjs';

const initCameras = (scene: BABYLON.Scene) => {
  let activeCamera: BABYLON.Camera;

  const importedCamera = scene.getCameraByName("Camera");
  importedCamera?.dispose();

  const mainCamera = getMainCamera(scene);
  const cnTowerCamera = getCnTowerCamera(scene);
  const airShipCamera = getAirShipCamera(scene);

  activeCamera = airShipCamera;
  scene.switchActiveCamera(activeCamera, true)

  return {
    activeCamera,
    airShipCamera
  }
}

const getMainCamera = (scene: BABYLON.Scene) => {
  const importedCameraTarget = scene.getMeshByName('cameraTarget');
  const targetVector = importedCameraTarget?.position || new BABYLON.Vector3(0, 0, 0);
  const camera = new BABYLON.ArcRotateCamera(
    "mainCamera",
    -0.5 * Math.PI,
    0 * Math.PI,
    Math.PI, // radius: the distance from the target
    targetVector, // target
    scene
  );

  camera.position = new BABYLON.Vector3(0, 0.33, -4);
  camera.wheelPrecision = 20;
  camera.lowerBetaLimit = 0.25 * Math.PI;
  camera.upperBetaLimit = 0.6 * Math.PI;

  const distanceToTarget = targetVector.subtract(camera.position).length();
  camera.lowerRadiusLimit = distanceToTarget;
  camera.upperRadiusLimit = distanceToTarget;
  camera.fov = 1.4;
  camera.panningSensibility = 0; // disable right mouse button drag / 2 finger move to move camera position

  return camera
}

const getCnTowerCamera = (scene: BABYLON.Scene) => {
  const importedCameraTarget = scene.getMeshByName('restaurant');
  const targetVector = importedCameraTarget?.position || new BABYLON.Vector3(0, 0, 0);
  const radius = 2;
  const beta = 0.35 * Math.PI;
  const camera = new BABYLON.ArcRotateCamera(
    "cnTowerCamera",
    3.874,
    beta,
    radius, // radius: the distance from the target
    targetVector, // target
    scene
  );

  camera.wheelPrecision = 20;
  camera.lowerBetaLimit = beta;
  camera.upperBetaLimit = beta;

  camera.lowerRadiusLimit = radius;
  camera.upperRadiusLimit = radius;
  camera.fov = 0.7;
  camera.panningSensibility = 0; // disable right mouse button drag / 2 finger move to move camera position

  return camera
}

const getAirShipCamera = (scene: BABYLON.Scene) => {
  const lockTarget = scene.getMeshByName('cameraTarget');

  const radius = 2;
  const beta = 0.35 * Math.PI;
  const camera = new BABYLON.ArcRotateCamera(
    "airShipCamera",
    0,
    beta,
    radius, // radius: the distance from the target
    new BABYLON.Vector3(0, 0, 0), // target
    scene
  );
  camera.lockedTarget = lockTarget;
  camera.position = new BABYLON.Vector3(0, 0, 0);

  camera.wheelPrecision = 20;
  camera.lowerBetaLimit = beta;
  camera.upperBetaLimit = beta;

  camera.fov = 0.7;
  camera.panningSensibility = 0; // disable right mouse button drag / 2 finger move to move camera position

  return camera
}

export default initCameras
