import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const geometry= new THREE.IcosahedronGeometry(1.0);
//const material = new THREE.MeshBasicMaterial( { color: 0x007F00 } );
const material = new THREE.ShaderMaterial( {

	uniforms: {
		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() }
	},

	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent

} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
const light = new THREE.AmbientLight( 0x7F0000 ); // red light
scene.add( light );
const plight = new THREE.PointLight( 0x0000FF, 1, 100 );
plight.position.set( 5, 5, 5 );
scene.add( plight );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();