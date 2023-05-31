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
import nipplejs from 'nipplejs';

// Textures
const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load('textures/grid.png');
const buildingTexture = textureLoader.load('textures/building.png');
const speckleNoise = textureLoader.load('textures/noise.jpg');
const metalnessTexture = textureLoader.load('textures/metalness.png');
const gui = new GUI()
const canvas = document.querySelector("canvas.webgl");
const loader = new OBJLoader()
const mtlLoader = new MTLLoader()
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const webStick = new nipplejs.create({mode: 'dynamic', dataOnly: true, 
zone: document.getElementById('zone_joystick')
})
const joystick = new nipplejs.create({mode: 'static', position: {top:'85%', left: '20%', 
zone: document.getElementById('zone_joystick')
}})

var cameraMode = 'thirdperson'

// This checks if mobile, used for the joystick controller
if (!/Android|iPhone/i.test(navigator.userAgent)) {
  joystick.destroy()
}

if (!/Android|iPhone/i.test(navigator.userAgent)) {
  webStick.destroy()
} 

//this is to interact with the spaceship outside of the loader function
var rocket = new THREE.Group()
var arrow = new THREE.Group()
var tomahawk = new THREE.Group()
var wideGuy = new THREE.Group()

const rocketBox = new THREE.Box3()
const arrowBox = new THREE.Box3()
const tomaBox = new THREE.Box3()
const wideBox = new THREE.Box3()

// // Fog
const fog = new THREE.Fog(0x000000, 0.1, 25);
scene.fog = fog;

var buildingHeightTall = 50
var buildingHeightMed = 45
var buildingHeightShort = 40
var buildingY = Math.PI * 0.25

const cylGeo1 = new THREE.CylinderGeometry(6, 6, buildingHeightTall, 4)
const cylGeo2 = new THREE.CylinderGeometry(6, 6, buildingHeightMed, 4)
const cylGeo3 = new THREE.CylinderGeometry(6, 6, buildingHeightShort, 4)

var uBump = new THREE.Vector2({value:0},0)

// Objects
const torus = new THREE.TorusGeometry(10, 5);
const material = new THREE.MeshStandardMaterial({
    map: gridTexture,
    metalness: 0.96,
    roughness: 0.5
});

const shaderExtend = new THREE.MeshStandardMaterial({
  map: gridTexture,
  metalness: 0.96,
  roughness: 0.5
});

const count = torus.attributes.position.count
const randoms =  new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}

torus.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

shaderExtend.onBeforeCompile = (shader) => {

  shader.uniforms.uBump = uBump.x
  
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
        #include <common>
        attribute float aRandom;
        uniform float uBump;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>
        transformed.x += aRandom * uBump;
    `
  )

}

const buildingMaterial = new THREE.MeshStandardMaterial( {
  map: buildingTexture,
  metalnessMap: metalnessTexture,
  metalness: 0.96,
  roughness: 0.5
});

const burnerAlpha =new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.3,0.3,32,32), new THREE.MeshStandardMaterial({
  color: 'white', 
  alphaMap:speckleNoise,
  transparent: false}));
scene.add(burnerAlpha)
burnerAlpha.scale.x =0.5
burnerAlpha.scale.y =0.5
burnerAlpha.scale.z =0.5
burnerAlpha.rotation.x=Math.PI/2

const road = new THREE.Mesh(torus, shaderExtend);
const roadInverted = new THREE.Mesh(torus, shaderExtend);
const road2 = new THREE.Mesh(torus, material);
const roadInverted2 = new THREE.Mesh(torus, material);
const road3 = new THREE.Mesh(torus, material);
const roadInverted3 = new THREE.Mesh(torus, material);

road.rotation.y = Math.PI * 0.5;
roadInverted.rotation.y = Math.PI * 0.5;
road2.rotation.y = Math.PI * 0.5;
roadInverted2.rotation.y = Math.PI * 0.5;
road3.rotation.y = Math.PI * 0.5;
roadInverted3.rotation.y = Math.PI * 0.5;


const buildingX = 11.5

const cylBuilding1=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding2=new THREE.Mesh(cylGeo2, buildingMaterial)
const cylBuilding3 = new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding4=new THREE.Mesh(cylGeo2, buildingMaterial)
const cylBuilding5=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding6=new THREE.Mesh(cylGeo3, buildingMaterial)
const cylBuilding7=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding8=new THREE.Mesh(cylGeo3, buildingMaterial)
const cylBuilding9=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding10=new THREE.Mesh(cylGeo2, buildingMaterial)
const cylBuilding11=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding12=new THREE.Mesh(cylGeo2, buildingMaterial)
const cylBuilding13=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding14=new THREE.Mesh(cylGeo3, buildingMaterial)
const cylBuilding15=new THREE.Mesh(cylGeo1, buildingMaterial)
const cylBuilding16=new THREE.Mesh(cylGeo3, buildingMaterial)

var buildingsAllCyl = new THREE.Group();
var buildingsInverted = new THREE.Group();


cylBuilding1.rotation.y = buildingY

cylBuilding1.position.y = -10
cylBuilding1.position.x = buildingX
cylBuilding1.position.z = 0

cylBuilding2.rotation.y = buildingY

cylBuilding2.position.y = -10
cylBuilding2.position.x = -buildingX
cylBuilding2.position.z = 0

cylBuilding3.rotation.y = buildingY

cylBuilding3.position.y = -10
cylBuilding3.position.x = -buildingX
cylBuilding3.position.z = 0

cylBuilding4.rotation.y = buildingY

cylBuilding4.position.y = -10
cylBuilding4.position.x = buildingX
cylBuilding4.position.z = 0

cylBuilding5.rotation.y = buildingY

cylBuilding5.position.y = -10
cylBuilding5.position.x = buildingX
cylBuilding5.position.z = 0

cylBuilding6.rotation.y = buildingY

cylBuilding6.position.y = -10
cylBuilding6.position.x = -buildingX
cylBuilding6.position.z = 0

cylBuilding7.rotation.y = buildingY

cylBuilding7.position.y = -10
cylBuilding7.position.x = -buildingX
cylBuilding7.position.z = 0

cylBuilding8.rotation.y = buildingY

cylBuilding8.position.y = -10
cylBuilding8.position.x = buildingX
cylBuilding8.position.z = 0

cylBuilding9.rotation.y = buildingY

cylBuilding9.position.y = -10
cylBuilding9.position.x = buildingX +10
cylBuilding9.position.z = 0

cylBuilding10.rotation.y = buildingY

cylBuilding10.position.y = -10
cylBuilding10.position.x = -(buildingX +10)
cylBuilding10.position.z = 0

cylBuilding11.rotation.y = buildingY

cylBuilding11.position.y = -10
cylBuilding11.position.x = -(buildingX +10)
cylBuilding11.position.z = 0

cylBuilding12.rotation.y = buildingY

cylBuilding12.position.y = -10
cylBuilding12.position.x = buildingX +10
cylBuilding12.position.z = 0

cylBuilding13.rotation.y = buildingY

cylBuilding13.position.y = -10
cylBuilding13.position.x = buildingX +10
cylBuilding13.position.z = 0

cylBuilding14.rotation.y = buildingY

cylBuilding14.position.y = -10
cylBuilding14.position.x = -(buildingX +10)
cylBuilding14.position.z = 0

cylBuilding15.rotation.y = buildingY

cylBuilding15.position.y = -10
cylBuilding15.position.x = -(buildingX +10)
cylBuilding15.position.z = 0

cylBuilding16.rotation.y = buildingY

cylBuilding16.position.y = -10
cylBuilding16.position.x = (buildingX +10)
cylBuilding16.position.z = 0

const buildingInverted1 = cylBuilding1.clone()
const buildingInverted2 = cylBuilding2.clone()
const buildingInverted3 = cylBuilding3.clone()
const buildingInverted4 = cylBuilding4.clone()
const buildingInverted5 = cylBuilding5.clone()
const buildingInverted6 = cylBuilding6.clone()
const buildingInverted7 = cylBuilding7.clone()
const buildingInverted8 = cylBuilding8.clone()
const buildingInverted9 = cylBuilding9.clone()
const buildingInverted10 = cylBuilding10.clone()
const buildingInverted11 = cylBuilding11.clone()
const buildingInverted12 = cylBuilding12.clone()
const buildingInverted13 = cylBuilding13.clone()
const buildingInverted14 = cylBuilding14.clone()
const buildingInverted15 = cylBuilding15.clone()
const buildingInverted16 = cylBuilding16.clone()

buildingsAllCyl.add(cylBuilding1, cylBuilding2, cylBuilding3, cylBuilding4, cylBuilding5, cylBuilding6, cylBuilding7, cylBuilding8, cylBuilding9, cylBuilding10, cylBuilding11, cylBuilding12, cylBuilding13, cylBuilding14, cylBuilding15, cylBuilding16)
buildingsInverted.add(buildingInverted1, buildingInverted2, buildingInverted3, buildingInverted4, buildingInverted5, buildingInverted6, buildingInverted7, buildingInverted8, buildingInverted9, buildingInverted10, buildingInverted11, buildingInverted12, buildingInverted13, buildingInverted14, buildingInverted15, buildingInverted16)

//road code
road.position.y = -10
road.scale.z  =2
roadInverted.scale.z  =4
roadInverted.position.y = 10
roadInverted.position.z = 13
roadInverted.scale.x =3.5
roadInverted.scale.y =3.5

roadInverted2.scale.z  =4
roadInverted2.position.y = 10
roadInverted2.position.z = 13
roadInverted2.position.x = 21
roadInverted2.scale.x =3.5
roadInverted2.scale.y =3.5

roadInverted3.scale.z  =4
roadInverted3.position.y = 10
roadInverted3.position.z = 13
roadInverted3.position.x = -21
roadInverted3.scale.x =3.5
roadInverted3.scale.y =3.5

road2.position.y = -10
road3.position.y = -10
road3.position.x = -20
road3.scale.z  =4

road2.position.x = 20
road2.scale.z=4

scene.add(road);
scene.add(road2);
scene.add(road3);

scene.add(roadInverted);
scene.add(roadInverted2);
scene.add(roadInverted3);

const randomBuildings = new THREE.Group()
const randomBuildingsInverted = new THREE.Group()

var leftBuildingTall = new THREE.Mesh(cylGeo1, buildingMaterial)
var leftBuildingMedium = new THREE.Mesh(cylGeo2, buildingMaterial)
var leftBuildingShort = new THREE.Mesh(cylGeo3, buildingMaterial)
var rightBuildingTall = new THREE.Mesh(cylGeo1, buildingMaterial)
var rightBuildingMedium = new THREE.Mesh(cylGeo2, buildingMaterial)
var rightBuildingShort = new THREE.Mesh(cylGeo3, buildingMaterial)

var leftBuildingTall2 = new THREE.Mesh(cylGeo1, buildingMaterial)
var leftBuildingMedium2 = new THREE.Mesh(cylGeo2, buildingMaterial)
var leftBuildingShort2 = new THREE.Mesh(cylGeo3, buildingMaterial)
var rightBuildingTall2 = new THREE.Mesh(cylGeo1, buildingMaterial)
var rightBuildingMedium2 = new THREE.Mesh(cylGeo2, buildingMaterial)
var rightBuildingShort2 = new THREE.Mesh(cylGeo3, buildingMaterial)

var leftBuildingTall3 = new THREE.Mesh(cylGeo1, buildingMaterial)
var leftBuildingMedium3 = new THREE.Mesh(cylGeo2, buildingMaterial)
var leftBuildingShort3 = new THREE.Mesh(cylGeo3, buildingMaterial)
var rightBuildingTall3 = new THREE.Mesh(cylGeo1, buildingMaterial)
var rightBuildingMedium3 = new THREE.Mesh(cylGeo2, buildingMaterial)
var rightBuildingShort3 = new THREE.Mesh(cylGeo3, buildingMaterial)

var leftBuildingTall4 = new THREE.Mesh(cylGeo1, buildingMaterial)
var leftBuildingMedium4 = new THREE.Mesh(cylGeo2, buildingMaterial)
var leftBuildingShort4 = new THREE.Mesh(cylGeo3, buildingMaterial)
var rightBuildingTall4 = new THREE.Mesh(cylGeo1, buildingMaterial)
var rightBuildingMedium4 = new THREE.Mesh(cylGeo2, buildingMaterial)
var rightBuildingShort4 = new THREE.Mesh(cylGeo3, buildingMaterial)

const leftBuildingTallInverted = leftBuildingTall.clone()
const leftBuildingMediumInverted = leftBuildingMedium.clone()
const leftBuildingShortInverted = leftBuildingShort.clone()
const rightBuildingTallInverted = rightBuildingTall.clone()
const rightBuildingMediumInverted = rightBuildingMedium.clone()
const rightBuildingShortInverted = rightBuildingShort.clone()

const leftBuildingTallInverted2 = leftBuildingTall2.clone()
const leftBuildingMediumInverted2 = leftBuildingMedium2.clone()
const leftBuildingShortInverted2 = leftBuildingShort2.clone()
const rightBuildingTallInverted2 = rightBuildingTall2.clone()
const rightBuildingMediumInverted2 = rightBuildingMedium2.clone()
const rightBuildingShortInverted2 = rightBuildingShort2.clone()

const leftBuildingTallInverted3 = leftBuildingTall3.clone()
const leftBuildingMediumInverted3 = leftBuildingMedium3.clone()
const leftBuildingShortInverted3 = leftBuildingShort3.clone()
const rightBuildingTallInverted3 = rightBuildingTall3.clone()
const rightBuildingMediumInverted3 = rightBuildingMedium3.clone()
const rightBuildingShortInverted3 = rightBuildingShort3.clone()

const leftBuildingTallInverted4 = leftBuildingTall4.clone()
const leftBuildingMediumInverted4 = leftBuildingMedium4.clone()
const leftBuildingShortInverted4 = leftBuildingShort4.clone()
const rightBuildingTallInverted4 = rightBuildingTall4.clone()
const rightBuildingMediumInverted4 = rightBuildingMedium4.clone()
const rightBuildingShortInverted4 = rightBuildingShort4.clone()

randomBuildings.add(leftBuildingShort)
randomBuildings.add(leftBuildingMedium)
randomBuildings.add(leftBuildingTall)

randomBuildingsInverted.add(leftBuildingTallInverted)
randomBuildingsInverted.add(leftBuildingMediumInverted)
randomBuildingsInverted.add(leftBuildingShortInverted)

randomBuildings.add(rightBuildingShort)
randomBuildings.add(rightBuildingMedium)
randomBuildings.add(rightBuildingTall)

randomBuildingsInverted.add(rightBuildingTallInverted)
randomBuildingsInverted.add(rightBuildingMediumInverted)
randomBuildingsInverted.add(rightBuildingShortInverted)

randomBuildings.add(leftBuildingShort2)
randomBuildings.add(leftBuildingMedium2)
randomBuildings.add(leftBuildingTall2)

randomBuildingsInverted.add(leftBuildingTallInverted2)
randomBuildingsInverted.add(leftBuildingMediumInverted2)
randomBuildingsInverted.add(leftBuildingShortInverted2)

randomBuildings.add(rightBuildingShort2)
randomBuildings.add(rightBuildingMedium2)
randomBuildings.add(rightBuildingTall2)

randomBuildingsInverted.add(rightBuildingTallInverted2)
randomBuildingsInverted.add(rightBuildingMediumInverted2)
randomBuildingsInverted.add(rightBuildingShortInverted2)

randomBuildings.add(leftBuildingShort3)
randomBuildings.add(leftBuildingMedium3)
randomBuildings.add(leftBuildingTall3)

randomBuildingsInverted.add(leftBuildingTallInverted3)
randomBuildingsInverted.add(leftBuildingMediumInverted3)
randomBuildingsInverted.add(leftBuildingShortInverted3)

randomBuildings.add(rightBuildingShort3)
randomBuildings.add(rightBuildingMedium3)
randomBuildings.add(rightBuildingTall3)

randomBuildingsInverted.add(rightBuildingTallInverted3)
randomBuildingsInverted.add(rightBuildingMediumInverted3)
randomBuildingsInverted.add(rightBuildingShortInverted3)

randomBuildings.add(leftBuildingShort4)
randomBuildings.add(leftBuildingMedium4)
randomBuildings.add(leftBuildingTall4)

randomBuildingsInverted.add(leftBuildingTallInverted4)
randomBuildingsInverted.add(leftBuildingMediumInverted4)
randomBuildingsInverted.add(leftBuildingShortInverted4)

randomBuildings.add(rightBuildingShort4)
randomBuildings.add(rightBuildingMedium4)
randomBuildings.add(rightBuildingTall4)

randomBuildingsInverted.add(rightBuildingTallInverted4)
randomBuildingsInverted.add(rightBuildingMediumInverted4)
randomBuildingsInverted.add(rightBuildingShortInverted4)

var roads = new THREE.Group();
var roadsInverted = new THREE.Group();

roads.add(road, road2, road3)
roadsInverted.add(roadInverted, roadInverted2, roadInverted3)

scene.add(roads)
scene.add(buildingsAllCyl)

buildingsInverted.position.y = 50

//things that need to be added to invert function

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  90,
  sizes.width / sizes.height,
  0.07,
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

effectComposer.addPass(rgbShiftPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

//this function rotates the buildings at the given speed
const speedFunction = (time, multiplier) => {
    road.rotation.z = (Math.PI * time)/multiplier
    roadInverted.rotation.z = -(Math.PI * time)/multiplier
    road2.rotation.z = (Math.PI * time)/multiplier
    roadInverted2.rotation.z = -(Math.PI * time)/multiplier
    road3.rotation.z = (Math.PI * time)/multiplier
    roadInverted3.rotation.z = -(Math.PI * time)/multiplier
    
    cylBuilding1.rotation.x = ((Math.PI * time)/multiplier) + 0.2
    buildingInverted1.rotation.x = -((Math.PI * time)/multiplier) + 0.2
    cylBuilding2.rotation.x = (Math.PI * time)/multiplier
    buildingInverted2.rotation.x = -(Math.PI * time)/multiplier
    cylBuilding3.rotation.x = ((Math.PI * time)/multiplier) +  (Math.PI * 0.5)
    buildingInverted3.rotation.x = -((Math.PI * time)/multiplier) +  (Math.PI * 0.5)
    cylBuilding4.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)
    buildingInverted4.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)

    cylBuilding5.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)
    buildingInverted5.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)
    cylBuilding6.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75)
    buildingInverted6.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.75)
    cylBuilding7.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25)
    buildingInverted7.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.25)
    cylBuilding8.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)
    buildingInverted8.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)

    cylBuilding9.rotation.x = ((Math.PI * time)/multiplier) + 0.7
    buildingInverted9.rotation.x = -((Math.PI * time)/multiplier) + 0.7
    cylBuilding10.rotation.x = ((Math.PI * time)/multiplier)+ 0.5
    buildingInverted10.rotation.x = -((Math.PI * time)/multiplier)+ 0.5
    cylBuilding11.rotation.x = ((Math.PI * time)/multiplier) +  (Math.PI * 0.5) + 0.5
    buildingInverted11.rotation.x = -((Math.PI * time)/multiplier) +  (Math.PI * 0.5) + 0.5
    cylBuilding12.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)+ 0.7
    buildingInverted12.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)+ 0.7

    cylBuilding13.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)+ 0.7
    buildingInverted13.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)+ 0.7
    cylBuilding14.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75) + 0.5
    buildingInverted14.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.75) + 0.5
    cylBuilding15.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25) + 0.5
    buildingInverted15.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.25) + 0.5
    cylBuilding16.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)+ 0.7
    buildingInverted16.rotation.x = -((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)+ 0.7

    leftBuildingTall.rotation.x = ((Math.PI * time)/multiplier)+ 0.2
    leftBuildingTallInverted.rotation.x = -((Math.PI * time)/multiplier)+ 0.2
    leftBuildingMedium.rotation.x = ((Math.PI * time)/multiplier)+ 0.5
    leftBuildingMediumInverted.rotation.x = -((Math.PI * time)/multiplier)+ 0.5
    leftBuildingShort.rotation.x = ((Math.PI * time)/multiplier) + 0.7
    leftBuildingShortInverted.rotation.x = -((Math.PI * time)/multiplier) + 0.7

    rightBuildingTall.rotation.x = ((Math.PI * time)/multiplier) + 0.9
    rightBuildingTallInverted.rotation.x = -((Math.PI * time)/multiplier) + 0.9
    rightBuildingMedium.rotation.x = ((Math.PI * time)/multiplier) + 0.8
    rightBuildingMediumInverted.rotation.x = -((Math.PI * time)/multiplier) + 0.8
    rightBuildingShort.rotation.x = ((Math.PI * time)/multiplier)+ 0.3
    rightBuildingShortInverted.rotation.x = -((Math.PI * time)/multiplier)+ 0.3

    leftBuildingTall2.rotation.x = ((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.25)
    leftBuildingTallInverted2.rotation.x = -((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.25)
    leftBuildingMedium2.rotation.x = ((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.25)
    leftBuildingMediumInverted2.rotation.x = -((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.25)
    leftBuildingShort2.rotation.x = ((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.25)
    leftBuildingShortInverted2.rotation.x = -((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.25)

    rightBuildingTall2.rotation.x = ((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.25)
    rightBuildingTallInverted2.rotation.x = -((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.25)
    rightBuildingMedium2.rotation.x = ((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.25)
    rightBuildingMediumInverted2.rotation.x = -((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.25)
    rightBuildingShort2.rotation.x = ((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.25)
    rightBuildingShortInverted2.rotation.x = -((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.25)

    leftBuildingTall3.rotation.x = ((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.5)
    leftBuildingTallInverted3.rotation.x = -((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.5)
    leftBuildingMedium3.rotation.x = ((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.5)
    leftBuildingMediumInverted3.rotation.x = -((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.5)
    leftBuildingShort3.rotation.x = ((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.5)
    leftBuildingShortInverted3.rotation.x = -((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.5)

    rightBuildingTall3.rotation.x = ((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.5)
    rightBuildingTallInverted3.rotation.x = -((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.5)
    rightBuildingMedium3.rotation.x = ((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.5)
    rightBuildingMediumInverted3.rotation.x = -((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.5)
    rightBuildingShort3.rotation.x = ((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.5)
    rightBuildingShortInverted3.rotation.x = -((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.5)

    leftBuildingTall4.rotation.x = ((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.75)
    leftBuildingTallInverted4.rotation.x = -((Math.PI * time)/multiplier)+ 0.2 + (Math.PI * 0.75)
    leftBuildingMedium4.rotation.x = ((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.75)
    leftBuildingMediumInverted4.rotation.x = -((Math.PI * time)/multiplier)+ 0.5+ (Math.PI * 0.75)
    leftBuildingShort4.rotation.x = ((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.75)
    leftBuildingShortInverted4.rotation.x = -((Math.PI * time)/multiplier) + 0.7+ (Math.PI * 0.75)

    rightBuildingTall4.rotation.x = ((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.75)
    rightBuildingTallInverted4.rotation.x = -((Math.PI * time)/multiplier) + 0.9+ (Math.PI * 0.75)
    rightBuildingMedium4.rotation.x = ((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.75)
    rightBuildingMediumInverted4.rotation.x = -((Math.PI * time)/multiplier) + 0.8+ (Math.PI * 0.75)
    rightBuildingShort4.rotation.x = ((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.75)
    rightBuildingShortInverted4.rotation.x = -((Math.PI * time)/multiplier)+ 0.3+ (Math.PI * 0.75)
    
    //function for ship wobble effect
    const rotatingFunc = (model) => { 
      model.rotation.z = (Math.cos(time*(multiplier-5))/(multiplier*2))*(0.4/15)*8 
      model.rotation.x = (Math.sin(time*(multiplier-5))/(multiplier*2))*(0.4/15)
    }

    burnerAlpha.scale.y  = Math.abs(Math.sin(time*(multiplier-30)))

    rotatingFunc(rocket)
    rotatingFunc(arrow)
    rotatingFunc(tomahawk)
    rotatingFunc(wideGuy)

    lightParticleGroup.rotation.x = ((Math.PI * time)/multiplier)/2

}

//road parameters
const roadWidth = {
  width: 1
}

var rightBound = (buildingX-5.8)
var leftBound = -(buildingX-5.8)
var upBound = 10
var downBound = -1
var frontBound = -5
var backBound = 1

var inverted = 'false'

//parameters for the gui
var guicontrols = {
    speedMultiplier: 4,
    color: 0x00FFFB,
    view: 21,
    bloomStrength: 3.0,
    bloomThreshold: 0.1,
    bloomRadius: 0.5,
    firstPerson: () => {
      cameraMode = 'firstperson'
    },
    thirdPerson: () => {
      cameraMode = 'thirdperson'
      gsap.to(camera.position, {duration: 1, z: 21})
      gsap.to(camera.position, {duration: 1, y: 1})
      gsap.to(camera.position, {duration: 1, x: 0})

    },
    birdsEye: () => {
      cameraMode = 'birdseye'
      gsap.to(camera.position, {duration: 1, z: 25})
      gsap.to(camera.position, {duration: 1, y: 1})
      gsap.to(camera.position, {duration: 1, x: 0})

    },
    instructions: () => {
      alert('Use WASD to control the vehicle on Web\nUse the joystick on mobile devices\nSong: Implant by Makeup and Vanity Set\nModels: Ebal Studios via Sketchfab\nGrid Texture: Maxime Heckel\nProject By Matty, Joe, Boya and Marko')
    },
    //songOn: false
    playMusic:() =>{
      gsap.to(music.play())
    },
    stopMusic:() =>{
      gsap.to(music.stop())
    },
    arrowShip:() => {
      // currModel = 'arrow'
      scene.remove(rocket)
      scene.remove(tomahawk)
      scene.remove(wideGuy)
      scene.add(arrow)
      rocket.visible = false
      arrow.visible = true
      tomahawk.visible = false
      wideGuy.visible = false

      mtlLoader.load('models/arrow.mtl', 
      (materials) => {
        materials.preload()
        loader.setMaterials(materials)
        loader.load('models/arrow.obj',
          (object) => {
            object.position.y = -2
            object.position.z = 15
            object.scale.y = 0.5
            object.scale.x = 0.5
            object.scale.z = 0.35
            object.rotation.y = Math.PI
            object.rotation.x = Math.PI/8
            arrow.add(object)
            rightBound = (buildingX-8)*roadWidth.width
            leftBound = -(buildingX-8)*roadWidth.width
            arrowBox.setFromObject(arrow)
            }
          )
        }
      )   
    }, 
    rocketShip:() => {
      // currModel = 'rocket'
      scene.remove(arrow)
      scene.remove(tomahawk)
      scene.remove(wideGuy)
      scene.add(rocket)
      rocket.visible = true
      arrow.visible = false
      tomahawk.visible = false
      wideGuy.visible = false
      mtlLoader.load('models/rocket.mtl', 
      (materials) => {
        materials.preload()
        loader.setMaterials(materials)
        loader.load('models/rocket.obj',
          (object) => {
            object.position.y = -2
            object.position.z = 15
            object.scale.y = 0.5
            object.scale.x = 0.5
            object.scale.z = 0.35
            object.rotation.y = Math.PI
            object.rotation.x = Math.PI/8
            rocket.add(object)
            rightBound = (buildingX-5.8)*roadWidth.width
            leftBound = -(buildingX-5.8)*roadWidth.width
            rocketBox.setFromObject(rocket)

            }
          )
        }
      )   
    },
    tomaShip:() => {
      // currModel = 'tomahawk'
      scene.remove(arrow)
      scene.remove(rocket)
      scene.remove(wideGuy)
      scene.add(tomahawk)
      rocket.visible = false
      arrow.visible = false
      tomahawk.visible = true
      wideGuy.visible = false

      mtlLoader.load('models/tomahawk.mtl', 
      (materials) => {
        materials.preload()
        loader.setMaterials(materials)
        loader.load('models/tomahawk.obj',
          (object) => {
            object.position.y = -2
            object.position.z = 15
            object.scale.y = 0.5
            object.scale.x = 0.5
            object.scale.z = 0.35
            object.rotation.y = Math.PI
            object.rotation.x = Math.PI/8
            tomahawk.add(object)
            rightBound = (buildingX-8)*roadWidth.width
            leftBound = -(buildingX-8)*roadWidth.width
            tomaBox.setFromObject(tomahawk)
            
            }
          )
        }
      )   
    },
    wideShip:() => {
      // currModel = 'wideGuy'
      scene.remove(arrow)
      scene.remove(rocket)
      scene.remove(tomahawk)
      scene.add(wideGuy)
      rocket.visible = false
      arrow.visible = false
      tomahawk.visible = false
      wideGuy.visible = true
      mtlLoader.load('models/wide.mtl', 
      (materials) => {
        materials.preload()
        loader.setMaterials(materials)
        loader.load('models/wide.obj',
          (object) => {
            object.position.y = -2
            object.position.z = 15
            object.scale.y = 0.5
            object.scale.x = 0.5
            object.scale.z = 0.35
            object.rotation.y = Math.PI
            object.rotation.x = Math.PI/8
            wideGuy.add(object)
            rightBound = (buildingX-8)*roadWidth.width
            leftBound = -(buildingX-8)*roadWidth.width
            wideBox.setFromObject(wideGuy)
            }
          )
        }
      )   
    },
    rainbowSpeed: 5,
    rainbowMode: () => {
      scene.remove(ambientLight)
      scene.add(ambientLightRed)
      scene.add(ambientLightYel)
      scene.add(ambientLightGrn)
      scene.add(ambientLightBlu)
      scene.add(ambientLightPrp)
    },
    normalMode: () => {
      scene.remove(ambientLightRed)
      scene.remove(ambientLightYel)
      scene.remove(ambientLightGrn)
      scene.remove(ambientLightBlu)
      scene.remove(ambientLightPrp)
      scene.add(ambientLight)
    },
    setBuildings: () => {
      scene.remove(randomBuildings)
      scene.remove(randomBuildingsInverted)
      if (inverted == 'true') {
        scene.add(buildingsAllCyl)
        scene.add(buildingsInverted)
      } else if (inverted == 'false') {
        scene.add(buildingsAllCyl)
      }
    },
    setRandomBuildings: () => {
      scene.remove(buildingsAllCyl)
      scene.remove(buildingsInverted)

      // will randomly generate buildings
    
      leftBuildingTall.rotation.y = buildingY
      leftBuildingMedium.rotation.y = buildingY
      leftBuildingShort.rotation.y = buildingY

      leftBuildingTallInverted.rotation.y = buildingY
      leftBuildingMediumInverted.rotation.y = buildingY
      leftBuildingShortInverted.rotation.y = buildingY
    
      rightBuildingTall.rotation.y = buildingY
      rightBuildingMedium.rotation.y = buildingY
      rightBuildingShort.rotation.y = buildingY

      rightBuildingTallInverted.rotation.y = buildingY
      rightBuildingMediumInverted.rotation.y = buildingY
      rightBuildingShortInverted.rotation.y = buildingY
    
      leftBuildingTall.position.y = -10
      leftBuildingMedium.position.y = -10
      leftBuildingShort.position.y = -10

      leftBuildingTallInverted.position.y = 40
      leftBuildingMediumInverted.position.y = 40
      leftBuildingShortInverted.position.y = 40
    
      rightBuildingTall.position.y = -10
      rightBuildingMedium.position.y = -10
      rightBuildingShort.position.y = -10

      rightBuildingTallInverted.position.y = 40
      rightBuildingMediumInverted.position.y = 40
      rightBuildingShortInverted.position.y = 40
    
      leftBuildingTall.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMedium.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShort.position.x = -buildingX - Math.random()*buildingX

      leftBuildingTallInverted.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMediumInverted.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShortInverted.position.x = -buildingX - Math.random()*buildingX
    
      rightBuildingTall.position.x = buildingX + Math.random()*buildingX
      rightBuildingMedium.position.x = buildingX + Math.random()*buildingX
      rightBuildingShort.position.x = buildingX + Math.random()*buildingX

      rightBuildingTallInverted.position.x = buildingX + Math.random()*buildingX
      rightBuildingMediumInverted.position.x = buildingX + Math.random()*buildingX
      rightBuildingShortInverted.position.x = buildingX + Math.random()*buildingX
    
      leftBuildingTall.rotation.x = Math.PI*Math.random()
      leftBuildingMedium.rotation.x = Math.PI*Math.random()
      leftBuildingShort.rotation.x = Math.PI*Math.random()

      leftBuildingTallInverted.rotation.x = Math.PI*Math.random()
      leftBuildingMediumInverted.rotation.x = Math.PI*Math.random()
      leftBuildingShortInverted.rotation.x = Math.PI*Math.random()
    
      rightBuildingTall.rotation.x = Math.PI*Math.random()
      rightBuildingMedium.rotation.x = Math.PI*Math.random()
      rightBuildingShort.rotation.x = Math.PI*Math.random()

      rightBuildingTallInverted.rotation.x = Math.PI*Math.random()
      rightBuildingMediumInverted.rotation.x = Math.PI*Math.random()
      rightBuildingShortInverted.rotation.x = Math.PI*Math.random()
    
      leftBuildingTall2.rotation.y = buildingY
      leftBuildingMedium2.rotation.y = buildingY
      leftBuildingShort2.rotation.y = buildingY

      leftBuildingTallInverted2.rotation.y = buildingY
      leftBuildingMediumInverted2.rotation.y = buildingY
      leftBuildingShortInverted2.rotation.y = buildingY
    
      rightBuildingTall2.rotation.y = buildingY
      rightBuildingMedium2.rotation.y = buildingY
      rightBuildingShort2.rotation.y = buildingY

      rightBuildingTallInverted2.rotation.y = buildingY
      rightBuildingMediumInverted2.rotation.y = buildingY
      rightBuildingShortInverted2.rotation.y = buildingY
    
      leftBuildingTall2.position.y = -10
      leftBuildingMedium2.position.y = -10
      leftBuildingShort2.position.y = -10

      leftBuildingTallInverted2.position.y = 40
      leftBuildingMediumInverted2.position.y = 40
      leftBuildingShortInverted2.position.y = 40
    
      rightBuildingTall2.position.y = -10
      rightBuildingMedium2.position.y = -10
      rightBuildingShort2.position.y = -10

      rightBuildingTallInverted2.position.y = 40
      rightBuildingMediumInverted2.position.y = 40
      rightBuildingShortInverted2.position.y = 40
    
      leftBuildingTall2.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMedium2.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShort2.position.x = -buildingX - Math.random()*buildingX

      leftBuildingTallInverted2.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMediumInverted2.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShortInverted2.position.x = -buildingX - Math.random()*buildingX
    
      rightBuildingTall2.position.x = buildingX + Math.random()*buildingX
      rightBuildingMedium2.position.x = buildingX + Math.random()*buildingX
      rightBuildingShort2.position.x = buildingX + Math.random()*buildingX

      rightBuildingTallInverted2.position.x = buildingX + Math.random()*buildingX
      rightBuildingMediumInverted2.position.x = buildingX + Math.random()*buildingX
      rightBuildingShortInverted2.position.x = buildingX + Math.random()*buildingX
    
      leftBuildingTall2.rotation.x = Math.PI*Math.random()
      leftBuildingMedium2.rotation.x = Math.PI*Math.random()
      leftBuildingShort2.rotation.x = Math.PI*Math.random()

      leftBuildingTallInverted2.rotation.x = Math.PI*Math.random()
      leftBuildingMediumInverted2.rotation.x = Math.PI*Math.random()
      leftBuildingShortInverted2.rotation.x = Math.PI*Math.random()
    
      rightBuildingTall2.rotation.x = Math.PI*Math.random()
      rightBuildingMedium2.rotation.x = Math.PI*Math.random()
      rightBuildingShort2.rotation.x = Math.PI*Math.random()

      rightBuildingTallInverted2.rotation.x = Math.PI*Math.random()
      rightBuildingMediumInverted2.rotation.x = Math.PI*Math.random()
      rightBuildingShortInverted2.rotation.x = Math.PI*Math.random()
    
      leftBuildingTall3.rotation.y = buildingY
      leftBuildingMedium3.rotation.y = buildingY
      leftBuildingShort3.rotation.y = buildingY

      leftBuildingTallInverted3.rotation.y = buildingY
      leftBuildingMediumInverted3.rotation.y = buildingY
      leftBuildingShortInverted3.rotation.y = buildingY
    
      rightBuildingTall3.rotation.y = buildingY
      rightBuildingMedium3.rotation.y = buildingY
      rightBuildingShort3.rotation.y = buildingY

      rightBuildingTallInverted3.rotation.y = buildingY
      rightBuildingMediumInverted3.rotation.y = buildingY
      rightBuildingShortInverted3.rotation.y = buildingY
    
      leftBuildingTall3.position.y = -10
      leftBuildingMedium3.position.y = -10
      leftBuildingShort3.position.y = -10

      leftBuildingTallInverted3.position.y = 40
      leftBuildingMediumInverted3.position.y = 40
      leftBuildingShortInverted3.position.y = 40
    
      rightBuildingTall3.position.y = -10
      rightBuildingMedium3.position.y = -10
      rightBuildingShort3.position.y = -10

      rightBuildingTallInverted3.position.y = 40
      rightBuildingMediumInverted3.position.y = 40
      rightBuildingShortInverted3.position.y = 40
    
      leftBuildingTall3.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMedium3.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShort3.position.x = -buildingX - Math.random()*buildingX

      leftBuildingTallInverted3.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMediumInverted3.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShortInverted3.position.x = -buildingX - Math.random()*buildingX
    
      rightBuildingTall3.position.x = buildingX + Math.random()*buildingX
      rightBuildingMedium3.position.x = buildingX + Math.random()*buildingX
      rightBuildingShort3.position.x = buildingX + Math.random()*buildingX

      rightBuildingTallInverted3.position.x = buildingX + Math.random()*buildingX
      rightBuildingMediumInverted3.position.x = buildingX + Math.random()*buildingX
      rightBuildingShortInverted3.position.x = buildingX + Math.random()*buildingX
    
      leftBuildingTall3.rotation.x = Math.PI*Math.random()
      leftBuildingMedium3.rotation.x = Math.PI*Math.random()
      leftBuildingShort3.rotation.x = Math.PI*Math.random()

      leftBuildingTallInverted3.rotation.x = Math.PI*Math.random()
      leftBuildingMediumInverted3.rotation.x = Math.PI*Math.random()
      leftBuildingShortInverted3.rotation.x = Math.PI*Math.random()
    
      rightBuildingTall3.rotation.x = Math.PI*Math.random()
      rightBuildingMedium3.rotation.x = Math.PI*Math.random()
      rightBuildingShort3.rotation.x = Math.PI*Math.random()

      rightBuildingTallInverted3.rotation.x = Math.PI*Math.random()
      rightBuildingMediumInverted3.rotation.x = Math.PI*Math.random()
      rightBuildingShortInverted3.rotation.x = Math.PI*Math.random()
    
      leftBuildingTall4.rotation.y = buildingY
      leftBuildingMedium4.rotation.y = buildingY
      leftBuildingShort4.rotation.y = buildingY

      leftBuildingTallInverted4.rotation.y = buildingY
      leftBuildingMediumInverted4.rotation.y = buildingY
      leftBuildingShortInverted4.rotation.y = buildingY
    
      rightBuildingTall4.rotation.y = buildingY
      rightBuildingMedium4.rotation.y = buildingY
      rightBuildingShort4.rotation.y = buildingY

      rightBuildingTallInverted4.rotation.y = buildingY
      rightBuildingMediumInverted4.rotation.y = buildingY
      rightBuildingShortInverted4.rotation.y = buildingY
    
      leftBuildingTall4.position.y = -10
      leftBuildingMedium4.position.y = -10
      leftBuildingShort4.position.y = -10

      leftBuildingTallInverted4.position.y = 40
      leftBuildingMediumInverted4.position.y = 40
      leftBuildingShortInverted4.position.y = 40
    
      rightBuildingTall4.position.y = -10
      rightBuildingMedium4.position.y = -10
      rightBuildingShort4.position.y = -10

      rightBuildingTallInverted4.position.y = 40
      rightBuildingMediumInverted4.position.y = 40
      rightBuildingShortInverted4.position.y = 40
    
      leftBuildingTall4.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMedium4.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShort4.position.x = -buildingX - Math.random()*buildingX

      leftBuildingTallInverted4.position.x = -buildingX - Math.random()*buildingX
      leftBuildingMediumInverted4.position.x = -buildingX - Math.random()*buildingX
      leftBuildingShortInverted4.position.x = -buildingX - Math.random()*buildingX
    
      rightBuildingTall4.position.x = buildingX + Math.random()*buildingX
      rightBuildingMedium4.position.x = buildingX + Math.random()*buildingX
      rightBuildingShort4.position.x = buildingX + Math.random()*buildingX

      rightBuildingTallInverted4.position.x = buildingX + Math.random()*buildingX
      rightBuildingMediumInverted4.position.x = buildingX + Math.random()*buildingX
      rightBuildingShortInverted4.position.x = buildingX + Math.random()*buildingX
    
      leftBuildingTall4.rotation.x = Math.PI*Math.random()
      leftBuildingMedium4.rotation.x = Math.PI*Math.random()
      leftBuildingShort4.rotation.x = Math.PI*Math.random()

      leftBuildingTallInverted4.rotation.x = Math.PI*Math.random()
      leftBuildingMediumInverted4.rotation.x = Math.PI*Math.random()
      leftBuildingShortInverted4.rotation.x = Math.PI*Math.random()
    
      rightBuildingTall4.rotation.x = Math.PI*Math.random()
      rightBuildingMedium4.rotation.x = Math.PI*Math.random()
      rightBuildingShort4.rotation.x = Math.PI*Math.random()

      rightBuildingTallInverted4.rotation.x = Math.PI*Math.random()
      rightBuildingMediumInverted4.rotation.x = Math.PI*Math.random()
      rightBuildingShortInverted4.rotation.x = Math.PI*Math.random()
      
      if (inverted == 'true') {
        scene.add(randomBuildings)
        scene.add(randomBuildingsInverted)
      } else if (inverted == 'false') {
        scene.add(randomBuildings)
      }
    }, 
    rainOn: () => {
      scene.add(rain)
    },
    rainOff: () => {
      scene.remove(rain)
    },
    LightParticleOn: () => {
      lightParticleSettings.check = 0;
      if (lightParticleSettings.count == 0){
        lightParticleSettings.count = 500
      }
      else{
        lightParticleSettings.count = lightParticleSettings.count
      }
      updateLightParticleCount()
    },
    LightParticleOff: () => {
      lightParticleSettings.count = 0
      lightParticleSettings.check = 1
      updateLightParticleCount()
    },
    invertScene: () => {
      inverted = 'true'
      buildingsAllCyl.position.y = -6
      scene.add(roadsInverted)
      scene.remove(roads)
      scene.add(buildingsInverted)
      randomBuildings.position.y = -6
    },
    revertScene: () => {
      inverted = 'false'
      buildingsAllCyl.position.y = 0
      scene.remove(roadsInverted)
      scene.add(roads)
      scene.remove(buildingsInverted)
      scene.remove(randomBuildingsInverted)
      randomBuildings.position.y = 0
    }
  };

  var bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.2,
    0.5,
    0.1
  );

effectComposer.addPass(bloomPass);


const ambientLight = new THREE.AmbientLight(0x00FFFB, 100);
//this is the main colour, it uses an ambient light for it
//function to change the lighting colour

scene.add(ambientLight)

var intensityRed = 100
// var intensityOrng = 0
var intensityYel = 0
var intensityGrn = 0
var intensityBlu = 0
var intensityPrp = 0

var currColor = 'red'

const ambientLightRed = new THREE.AmbientLight(0xff0000, intensityRed);
// const ambientLightOrng = new THREE.AmbientLight(0xff8c00, intensityOrng);
const ambientLightYel = new THREE.AmbientLight(0xffff00, intensityYel);
const ambientLightGrn = new THREE.AmbientLight(0x00ff00, intensityGrn);
const ambientLightBlu = new THREE.AmbientLight(0x0000ff, intensityBlu);
const ambientLightPrp = new THREE.AmbientLight(0xff00ff, intensityPrp);

var changeColor = (val) =>  {
  ambientLight.color.set(guicontrols.color)
} 

//rainbow mode functions


const dimmerRed= () => {
  currColor='red'
  if (intensityPrp <= 0 && intensityRed >0 && intensityYel <= 100 && currColor=='red') {
    intensityRed-=guicontrols.rainbowSpeed
    intensityYel+=guicontrols.rainbowSpeed
    ambientLightRed.intensity = intensityRed
    ambientLightYel.intensity = intensityYel
  }

}

const dimmerYel= () => { 
  currColor='yellow'
  if (intensityRed <= 0 && intensityYel>0  && intensityGrn <= 100 && currColor == 'yellow') {
    intensityYel-=guicontrols.rainbowSpeed
    intensityGrn+=guicontrols.rainbowSpeed
    ambientLightGrn.intensity = intensityGrn
    ambientLightYel.intensity = intensityYel
  } 
}

const dimmerGrn= () => { 
  currColor='green'
  if (intensityYel <= 0 && intensityGrn>0  && intensityBlu <= 100 && currColor=='green') {
    intensityGrn-=guicontrols.rainbowSpeed
    intensityBlu+=guicontrols.rainbowSpeed
    ambientLightBlu.intensity = intensityBlu
    ambientLightGrn.intensity = intensityGrn

  } 
}

const dimmerBlu= () => { 
  currColor='blue'
  if (intensityGrn <= 0 && intensityBlu>0 && intensityPrp <= 100 && currColor=='blue') {
    intensityBlu-=guicontrols.rainbowSpeed
    intensityPrp+=guicontrols.rainbowSpeed
    ambientLightBlu.intensity = intensityBlu
    ambientLightPrp.intensity = intensityPrp
  }
} 

const dimmerPrp= () => { 
  currColor='purple'
  if (intensityBlu <= 0 && intensityPrp>0 && intensityRed <= 100 && currColor=='purple') {
    intensityPrp-=guicontrols.rainbowSpeed
    intensityRed+=guicontrols.rainbowSpeed
    ambientLightRed.intensity = intensityRed
    ambientLightPrp.intensity = intensityPrp
  } 
}

//gui controls
const cameraFolder = gui.addFolder('Camera Controls')
const roadFolder = gui.addFolder('Road Controls')
const brandomFolder = gui.addFolder('Building Mode')
const buildinghFolder = gui.addFolder('Building Height Controls')
const buildingsFolder = gui.addFolder('Building Shape Controls')
const tradiusFolder = gui.addFolder('Building Top Radius Controls')
const bradiusFolder = gui.addFolder('Building Bottom Radius Controls')
const fxFolder = gui.addFolder('Atmosphere and Lighting')
const ctrlFolder = gui.addFolder('Cruise Controls')
const audioFolder = gui.addFolder('Audio Controls')
const vehicleFolder = gui.addFolder('Change Vehicle')

const updateMusicVolume = () =>{
  music.setVolume(controls.musicVolume);
};

const stopMusic = () =>{
  if(music.isPlaying && controls.musicStop == false ){
    music.stop();
  }
  if(music.isPlaying == false && controls.musicStop == true && controls.musicPause == false){
    music.play();
  }
};

const pauseMusic = () => {
  if(music.isPlaying == false && controls.musicPause == false && controls.musicStop == true){
    music.play();
  }
  if(music.isPlaying == true && controls.musicPause == true && controls.musicStop == true){
    music.pause();
  }
}

const updateMusicSpeed = (multiplier) => { 
  multiplier = 30 - multiplier 
  music.setPlaybackRate(multiplier / 26);
}

const analyser = new THREE.AudioAnalyser(music, 64);
const musicVisualiser = () => {
  if(controls.musicVisualiserToggle == true){
    const dataArray = new Uint8Array(analyser.getFrequencyData());
    rgbShiftPass.uniforms["amount"].value = dataArray[15] / (1500 * (11 - controls.musicVisualiserSlider));
  }
  else{
    rgbShiftPass.uniforms["amount"].value = 0.001;
  }
}

var detuneUpdated = true;
var detune = 0;
var previousDetune = 0;

const musicDetune = () => {
  detune = (-200 * (roadWidth.width - 1)) + (controls.musicDetune * -100)
  if(detune != previousDetune){
    detuneUpdated = false
  }

  if(!detuneUpdated)
  {
    music.setDetune(detune) 
    detuneUpdated = true;
  }
}

// function for "disposing" of a geometry
const updateGroupGeometry = (mesh, geometry) => {
  mesh.geometry.dispose()
  mesh.geometry = geometry;
}

//building parameters
const tallBuildingData = {
  radiusTop: 6,
  radiusBottom: 6,
  height: buildingHeightTall,
  radialSegments: 4
}

const medBuildingData = {
  radiusTop: 6,
  radiusBottom: 6,
  height: buildingHeightMed,
  radialSegments: 4
}

const shortBuildingData = {
  radiusTop: 6,
  radiusBottom: 6,
  height: buildingHeightShort,
  radialSegments: 4
}

var scaleRoad = (val) =>  {
  buildingsAllCyl.scale.x = roadWidth.width
  buildingsInverted.scale.x = roadWidth.width
  randomBuildings.scale.x = roadWidth.width
  roads.scale.x = roadWidth.width
  roadsInverted.scale.x = roadWidth.width
  rightBound = (buildingX-5.8) * roadWidth.width
  leftBound = -(buildingX-5.8) * roadWidth.width

} 

//building generators
const genNewTall = () => {
  updateGroupGeometry(cylBuilding1, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted1, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding5, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted5, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding7, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted7, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding9, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted9, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding11, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted11, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding13, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted13, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding15, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted15, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))


  updateGroupGeometry(leftBuildingTall, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTall, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTall2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTall2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTall3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTall3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTall4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTall4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))

  updateGroupGeometry(leftBuildingTallInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTallInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTallInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTallInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTallInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTallInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingTallInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingTallInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  //1,3,5,7,9,11,13,15
}

const genNewShort = () => {
  updateGroupGeometry(cylBuilding6, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted6, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding8, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted8, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding14, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted14, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding16, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted16, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))

  updateGroupGeometry(leftBuildingShort, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShortInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShort, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShortInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShort2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShortInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShort2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShortInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShort3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShortInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShort3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShortInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShort4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingShortInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShort4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingShortInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
    //6,8,14,16
}

const genNewMed= () => {
  updateGroupGeometry(cylBuilding2, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted2, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding4, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted4, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding10, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted10, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding12, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(buildingInverted12, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))

  updateGroupGeometry(leftBuildingMedium, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMediumInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMedium, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMediumInverted, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMedium2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMediumInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMedium2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMediumInverted2, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMedium3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMediumInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMedium3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMediumInverted3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMedium4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(leftBuildingMediumInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMedium4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(rightBuildingMediumInverted4, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
    //2,4,10,12
}

//default vehicle
scene.add(rocket)
rocket.visible = true
arrow.visible = false
tomahawk.visible = false
wideGuy.visible = false

mtlLoader.load('models/rocket.mtl', 
(materials) => {
  materials.preload()
  loader.setMaterials(materials)
  loader.load('models/rocket.obj',
    (object) => {
      object.position.y = -2
      object.position.z = 15
      object.scale.y = 0.5
      object.scale.x = 0.5
      object.scale.z = 0.35
      object.rotation.y = Math.PI
      object.rotation.x = Math.PI/8
      rocket.add(object)
      rocketBox.setFromObject(rocket)
    }
  )
}
)

gui.add(guicontrols, 'instructions').name('Instructions')
ctrlFolder.add(guicontrols, 'speedMultiplier').min(2).max(6).step(0.1).name('Cruising Speed')
fxFolder.addColor(guicontrols, 'color').onChange(changeColor).name('Neon Colour')
fxFolder.add(guicontrols, 'rainbowMode').name('Rainbow Mode')
fxFolder.add(guicontrols, 'normalMode').name('Normal Mode')

fxFolder.add(fog, 'far').name('Fog Depth').min(10).max(25)
fxFolder.add(guicontrols, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
  bloomPass.threshold = Number(value);
}).name('Neon Threshold').step(0.01);
fxFolder.add(guicontrols, 'bloomStrength', 0.0, 8.0).onChange(function (value) {
  bloomPass.strength = Number(value);
}).name('Neon Strength').step(0.01);
fxFolder.add(guicontrols, 'bloomRadius', 0.0, 1.0).onChange(function (value) {
  bloomPass.radius = Number(value);
}).name('Neon Radius').step(0.01);
cameraFolder.add(guicontrols, 'firstPerson').name('First Person View')
cameraFolder.add(guicontrols, 'thirdPerson').name('Third Person View')
cameraFolder.add(guicontrols, 'birdsEye').name("Bird's Eye View")

vehicleFolder.add(guicontrols,'rocketShip').name('Rocket')
vehicleFolder.add(guicontrols,'tomaShip').name('Tomahawk')
vehicleFolder.add(guicontrols,'wideShip').name('Wide Guy')

roadFolder.add(roadWidth, 'width').min(1).max(2).step(0.0001).onChange(scaleRoad).name("Road Width")
roadFolder.add(uBump.x, 'value').name("Road Bumps").min(0).max(1.2).step(0.1).name("Bumps")

brandomFolder.add(guicontrols, 'setBuildings').name("Uniform Buildings")
brandomFolder.add(guicontrols, 'setRandomBuildings').name("Randomise Buildings")
brandomFolder.add(guicontrols, 'invertScene').name("Invert Scene")
brandomFolder.add(guicontrols, 'revertScene').name("Revert Scene")
buildingsFolder.add(tallBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewTall).name("Tall Building Segments")
buildingsFolder.add(medBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewMed).name("Medium Building Segments")
buildingsFolder.add(shortBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewShort).name("Short Building Segments")
buildinghFolder.add(tallBuildingData, 'height').min(45).max(55).step(0.01).onChange(genNewTall).name("Tall Building Height")
buildinghFolder.add(medBuildingData, 'height').min(40).max(50).step(0.01).onChange(genNewMed).name("Medium Building Height")
buildinghFolder.add(shortBuildingData, 'height').min(35).max(45).step(0.01).onChange(genNewShort).name("Short Building Height")
tradiusFolder.add(tallBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewTall).name("Tall Building Top Radius")
tradiusFolder.add(medBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewMed).name("Medium Building Top Radius")
tradiusFolder.add(shortBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewShort).name("Short Building Top Radius")
bradiusFolder.add(tallBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewTall).name("Tall Building Bottom Radius")
bradiusFolder.add(medBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewMed).name("Medium Building Bottom Radius")
bradiusFolder.add(shortBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewShort).name("Short Building Bottom Radius")

const rainControls = {
  speed:5,
  intensity: 0.5,
  size: 0.1
};
const lightParticleSettings = {
  speed:0.05,
  count:200,
  check:0
}

controls.musicVolume = 1;
audioFolder.add(controls, 'musicVolume').min(0).max(2).step(0.1).onChange(updateMusicVolume).name("Music Volume")
controls.musicStop = true;
controls.musicPause = false;
audioFolder.add(controls, 'musicStop').onChange(stopMusic).name("Play Music")
audioFolder.add(controls, 'musicPause').onChange(pauseMusic).name("Pause Music")
controls.musicVisualiserToggle = false;
controls.musicVisualiserSlider = 5;
audioFolder.add(controls, 'musicVisualiserToggle').name('Music Visualiser')
audioFolder.add(controls, 'musicVisualiserSlider').min(1).max(10).step(0.1).name('Music Visualiser Strength')
controls.musicDetune = 0;
audioFolder.add(controls, 'musicDetune').min(0).max(5).step(0.1).name('Music Detune')

fxFolder.add(guicontrols, 'rainOn').name('Rain On');
fxFolder.add(guicontrols, 'rainOff').name('Rain Off');
fxFolder.add(rainControls, 'speed').min(2).max(5).step(0.1).name('Rain Speed');
fxFolder.add(rainControls, 'size').min(0.1).max(0.5).step(0.1).name('Rain Size');

gui.close() //this will close the gui on launch (good for mobiles)s

//debug
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;

//moving
var isFor = false
var isBack = false
var isLeft = false
var isRight = false
var isUp = false
var isDown = false

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

var high = 'false'
//console.log(high)
// wasd movement switch cases
var onKeyDown = (e) => {
  switch (e.keyCode) {
    case 87:
      isFor = true;
      break;
    case 83:
      isBack = true;
      break;
    case 65:
      isLeft = true;
      break;
    case 68:
      isRight = true;
      break;
    case 38:
      isUp = true;
      break;
    case 40:
      isDown = true;
      break;
  }
}

var onKeyUp = (e) => {
  switch (e.keyCode) {
    case 87:
      isFor = false;
      break;
    case 83:
      isBack = false;
      break;
    case 65:
      isLeft = false;
      break;
    case 68:
      isRight = false;
      break;
    case 38:
      isUp = false;
      break;
    case 40:
      isDown = false;
      break;
    case 38:
        isUp = false;
        break;
    case 40:
        isDown = false;
        break;
  }
  
}

const dropsGeometry = new THREE.BufferGeometry();
const dropsMaterial = new THREE.PointsMaterial({ color: 0xffffff});

let dropCount = 5000;
const dropPositions = new Float32Array(dropCount * 3);

for (let i = 0; i < dropCount; i++) {
  dropPositions[i * 3 + 0] = Math.random() * 200 - 100;
  dropPositions[i * 3 + 1] = Math.random() * 200 - 100;
  dropPositions[i * 3 + 2] = Math.random() * 200 - 100;
}

dropsGeometry.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));

const rain = new THREE.Points(dropsGeometry, dropsMaterial);
const dropCountController = fxFolder.add({ dropCount: dropCount }, 'dropCount').min(2000).max(5000).step(100).name('Rain DropCount');
dropCountController.onChange(updateDropCount);

function updateDropCount() {
  dropCount =  dropCountController.getValue();
  const newDropPositions = new Float32Array(dropCount * 3);

  for (let i = 0; i < dropCount; i++) {
    newDropPositions[i * 3 + 0] = Math.random() * 200 - 100;
    newDropPositions[i * 3 + 1] = Math.random() * 200 - 100;
    newDropPositions[i * 3 + 2] = Math.random() * 200 - 100;
  }

  dropsGeometry.setAttribute('position', new THREE.BufferAttribute(newDropPositions, 3));
  dropsGeometry.computeBoundingSphere();
}

//Light particle
const lightParticlesArray = [];
const lightParticleGroup = new THREE.Group()

function createLightParticles() {
  const lightParticleGeometry = new THREE.SphereGeometry(0.15);
  const lightParticleMaterial = new THREE.MeshStandardMaterial({color:0xffffff})
  const lightParticle = new THREE.Mesh(lightParticleGeometry,lightParticleMaterial);

  lightParticle.scale.x = 0.1
  lightParticle.scale.y = 0.1
  lightParticle.scale.z = 0.1

  const [x,y,z]=Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(40));
  lightParticle.position.set(x,y,z);
  lightParticleGroup.add(lightParticle);
  lightParticlesArray.push(lightParticle);
  scene.add(lightParticleGroup)
}

function animateLightParticles(){
  lightParticlesArray.forEach((lightParticle) => {
    const lightSpeed = lightParticleSettings.speed;
    lightParticle.position.x += (Math.random() - 0.2) * lightSpeed;
    lightParticle.position.y += (Math.random() - 0.2) * lightSpeed;
    lightParticle.position.z += (Math.random() - 0.2) * lightSpeed;

    lightParticle.position.x -= (Math.random() - 0.2) * lightSpeed;
    lightParticle.position.y -= (Math.random() - 0.2) * lightSpeed;
    lightParticle.position.z -= (Math.random() - 0.2) * lightSpeed;
  })
}
  fxFolder.add(guicontrols, 'LightParticleOn').name('Light Particle On');
  fxFolder.add(guicontrols, 'LightParticleOff').name('Light Particle Off');
  fxFolder.add(lightParticleSettings,'speed',0.01,0.1,0.01).name('Light Particle Speed');
  fxFolder.add(lightParticleSettings,'count', 100, 1000, 100).name('Light Particle Count').onChange(updateLightParticleCount);
  
  function updateLightParticleCount() {
    const newCount = lightParticleSettings.count;
    const currentCount = lightParticlesArray.length;
    
      if (newCount > currentCount) {
        const addCount = newCount - currentCount;
        for (let i = 0; i < addCount; i++) {
          if (lightParticleSettings.check === 0){
          createLightParticles();}
        }
      } else if (newCount < currentCount) {
        const removeCount = currentCount - newCount;
        const removedParticles = lightParticlesArray.splice(newCount, removeCount);
    
        removedParticles.forEach((particle) => {
          scene.remove(particle)
          lightParticleGroup.remove(particle);
        });
      }
    
}

//wasd control function
const webMovement = (model) => {

  webStick.on('move', function (event, data) {
    if(model.position.x > leftBound && model.position.x < rightBound && model.position.y > downBound && model.position.y < upBound && model.position.z > frontBound && model.position.z < backBound) {
      model.position.y=data.vector.y*6
      model.position.z=-data.vector.y*4
      model.position.x=data.vector.x*4
    }
  })

  if (model.position.x > leftBound && model.position.x < rightBound && model.position.y > downBound && model.position.y < upBound && model.position.z > frontBound && model.position.z < backBound) {
    
    if (isFor == true ) {
      model.position.y+=0.07
      model.position.z-=0.07
    }
    if (isBack == true) {
      model.position.y-=0.07
      model.position.z +=0.07
    }
    if (isLeft == true) {
      model.position.x -=0.07
    }
    if (isRight == true) {
      model.position.x +=0.07
    }

    if (isUp == true && high == 'false') {
      high = 'true'
      gsap.to(model.position, {duration: 1, y: model.position.y + 1})
    }

    if (isDown == true && high == 'true') {
      high = 'false'
      console.log(high)
      gsap.to(model.position, {duration: 1, y: model.position.y - 1})
    }

  } else if (model.position.y >= upBound) {
    model.position.y-=0.01
    // model.position.z+=0.01
  } else if (model.position.y <= downBound) {
    model.position.y+=0.1
    // model.position.z-=0.1
  } else if (model.position.x <= leftBound) {
    model.position.x +=0.1
  } else if (model.position.x >= rightBound) {
    model.position.x -=0.1
  } else if (model.position.z >= frontBound) {
    model.position.z -=0.1
  } else if (model.position.z <= backBound) {
    model.position.z +=0.1
  } 

  if (rocket.visible == true){
    burnerAlpha.position.x  = ((rocketBox.min.x+rocketBox.max.x)/2)
    burnerAlpha.position.y =  (-0.7+(rocketBox.min.y+rocketBox.max.y)/2)
    burnerAlpha.position.z =  rocketBox.max.z 
    if (cameraMode == 'firstperson') {
      // if (rocket.visible = true) {
      camera.position.z = rocket.position.z + 15.5
      camera.position.y = rocket.position.y
      camera.position.x = rocket.position.x
    }
    
  } else if (wideGuy.visible == true){
    burnerAlpha.position.x  = ((wideBox.min.x+wideBox.max.x)/2)
    burnerAlpha.position.y =  (-1.1+(wideBox.min.y+wideBox.max.y)/2)
    burnerAlpha.position.z =  wideBox.max.z-0.2
    if (cameraMode == 'firstperson') {
      // if (rocket.visible = true) {
      camera.position.z = wideGuy.position.z + 16.5
      camera.position.y = wideGuy.position.y
      camera.position.x = wideGuy.position.x
    }
  } 
  else if (tomahawk.visible == true){
    burnerAlpha.position.x  = ((tomaBox.min.x+tomaBox.max.x)/2)
    burnerAlpha.position.y =  (-0.8+(tomaBox.min.y+tomaBox.max.y)/2)
    burnerAlpha.position.z =  tomaBox.max.z-0.4
    if (cameraMode == 'firstperson') {
      // if (rocket.visible = true) {
      camera.position.z = tomahawk.position.z + 16.5
      camera.position.y = tomahawk.position.y
      camera.position.x = tomahawk.position.x
    }
  }

}

//mobile control function
const mobileMovement = (model) => {
joystick.on('move', function (event, data) {
    if(model.position.x > leftBound && model.position.x < rightBound && model.position.y > downBound && model.position.y < upBound) {
      model.position.y=data.vector.y*6
      model.position.z=-data.vector.y*4
      model.position.x=data.vector.x*4

      } if (model.position.y >= upBound) {
        model.position.y-=0.01
        model.position.z+=0.01
      } if (model.position.y <= downBound) {
        model.position.y+=0.01
        model.position.z-=0.01
      } if (model.position.x <= leftBound) {
        model.position.x +=0.01
      } if (model.position.x >= rightBound) {
        model.position.x -=0.01
      } 
      if (rocket.visible == true){
        burnerAlpha.position.x  = ((rocketBox.min.x+rocketBox.max.x)/2)
        burnerAlpha.position.y =  (-0.7+(rocketBox.min.y+rocketBox.max.y)/2)
        burnerAlpha.position.z =  rocketBox.max.z 
      } else if (wideGuy.visible == true){
        burnerAlpha.position.x  = ((wideBox.min.x+wideBox.max.x)/2)
        burnerAlpha.position.y =  (-1.1+(wideBox.min.y+wideBox.max.y)/2)
        burnerAlpha.position.z =  wideBox.max.z-0.2
      } 
      else if (tomahawk.visible == true){
        burnerAlpha.position.x  = ((tomaBox.min.x+tomaBox.max.x)/2)
        burnerAlpha.position.y =  (-0.8+(tomaBox.min.y+tomaBox.max.y)/2)
        burnerAlpha.position.z =  tomaBox.max.z-0.4
      }

  })
}

guicontrols.LightParticleOn()

// Animate
const tick = () => {
    var elapsedTime = clock.getElapsedTime();

    //all movements for all ships, starting with rocket
    webMovement(rocket)
    webMovement(arrow)
    webMovement(tomahawk)
    webMovement(wideGuy)

    mobileMovement(rocket)
    mobileMovement(arrow)
    mobileMovement(tomahawk)
    mobileMovement(wideGuy)    

    // Update controls
    controls.update();
    rocketBox.setFromObject(rocket);
    wideBox.setFromObject(wideGuy);
    tomaBox.setFromObject(tomahawk);
    arrowBox.setFromObject(arrow);

    speedFunction(elapsedTime, guicontrols.speedMultiplier)

    updateMusicSpeed(guicontrols.speedMultiplier)
    musicVisualiser();
    musicDetune();

    effectComposer.render();

    //rainbow mode loop
    dimmerRed()
    // dimmerOrng()
    dimmerYel()
    dimmerGrn()
    dimmerBlu()
    dimmerPrp()

    //light animate
    animateLightParticles();

    const positions = dropsGeometry.attributes.position.array;

  if (positions) {
    for (let i = 0; i < dropCount; i++) {
      const index = i * 3;
      if (positions[index + 1] < -100) {
        positions[index + 0] = Math.random() * 200 - 100;
        positions[index + 1] = 200;
        positions[index + 2] = Math.random() * 200 - 100;
      } else {
        positions[index + 1] -= Math.random() * rainControls.speed;
      }
    }

    dropsGeometry.attributes.position.needsUpdate = true;
    dropsMaterial.color.setHSL(0.6, 1, rainControls.intensity);
    dropsMaterial.size = rainControls.size;
  }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)