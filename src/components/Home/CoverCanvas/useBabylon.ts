import * as BABYLON from 'babylonjs';
import createScene from "./createScene";
import {useCallback, useRef, useState} from "react";
import {useMount, useUnmount} from "react-use";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T
const useBabylon = (canvasId: string) => {
  const [babylonReady, setBabylonReady] = useState(false);

  const engineRef = useRef<null | BABYLON.Engine>(null);
  const sceneRef = useRef<null | BABYLON.Scene>(null);
  const intersectionObserverRef = useRef<null | IntersectionObserver>(null);
  const callbacksRef = useRef<null | (Awaited<ReturnType<typeof createScene>>)['callbacks']>(null);

  useMount(async () => {
    const canvas = document.getElementById(canvasId) as unknown as HTMLCanvasElement | null;
    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, true);
    const {scene, callbacks} = await createScene(engine, canvas); //Call the createScene function

    engineRef.current = engine;
    sceneRef.current = scene;
    callbacksRef.current = callbacks;

    startRender();
    window.addEventListener("resize", handleResize);
    initIntersectionObserver();
    setBabylonReady(true);
  });

  useUnmount(() => {
    stopRender();
    window.removeEventListener("resize", handleResize);
    intersectionObserverRef.current?.disconnect()
  })

  const startRender = useCallback(() => {
    engineRef.current?.stopRenderLoop();
    engineRef.current?.runRenderLoop(() => {
      sceneRef.current?.render();
    });
  }, []);

  const stopRender = useCallback(() => {
    engineRef.current?.stopRenderLoop();
  }, []);

  const handleResize = useCallback(() => {
    engineRef.current?.resize();
  }, []);

  const initIntersectionObserver = useCallback(() => {
    if (
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      typeof window.IntersectionObserverEntry.prototype === "object" &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
    ) {
      const THRESHOLD = 0.3;

      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio >= THRESHOLD) {
            startRender()
          } else {
            stopRender()
          }
        })
      }, {
        root: null,
        threshold: THRESHOLD
      });

      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      io.observe(canvas);
      intersectionObserverRef.current = io;
    }
  }, [canvasId, startRender, stopRender])

  return {
    callbacks: callbacksRef.current,
    babylonReady
  }
}

export default useBabylon
