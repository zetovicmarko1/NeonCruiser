import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// Textures
const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load('textures/grid.png');
const metalnessTexture = textureLoader.load('textures/metalness.png');
const gui = new GUI()
const canvas = document.querySelector("canvas.webgl");
const loader = new OBJLoader()
const mtlLoader = new MTLLoader()
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const manager = new THREE.LoadingManager()

// manager.onStart = (url, item, total) => {
//     console.log('Started loading: ${url}')
// }

//this is to interact with the spaceship outside of the loader function
var parent = new THREE.Group();
scene.add( parent );

mtlLoader.load('sparrow2.mtl', 
(materials) => {
  materials.preload()
  loader.setMaterials(materials)
  loader.load('sparrow2.obj',
    (object) => {
      scene.add(object);
      object.position.y = -2
      object.position.z = 15
      object.scale.y = 0.5
      object.scale.x = 0.5
      object.scale.z = 0.35
      object.rotation.y = Math.PI
      object.rotation.x = Math.PI/8
      parent.add(object)
    }
  )
}
)
  
// // Fog
const fog = new THREE.Fog("#000000", 0.1, 25);
scene.fog = fog;

// const building = new THREE.CylinderGeometry(5, 5, 50,4,4)
// const building_2 = new THREE.CylinderGeometry(5, 5, 45,4,4)
// const building_3 = new THREE.CylinderGeometry(5, 5, 40,4,4)

const building = new THREE.BoxGeometry(5, 50, 15)
const building_2 = new THREE.BoxGeometry(5, 45, 15)
const building_3 = new THREE.BoxGeometry(5, 40, 15)

// Objects
const torus = new THREE.TorusGeometry(10, 5);
const material = new THREE.MeshStandardMaterial({
    map: gridTexture,
    /**
     * Add a metalnessMap to our material that will tell the renderer
     * where the "rough" parts of our terrains are
     */ 
    metalnessMap: metalnessTexture,
    /**
     * Make the terrain very very metallic so it will reflect the light
     * and not diffuse it: it will stay black
     */ 
    metalness: 0.96,
    /**
     * Make the terrain a bit rough so the rough parts will diffuse the light
     * well
     */ 
    roughness: 0.5,
});

// const helper = new THREE.AxesHelper(300)
// scene.add(helper)

const road = new THREE.Mesh(torus, material);
const road2 = new THREE.Mesh(torus, material);
const road3 = new THREE.Mesh(torus, material);

road.rotation.y = Math.PI * 0.5;
road2.rotation.y = Math.PI * 0.5;
road3.rotation.y = Math.PI * 0.5;

const building1= new THREE.Mesh(building, material)
const building2= new THREE.Mesh(building_2, material)
const building3= new THREE.Mesh(building_2, material)
const building4= new THREE.Mesh(building, material)
const building5= new THREE.Mesh(building_2, material)
const building6= new THREE.Mesh(building_2, material)
const building7= new THREE.Mesh(building, material)
const building8= new THREE.Mesh(building, material)
const building9= new THREE.Mesh(building, material)
const building10= new THREE.Mesh(building_3, material)
const building11= new THREE.Mesh(building_3, material)
const building12= new THREE.Mesh(building_3, material)
const building13= new THREE.Mesh(building_3, material)
const building14= new THREE.Mesh(building_3, material)
const building15= new THREE.Mesh(building_3, material)
const building16= new THREE.Mesh(building_3, material)

building1.rotation.y = Math.PI * 0.5;
building2.rotation.y = Math.PI * 0.5;
building2.rotation.z = 0.3;
building3.rotation.y = Math.PI * 0.5;
building3.rotation.z = Math.PI * 0.5;
building4.rotation.y = Math.PI * 0.5;
building4.rotation.z = (Math.PI * 0.5)+0.3;
building5.rotation.y = Math.PI * 0.5;
building5.rotation.z = Math.PI * 0.25;
building6.rotation.y = Math.PI * 0.5;
building6.rotation.z = (Math.PI * 0.25)+0.3;
building7.rotation.y = Math.PI * 0.5;
building7.rotation.z = Math.PI * 0.75;
building8.rotation.y = Math.PI * 0.5;
building8.rotation.z = (Math.PI * 0.75)+0.3;
building9.rotation.y = Math.PI * 0.5;
building9.rotation.z = Math.PI * 0.625;
building10.rotation.y = Math.PI * 0.5;
building10.rotation.z = (Math.PI * 0.625)+0.3;
building11.rotation.y = Math.PI * 0.5;
building11.rotation.z = Math.PI * 0.875;
building12.rotation.y = Math.PI * 0.5;
building12.rotation.z = (Math.PI * 0.875)+0.3;
building13.rotation.y = Math.PI * 0.5;
building13.rotation.z = Math.PI * 0.375;
building14.rotation.y = Math.PI * 0.5;
building14.rotation.z = (Math.PI * 0.375)+0.3;
building15.rotation.y = Math.PI * 0.5;
building15.rotation.z = Math.PI * 0.125;
building16.rotation.y = Math.PI * 0.5;
building16.rotation.z = (Math.PI * 0.125)+0.3;

road.position.y = -10
road.scale.z  =2
road2.position.y = -10
road3.position.y = -10
road3.position.x = -20
road3.scale.z  =4
road2.position.x = 20
road2.scale.z=4

building1.position.y = -10
building1.position.x = 14
building1.position.z = 0

building2.position.y = -10
building2.position.x = -14
building2.position.z = 0

building3.position.y = -10
building3.position.x = 14
building3.position.z = 0

building4.position.y = -10
building4.position.x = -14
building4.position.z = 0

building5.position.y = -10
building5.position.x = 14
building5.position.z = 0

building6.position.y = -10
building6.position.x = -14
building6.position.z = 0

building7.position.y = -10
building7.position.x = 14
building7.position.z = 0

building8.position.y = -10
building8.position.x = -14
building8.position.z = 0

building9.position.y = -10
building9.position.x = 14
building9.position.z = 0

building10.position.y = -10
building10.position.x = -14
building10.position.z = 0

building11.position.y = -10
building11.position.x = 14
building11.position.z = 0

building12.position.y = -10
building12.position.x = -14
building12.position.z = 0

building13.position.y = -10
building13.position.x = 14
building13.position.z = 0

building14.position.y = -10
building14.position.x = -14
building14.position.z = 0

building15.position.y = -10
building15.position.x = 14
building15.position.z = 0

building16.position.y = -10
building16.position.x = -14
building16.position.z = 0

scene.add(road);
scene.add(road2);
scene.add(road3);
scene.add(building1);
scene.add(building2);
scene.add(building3);
scene.add(building4);
scene.add(building5);
scene.add(building6);
scene.add(building7);
scene.add(building8);
scene.add(building9);
scene.add(building10);
scene.add(building11);
scene.add(building12);
scene.add(building13);
scene.add(building14);
scene.add(building15);
scene.add(building16);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  90,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 21;

const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
const music = new THREE.Audio(listener);

audioLoader.load('song.mp3', function(buffer)
{
  music.setBuffer(buffer);
  music.setLoop(true);
  music.setVolume(0.7);
  music.play();
});



// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Post Processing
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms["amount"].value = 0.001;

effectComposer.addPass(rgbShiftPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

//this function rotates the buildings at the given speed
const speedFunction = (time, multiplier) => {
    road.rotation.z = (Math.PI * time)/multiplier
    road2.rotation.z = (Math.PI * time)/multiplier
    road3.rotation.z = (Math.PI * time)/multiplier
    building1.rotation.x = (Math.PI * time)/multiplier
    building2.rotation.x = (Math.PI * time)/multiplier
    building3.rotation.x = (Math.PI * time)/multiplier
    building4.rotation.x = (Math.PI * time)/multiplier
    building5.rotation.x = (Math.PI * time)/multiplier
    building6.rotation.x = (Math.PI * time)/multiplier
    building7.rotation.x = (Math.PI * time)/multiplier
    building8.rotation.x = (Math.PI * time)/multiplier
    building9.rotation.x = (Math.PI * time)/multiplier
    building10.rotation.x = (Math.PI * time)/multiplier
    building11.rotation.x = (Math.PI * time)/multiplier
    building12.rotation.x = (Math.PI * time)/multiplier
    building13.rotation.x = (Math.PI * time)/multiplier
    building14.rotation.x = (Math.PI * time)/multiplier
    building15.rotation.x = (Math.PI * time)/multiplier
    building16.rotation.x = (Math.PI * time)/multiplier
    parent.position.x = (Math.sin(time*(multiplier-5))/(multiplier))*(0.4/15)*8
    parent.position.y = (Math.cos(time*(multiplier-5))/(multiplier))*(0.4/15)*8
}

//parameters for the gui
var guicontrols = {
    speedMultiplier: 3,
    color: 0x00FFFB,
    view: 21,
    bloomStrength: 3.0,
    bloomThreshold: 0.1,
    bloomRadius: 0.5,
    firstPerson: () => {
      gsap.to(camera.position, {duration: 1, z: 15.5})
      gsap.to(camera.position, {duration: 1, y: 0})

    },
    thirdPerson: () => {
      gsap.to(camera.position, {duration: 1, z: 21})
      gsap.to(camera.position, {duration: 1, y: 1})
    },
    birdsEye: () => {
      gsap.to(camera.position, {duration: 1, z: 25})
      gsap.to(camera.position, {duration: 1, y: 1})
    },
    instructions: () => {
      alert('Use WASD to control the vehicle\nSong: Implant by Makeup and Vanity Set\nBy Matty, Joe, Boya and Marko')
    },
    songOn: false
  };

  var bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.2,
    0.5,
    0.1
  );

effectComposer.addPass(bloomPass);
const ambientLight = new THREE.AmbientLight(0x00FFFB, 100);
scene.add(ambientLight); //this is the main colour, it uses an ambient light for it

//function to change the lighting colour
var changeColor = (val) =>  {
  ambientLight.color.set(guicontrols.color)
} 

//gui controls
const cameraFolder = gui.addFolder('Camera Controls')
const fxFolder = gui.addFolder('Atmosphere and Lighting')
const ctrlFolder = gui.addFolder('Cruise Controls')
const audioFolder = gui.addFolder('Audio Controls')
const vehicleFolder = gui.addFolder('Vehicle Adjustments')


gui.add(guicontrols, 'instructions').name('Click for Instructions')
ctrlFolder.add(guicontrols, 'speedMultiplier').min(0.4).max(15).step(0.1).name('Cruising Speed')
fxFolder.addColor(guicontrols, 'color').onChange(changeColor).name('Neon Colour')
fxFolder.add(fog, 'far').name('Fog Depth').min(10).max(25)
fxFolder.add(guicontrols, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
  bloomPass.threshold = Number(value);
}).name('Neon Threshold').step(0.1);
fxFolder.add(guicontrols, 'bloomStrength', 0.0, 8.0).onChange(function (value) {
  bloomPass.strength = Number(value);
}).name('Neon Strength').step(0.1);
fxFolder.add(guicontrols, 'bloomRadius', 0.0, 1.0).onChange(function (value) {
  bloomPass.radius = Number(value);
}).name('Neon Threshold').step(0.1);
cameraFolder.add(guicontrols, 'firstPerson').name('First Person View')
cameraFolder.add(guicontrols, 'thirdPerson').name('Third Person View')
cameraFolder.add(guicontrols, 'birdsEye').name("Bird's Eye View")
vehicleFolder.add(parent.scale, 'x').min(0.6).max(1.6).name("Width")
vehicleFolder.add(parent.scale, 'y').min(1).max(1.2).name("Length")




// miscFolder.add(guicontrols, 'songOn').onChange(playing).name("Sound On?")


// Event listener to handle screen resize
window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update effect composer
    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animate
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // Update controls
    controls.update();

    speedFunction(elapsedTime, guicontrols.speedMultiplier)

    effectComposer.render();


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
