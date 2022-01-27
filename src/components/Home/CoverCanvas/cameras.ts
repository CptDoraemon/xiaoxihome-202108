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

  // postEffects
  const pipeline = initPostEffects(scene);
  pipeline.addCamera(allCameras[activeCameraIndex]);

  // add listener to button
  button.onPointerClickObservable.add(() => {
    pipeline.removeCamera(allCameras[activeCameraIndex]);
    activeCameraIndex++;
    if (activeCameraIndex === allCameras.length) {
      activeCameraIndex = 0;
    }
    switchCamera(activeCameraIndex);
    pipeline.addCamera(allCameras[activeCameraIndex]);
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

const initPostEffects = (scene: BABYLON.Scene) => {
  // post fx
  // volumetric light
  const sunMesh = BABYLON.Mesh.CreatePlane("sunMesh", 3, scene);
  const sunMeshMaterial = new BABYLON.StandardMaterial('sunSourceMaterial', scene);
  sunMeshMaterial.emissiveColor = BABYLON.Color3.FromHexString('#fbe9e7');
  //@ts-ignore
  sunMeshMaterial.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  sunMeshMaterial.diffuseTexture = new BABYLON.Texture("/assets/sun.png", scene);
  sunMeshMaterial.diffuseTexture.hasAlpha = true;
  sunMesh.material = sunMeshMaterial;
  sunMesh.position = new BABYLON.Vector3(-10, 0.5, 100);
  // const vls = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1, allCameras[0], sunMesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
  // vls.useDiffuseColor = true;
  // vls.exposure = 0.8;
  // vls.samples = 4;

  //render pipeline
  const pipeline = new BABYLON.DefaultRenderingPipeline(
    "defaultPipeline", // The name of the pipeline
    true, // Do you want the pipeline to use HDR texture?
    scene, // The scene instance
    [] // The list of cameras to be attached to
  );
  pipeline.imageProcessing.vignetteEnabled = true;
  pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0,0,0, 1);
  pipeline.imageProcessing.vignetteWeight = 10;
  pipeline.samples = 4;
  // pipeline.fxaaEnabled = true;
  pipeline.bloomEnabled = true;
  pipeline.bloomWeight = 0.1;
  pipeline.sharpenEnabled = true;
  pipeline.sharpen.edgeAmount = 0.2; // default 0.3
  pipeline.imageProcessing.contrast = 1; // default 1
  pipeline.imageProcessing.exposure = 1; // default 1

  return pipeline
}

export default initCameras
