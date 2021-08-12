import {useCallback, useEffect, useRef} from "react";
import * as THREE from 'three';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module'

//@ts-ignore
import * as SPECTOR from 'spectorjs';
const spector = new SPECTOR.Spector();
spector.displayUI();

const useWebGLBackground = <TContainerEl extends HTMLElement>(canMount: boolean) => {
  const containerRef = useRef<TContainerEl>(null);

  const main = useCallback(async () => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize( container.getBoundingClientRect().width, container.getBoundingClientRect().height );
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.current.appendChild( renderer.domElement );

    const stats = Stats();
    stats.domElement.style.zIndex = '1000';
    containerRef.current.appendChild(stats.dom);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 10, 10, 10 );
    camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight( 0x404040 );
    scene.add( light );

    const controls = new OrbitControls( camera, renderer.domElement );

    /**
     * Loaders
     */
    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Draco loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/webgl/draco/');

    // GLTF loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Textures
     */
    const bakedTextures = textureLoader.load('/assets/webgl/baked.jpg');
    bakedTextures.flipY = false;
    bakedTextures.encoding = THREE.sRGBEncoding;

    /**
     * Materials
     */
    const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTextures});
    const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5});
    const portalLightMaterial = new THREE.MeshBasicMaterial({color: 0xfffff, side: THREE.DoubleSide});

    /**
     * Model
     */
    gltfLoader.load(
      '/assets/webgl/portal.glb',
      (gltf) =>
      {
        console.log(gltf.scene);
        const map: {[key: string]: any} = {
          'Cube012': poleLightMaterial,
          'Cube018': poleLightMaterial,
          'Circle': portalLightMaterial
        }
        gltf.scene.traverse(child => {
          if (map[child.name] !== undefined) {
            // @ts-ignore
            child.material = map[child.name]
          } else {
            // @ts-ignore
            child.material = bakedMaterial
          }
        })
        scene.add(gltf.scene);
      }
    )

    function animate() {
      requestAnimationFrame( animate );

      controls.update();
      stats.update();
      renderer.render( scene, camera );
    }
    animate();


  }, []);

  useEffect(() => {
    if (!canMount) {
      return
    }

    main()
  }, [canMount, main])

  return {
    containerRef
  }
}

export default useWebGLBackground
