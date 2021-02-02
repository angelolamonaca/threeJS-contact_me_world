import * as THREE from 'three.module.js';
import { OrbitControls } from 'OrbitControls.js';
import { ColladaLoader } from 'ColladaLoader.js';

let clock, camera, scene, renderer, mixer;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 15, 10, - 15 );

    scene = new THREE.Scene();

    clock = new THREE.Clock();

    const loadingManager = new THREE.LoadingManager( () => {

        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );

        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

    } );

    // collada

    const loader = new ColladaLoader( loadingManager );
    loader.load( 'https://threejs.org/examples/models/collada/stormtrooper/stormtrooper.dae', ( collada ) => {

        const animations = collada.animations;
        const avatar = collada.scene;

        mixer = new THREE.AnimationMixer( avatar );
        const action = mixer.clipAction( animations[ 0 ] ).play();

        scene.add( avatar );

    } );

    //

    const gridHelper = new THREE.PolarGridHelper( 8, 16 );
    scene.add( gridHelper );

    //

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set( 1, 1, - 1 );
    scene.add( directionalLight );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 2, 0 );
    controls.update();

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    const delta = clock.getDelta();

    if ( mixer !== undefined ) mixer.update( delta );

    renderer.render( scene, camera );

}

function onTransitionEnd( event ) {

    event.target.remove();

}
