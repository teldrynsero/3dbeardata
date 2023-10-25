import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const gridHelper = new THREE.GridHelper( 30, 30 );
scene.add( gridHelper );

const material = new THREE.ShaderMaterial( {

	uniforms: {
		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() }
	},

	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent

} );
//const material = new THREE.MeshBasicMaterial( { color: 0x007F00 } );

//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const shapes=new Array();
for (let x=-10;x<10;x++) {
	for(let y=-10;y<10;y++) {
      let geometry= new THREE.IcosahedronGeometry(1.0);
      geometry.translate(x*3,10,y*3);
      let crystal = new THREE.Mesh( geometry, material );
	  crystal.MyPos=new THREE.Vector3(x*3,10,y*3);
	  shapes.push(crystal);
	  scene.add( crystal );
	}
}

const light = new THREE.AmbientLight( 0x7F0000 ); // red light
scene.add( light );

const plight = new THREE.PointLight( 0x00FFFF, 1, 100 );
plight.position.set( 5, 5, 5 );
scene.add( plight );

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( plight, sphereSize );
scene.add( pointLightHelper );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 30;
camera.rotation.x = 0;
let angle=0.0;
let angle2=0.0;
controls.update();

function animate() {
	requestAnimationFrame( animate );
	angle+=0.06;
	angle2+=0.06;
	let first=true;
	shapes.forEach((shape)=>{
	   if (first) console.log(shape);
	   first=false;
       let xangle=shape.MyPos.x/5+angle;
	   let zangle=shape.MyPos.z/5+angle2;
	   shape.position.y=2*Math.cos(xangle)+2*Math.sin(zangle);
	  // shape.rotation.z += 0.001;
	}
	);
	controls.update();
	renderer.render( scene, camera );
}
animate();