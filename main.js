import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Use the fetch API to load JSON data from an external file
fetch('beardata.json')
  .then(response => response.json())
  .then(data => {
    renderBearModels(data);
    //bearData = data;
    //console.log(data);
  })
  .catch(error => {
    console.error('Error loading JSON data:', error);
  });

  /*
function createCubModel(onCubModelLoad) {
  const cubLoader = new GLTFLoader();

  cubLoader.load('/low-poly_brown_bear.glb', function (cubGltf) {
    const cubModel = cubGltf.scene;
    onCubModelLoad(cubModel);
  }, undefined, function (error) {
    console.error('Error loading cub model:', error);
  });
}
*/

// Set up scene
const scene = new THREE.Scene();
// Set up camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// Set background color
//scene.background = new THREE.Color(0xeeeeee);

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new GLTFLoader();
camera.position.set( 0, 0, 10 );

// Camera position
const zoomSpeed = 0.1;
const moveXSpeed = 0.1;
const moveYSpeed = 0.1;

// Set up lights
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 100, 100, -10 );
scene.add( dirLight );


scene.background = new
THREE.CubeTextureLoader()
	.setPath( 'sky/' )
	.load( [
				'px.jpg',
				'nx.jpg',
				'py.jpg',
				'ny.jpg',
				'pz.jpg',
				'nz.jpg'
			] );


// Array of bears
const bearModels = [];
const cubModels = []; // Add a new array for cub models

const textureMappings = {
  KATM: 'KATM',
  KOD: 'KOD',
  LACL: 'LACL',
};

// Render bears from json file
function renderBearModels(bearData) {
  //const bearSpacing = 2; // Spacing between bears
  //const totalBears = bearData.length;

  // Bear x position
  let x = -6;
  // Bear y position
  let y = 8;

  bearData.forEach(function(bearData, index) {
    loader.load( '/low-poly_brown_bear.glb', function ( gltf ) {
      const bearModel = gltf.scene;
      //bearModel.name = bearData["BearNo"];
      bearModels.push(bearModel);
      

      //scene.add(bearModel);

      /*
      if (bearData.CubAge != "None") {
        createCubModel(function (cubModel) {
          console.log(x);
          console.log("MAKING A CUB");
          const cubScaleFactor = 0.5;
          cubModel.scale.set(cubScaleFactor, cubScaleFactor, cubScaleFactor);
          cubModel.position.set(x + 2, y + 2, 0);
          cubModels.push(cubModel); // Push the cub model to the array
          scene.add(cubModel);
        });
      }
      */

      bearModel.position.set(x, y, 0); // Set the position of the bear model

      if (index % 8 == 0) { // Bears are in rows of 8
        y = y - 1.5;
        x = -6;
        //console.log("Bear #" + index + " is going down.");
      }

      const bearpop = bearData["BearPop"];
      if (textureMappings[bearpop]) {
        //console.log("Hello from bear #" + bearData.BearPop + ": " + bearData.BearNo);
        bearModel.traverse(function (child) {
          //console.log("Material for Mesh:", child.material);
          if (child.isMesh && child.material.name === 'Brown_bear') {
            // Change the color for materials with the name 'brown_bear'
            if (bearData.BearPop == "KATM")
            {
              child.material.color.setRGB(0.255, 0.859, 0.949);
            }
            if (bearData.BearPop == "KOD")
            {
              child.material.color.setRGB(1.0, 0.647, 0.471);;
            }
            if (bearData.BearPop == "LACL")
            {
              child.material.color.setRGB(0.561, 0.812, 0.357);;
            }
          }
        });
      }

      // Scale bears based on given body mass
      const bodyMass = bearData["NetBodyMass(kg)"];
      const scaleFactor = 0.01;
      bearModel.scale.set(scaleFactor * bodyMass, scaleFactor * bodyMass, scaleFactor * bodyMass);

      // Set the position of the bear model
      bearModel.position.x = x;
      bearModel.position.y = y;

      //bearModel.scale.set(1,1,1);

      // Set x for next bear
      x = x + 2;
      //y++;

      scene.add(bearModel);
      animate();

    }, undefined, function ( error ) {

      console.error( error );

    });
    //console.log("CUB MODELS: " );
    //console.log(cubModels);
    //console.log("BEAR MODELS: " );
    //console.log(bearModels);
    //console.log("Hello from bear #" + index + ": " + bearData.BearNo);
  }); 
}


// Function to handle window resize
function handleWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // Update renderer size
  renderer.setSize(newWidth, newHeight);

  // Update camera aspect ratio
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
}

// Listen for window resize events
window.addEventListener('resize', handleWindowResize);

const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);
  
    // Rotate the bear model
    //if (bearModel) {
    //  bearModel.rotation.x += 0.005;
    //  bearModel.rotation.y += 0.005;
    //}
    controls.update();
  
    renderer.render(scene, camera);
  }

// Add mouse interaction
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

document.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMouseX;
      const deltaY = event.clientY - previousMouseY;
  
      bearModels.forEach((bearModel) => {
        bearModel.rotation.x += deltaY * 0.01;
        bearModel.rotation.y += deltaX * 0.01;
      });

      //scene.rotateY(1);
  
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    }
  });
  
document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  switch (key) {
    case 's':
      // Move down
      camera.position.y -= moveYSpeed;
      break;
    case 'w':
      // Move up
      camera.position.y += moveYSpeed;
      break;
    case 'a':
      // Move left
      camera.position.x -= moveXSpeed;
      break;
    case 'd':
      // Move right
      camera.position.x += moveXSpeed;
      break;
    case 'q':
      // Zoom in
      camera.position.z -= zoomSpeed;
      break;
    case 'e':
      // Zoom out
      camera.position.z += zoomSpeed;
      break;
  }
});