import * as BABYLON from 'babylonjs';
import showWorldAxis from "./WorldAxis";

const createScene = async function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);
  scene.actionManager = new BABYLON.ActionManager(scene);
  showWorldAxis(1, scene);
  scene.debugLayer.show();

  await BABYLON.SceneLoader.AppendAsync(
    "/assets/",
    "toronto.babylon",
    scene
  );

  // environment
  const hdrTexture = new BABYLON.HDRCubeTexture("/assets/sky.hdr", scene, 128, false, true, false, true);
  scene.environmentTexture = hdrTexture;
  scene.clearColor = BABYLON.Color3.FromHexString('#80e5f7').toColor4(1);

  const importedCamera = scene.getCameraByName("Camera");
  console.log(importedCamera);
  importedCamera?.dispose();

  // const envLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 5, 0), scene);
  // envLight.intensity = 0.5;
  //
  // const light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, 0), scene);
  // light.diffuse = new BABYLON.Color3(0.8, 0.7, 0.7);
  // light.specular = new BABYLON.Color3(0.8, 0.8, 1);
  // light.position = new BABYLON.Vector3(0, 40, 0);
  // light.intensity = 0.5;

  // const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  // shadowGenerator.useBlurExponentialShadowMap = true;
  // shadowGenerator.addShadowCaster(sphere1.mesh);
  // shadowGenerator.addShadowCaster(sphere2.mesh);


  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -0.6 * Math.PI,
    0.25 * Math.PI,
    Math.PI,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  // camera.lockedTarget = sphere1.mesh;
  camera.attachControl();

  camera.radius = 30;
  camera.wheelPrecision = 20;
  camera.lowerBetaLimit = 0.25 * Math.PI;
  camera.upperBetaLimit = 0.48 * Math.PI;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 200;

  return scene;
};

export default createScene
