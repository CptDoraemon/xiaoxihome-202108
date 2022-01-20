import * as BABYLON from 'babylonjs';
import showWorldAxis from "./WorldAxis";
import * as MATERIAL from 'babylonjs-materials';
import initOceanShader from "./shaders/oceanShader";

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
  // const hdrTexture = new BABYLON.HDRCubeTexture("/assets/sky.hdr", scene, 128, false, true, false, true);
  // scene.environmentTexture = hdrTexture;
  //sky
  const skyBox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  const skyMaterial = new MATERIAL.SkyMaterial('sky', scene);
  skyMaterial.backFaceCulling = false;
  skyMaterial.luminance = 1; // Controls the overall luminance of sky in interval ]0, 1,190[
  skyMaterial.turbidity = 1; // Represents the amount (scattering) of haze as opposed to molecules in atmosphere
  skyMaterial.inclination = 0.4; // The solar inclination, related to the solar azimuth in interval [0, 1]
  skyMaterial.azimuth = 0.25; // The solar azimuth in interval [0, 1]
  skyBox.material = skyMaterial;

  //water
  const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 64, 64, 32, scene, false);
  waterMesh.position = new BABYLON.Vector3(0, -1, 0);
  initOceanShader();
  const waterMaterial = new BABYLON.ShaderMaterial(
    "oceanShaderMaterial",
    scene,
    {
      vertex: "ocean",
      fragment: "ocean",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
    },
  );
  var mainTexture = new BABYLON.Texture("/assets/amiga.jpeg", scene);
  waterMaterial.setTexture("textureSampler", mainTexture);
  waterMaterial.backFaceCulling = false;
  waterMesh.material = waterMaterial;

  const importedCamera = scene.getCameraByName("Camera");
  importedCamera?.dispose();

  // lights
  const light = new BABYLON.DirectionalLight('Sun', new BABYLON.Vector3(-2, -1, 2.5), scene);
  light.intensity = 0.2;
  light.diffuse = BABYLON.Color3.FromHexString('#FFA757');

  const hl = new BABYLON.HemisphericLight('Hl',new BABYLON.Vector3(0,1,0),scene);
  hl.intensity = 0.7;

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
    new BABYLON.Vector3(0, 1, 0),
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
  camera.fov = 1.4;

  return scene;
};

export default createScene