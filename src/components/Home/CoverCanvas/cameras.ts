import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

const initCameras = (scene: BABYLON.Scene) => {
  let activeCameraIndex = 0;

  const importedCamera = scene.getCameraByName("Camera");
  importedCamera?.dispose();

  const mainCamera = getMainCamera(scene);
  const cnTowerCamera = getCnTowerCamera(scene);
  const airShipCamera = getAirShipCamera(scene);

  const allCameras = [mainCamera, cnTowerCamera, airShipCamera];
  const switchCamera = (index: number) => {
    scene.switchActiveCamera(allCameras[index], false);
  };
  switchCamera(0);

  // update airShipCamera before render
  const airShipCameraTarget = scene.getMeshByName('n');
  const airShipTarget = scene.getMeshByName("airShipCar");
  scene.onBeforeRenderObservable.add(() => {
    if (
      !airShipCameraTarget ||
      !airShipTarget
    ) return;
    airShipCamera.position = airShipTarget.getAbsolutePosition();
    airShipCamera.position.y += 2;
    airShipCamera.target = airShipCameraTarget.position;
  });

  // button to switch camera
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const button = GUI.Button.CreateSimpleButton("switchCameraButton", "Switch Camera");
  button.width = "150px";
  button.height = "40px";
  button.color = "#fff";
  button.background = "rgb(6,13,32)";
  button.thickness = 0;

  const container = new GUI.Rectangle();
  container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  container.adaptWidthToChildren = true;
  container.adaptHeightToChildren = true;
  container.paddingRight = 16;
  container.paddingBottom = 16;
  container.thickness = 0;

  container.addControl(button);
  advancedTexture.addControl(container);

  // add listener to button
  button.onPointerClickObservable.add(() => {
    activeCameraIndex++;
    if (activeCameraIndex === allCameras.length) {
      activeCameraIndex = 0;
    }
    switchCamera(activeCameraIndex);
  })

  return allCameras
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
  const camera = new BABYLON.FreeCamera("airShipCamera", new BABYLON.Vector3(0, -1, 0), scene);
  camera.fov = 1.5;

  return camera
}

export default initCameras
