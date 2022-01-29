import * as BABYLON from 'babylonjs';

const initEnvironment = (scene: BABYLON.Scene) => {
  const skyTexture = new BABYLON.Texture("assets/sunset4.png", scene, true);
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:220.0}, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = skyTexture
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.FIXED_EQUIRECTANGULAR_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.infiniteDistance = false;
  skybox.material = skyboxMaterial;

  const hl = new BABYLON.HemisphericLight('Hl',new BABYLON.Vector3(0,1,0),scene);
  hl.intensity = 1;
}

export default initEnvironment
