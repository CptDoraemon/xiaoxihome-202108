import * as BABYLON from 'babylonjs';
import createScene from "./createScene";

const main = async (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas, true);
  const scene = await createScene(engine, canvas); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
}

export default main
