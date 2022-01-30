import * as BABYLON from 'babylonjs';
import CelestialSphere from "./CelestialSphere";

const initEnvironment = async (scene: BABYLON.Scene) => {

  // Skybox
  const skyTexture = new BABYLON.Texture("assets/sunset4.png", scene, true);
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:520.0}, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = skyTexture
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.FIXED_EQUIRECTANGULAR_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.infiniteDistance = false;
  skybox.material = skyboxMaterial;


  // Hemi Light
  const hl = new BABYLON.HemisphericLight('Hl',new BABYLON.Vector3(0,1,0),scene);
  hl.intensity = 1;


  // Stars
  let assetsManager = new BABYLON.AssetsManager(scene);
  let starDataTask = assetsManager.addTextFileTask("starData", "/assets/star/starData.json");

  const starLimit = 5000;
  const starScale = 0.5;
  const radius = 150
  const showAsterisms = true;
  const asterismColor = new BABYLON.Color3(0, 0, 0.7);
  const twinkleStars = true;

  starDataTask.onSuccess = (starDataTask) => {
    const starData = JSON.parse(starDataTask.text);
    const celestialSphere = new CelestialSphere("celestialSphere", scene, starData, radius, starLimit, starScale, showAsterisms, asterismColor, twinkleStars);
  }
  assetsManager.load();
}

export default initEnvironment
