import {useCallback, useEffect, useRef} from "react";
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

// @ts-ignore
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

const useWebGLBackground = <TContainerEl extends HTMLElement>(canMount: boolean) => {
  const containerRef = useRef<TContainerEl>(null);

  const main = useCallback(async () => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );

    const sun = new THREE.Vector3();
    const controls = new OrbitControls( camera, renderer.domElement );
    let water: Water;
    // let mesh: THREE.Mesh;

    // @ts-ignore
    const stats = new Stats();

    init();
    animate();

    function init() {
      if (!containerRef.current) {
        return
      }

      renderer.setSize( container.getBoundingClientRect().width, container.getBoundingClientRect().height );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      containerRef.current.appendChild( renderer.domElement );

      camera.position.set( 30, 30, 100 );

      // Water

      const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

      water = new Water(
        waterGeometry,
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load( '/assets/webgl/textures/waternormals.jpeg', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          } ),
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined
        }
      );

      water.rotation.x = - Math.PI / 2;

      scene.add( water );

      // Skybox

      const sky = new Sky();
      sky.scale.setScalar( 10000 );
      scene.add( sky );

      const skyUniforms = sky.material.uniforms;

      skyUniforms[ 'turbidity' ].value = 10;
      skyUniforms[ 'rayleigh' ].value = 2;
      skyUniforms[ 'mieCoefficient' ].value = 0.005;
      skyUniforms[ 'mieDirectionalG' ].value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180
      };

      const pmremGenerator = new THREE.PMREMGenerator( renderer );

      function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        // @ts-ignore
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        // @ts-ignore
        scene.environment = pmremGenerator.fromScene( sky ).texture;

      }

      updateSun();

      //

      const geometry = new THREE.BoxGeometry( 30, 30, 30 );
      const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

      // mesh = new THREE.Mesh( geometry, material );
      // scene.add( mesh );

      //

      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set( 0, 10, 0 );
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      //
      container.appendChild( stats.dom );

      // GUI

      const gui = new GUI();

      const folderSky = gui.addFolder( 'Sky' );
      folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
      folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
      folderSky.open();

      // @ts-ignore
      const waterUniforms = water.material.uniforms;

      const folderWater = gui.addFolder( 'Water' );
      folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
      folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
      folderWater.open();


      window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      requestAnimationFrame( animate );
      render();
      stats.update();

    }

    function render() {

      // const time = performance.now() * 0.001;

      // mesh.position.y = Math.sin( time ) * 20 + 5;
      // mesh.rotation.x = time * 0.5;
      // mesh.rotation.z = time * 0.51;

      // @ts-ignore
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

      renderer.render( scene, camera );

    }

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
