import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

// Set up scene
const scene = new THREE.Scene();
// Set up camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// Set background color
scene.background = new THREE.Color(0xeeeeee);

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

// Array of bears
const bearModels = [];
// New texture?
//const newTexturePath = "Sky_Blue.png";

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
      bearModels.push(bearModel);
      //scene.add(bearModel);

      bearModel.position.set(x, y, 0); // Set the position of the bear model

      if (index % 8 == 0) {
        y = y - 1.5;
        x = -6;
        //console.log("Bear #" + index + " is going down.");
      }

      //const newTexturePath = 'Sky_Blue.png'; // Path to the new texture image

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
    //console.log("Hello from bear #" + index + ": " + bearData.BearNo);
  }); 
}

function animate() {
    requestAnimationFrame(animate);
  
    // Rotate the bear model
    //if (bearModel) {
    //  bearModel.rotation.x += 0.005;
    //  bearModel.rotation.y += 0.005;
    //}
  
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