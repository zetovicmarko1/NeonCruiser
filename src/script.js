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
const buildingTexture = textureLoader.load('textures/building.png');
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
scene.add(parent)

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
const fog = new THREE.Fog(0x000000, 0.1, 25);
scene.fog = fog;

// const building = new THREE.CylinderGeometry(5, 5, 50,4,4)
// const building_2 = new THREE.CylinderGeometry(5, 5, 45,4,4)
// const building_3 = new THREE.CylinderGeometry(5, 5, 40,4,4)

var buildingHeightTall = 50
var buildingHeightMed = 45
var buildingHeightShort = 40
var buildingY = Math.PI * 0.25

var rightBound = 2.5
var leftBound = -2.5
var upBound = 2.5
var downBound = -2.5

const cylGeo1 = new THREE.CylinderGeometry(6, 6, buildingHeightTall, 4)
const cylGeo2 = new THREE.CylinderGeometry(6, 6, buildingHeightMed, 4)
const cylGeo3 = new THREE.CylinderGeometry(6, 6, buildingHeightShort, 4)


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

const buildingMaterial = new THREE.MeshStandardMaterial({
  map: buildingTexture,
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

const cylBuilding1=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding1.rotation.y = buildingY

cylBuilding1.position.y = -10
cylBuilding1.position.x = 11.5
cylBuilding1.position.z = 0

scene.add(cylBuilding1)

const cylBuilding2=new THREE.Mesh(cylGeo2, buildingMaterial)
cylBuilding2.rotation.y = buildingY

cylBuilding2.position.y = -10
cylBuilding2.position.x = -11.5
cylBuilding2.position.z = 0

scene.add(cylBuilding2)

const cylBuilding3=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding3.rotation.y = buildingY

cylBuilding3.position.y = -10
cylBuilding3.position.x = -11.5
cylBuilding3.position.z = 0

scene.add(cylBuilding3)

const cylBuilding4=new THREE.Mesh(cylGeo2, buildingMaterial)
cylBuilding4.rotation.y = buildingY

cylBuilding4.position.y = -10
cylBuilding4.position.x = 11.5
cylBuilding4.position.z = 0

scene.add(cylBuilding4)

const cylBuilding5=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding5.rotation.y = buildingY

cylBuilding5.position.y = -10
cylBuilding5.position.x = 11.5
cylBuilding5.position.z = 0

scene.add(cylBuilding5)

const cylBuilding6=new THREE.Mesh(cylGeo3, buildingMaterial)
cylBuilding6.rotation.y = buildingY

cylBuilding6.position.y = -10
cylBuilding6.position.x = -11.5
cylBuilding6.position.z = 0

scene.add(cylBuilding6)

const cylBuilding7=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding7.rotation.y = buildingY

cylBuilding7.position.y = -10
cylBuilding7.position.x = -11.5
cylBuilding7.position.z = 0

scene.add(cylBuilding7)

const cylBuilding8=new THREE.Mesh(cylGeo3, buildingMaterial)
cylBuilding8.rotation.y = buildingY

cylBuilding8.position.y = -10
cylBuilding8.position.x = 11.5
cylBuilding8.position.z = 0

scene.add(cylBuilding8)

const cylBuilding9=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding9.rotation.y = buildingY

cylBuilding9.position.y = -10
cylBuilding9.position.x = 21.5
cylBuilding9.position.z = 0

scene.add(cylBuilding9)

const cylBuilding10=new THREE.Mesh(cylGeo2, buildingMaterial)
cylBuilding10.rotation.y = buildingY

cylBuilding10.position.y = -10
cylBuilding10.position.x = -21.5
cylBuilding10.position.z = 0

scene.add(cylBuilding10)

const cylBuilding11=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding11.rotation.y = buildingY

cylBuilding11.position.y = -10
cylBuilding11.position.x = -21.5
cylBuilding11.position.z = 0

scene.add(cylBuilding11)

const cylBuilding12=new THREE.Mesh(cylGeo2, buildingMaterial)
cylBuilding12.rotation.y = buildingY

cylBuilding12.position.y = -10
cylBuilding12.position.x = 21.5
cylBuilding12.position.z = 0

scene.add(cylBuilding12)

const cylBuilding13=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding13.rotation.y = buildingY


cylBuilding13.position.y = -10
cylBuilding13.position.x = 21.5
cylBuilding13.position.z = 0

scene.add(cylBuilding13)

const cylBuilding14=new THREE.Mesh(cylGeo3, buildingMaterial)
cylBuilding14.rotation.y = buildingY

cylBuilding14.position.y = -10
cylBuilding14.position.x = -21.5
cylBuilding14.position.z = 0

scene.add(cylBuilding14)

const cylBuilding15=new THREE.Mesh(cylGeo1, buildingMaterial)
cylBuilding15.rotation.y = buildingY

cylBuilding15.position.y = -10
cylBuilding15.position.x = -21.5
cylBuilding15.position.z = 0

scene.add(cylBuilding15)

const cylBuilding16=new THREE.Mesh(cylGeo3, buildingMaterial)
cylBuilding16.rotation.y = buildingY

cylBuilding16.position.y = -10
cylBuilding16.position.x = 21.5
cylBuilding16.position.z = 0

scene.add(cylBuilding16)

//road code
road.position.y = -10
road.scale.z  =2
road2.position.y = -10
road3.position.y = -10
road3.position.x = -20
road3.scale.z  =4
road2.position.x = 20
road2.scale.z=4

scene.add(road);
scene.add(road2);
scene.add(road3);


var buildingsAllCyl = new THREE.Group();
// var roads = new THREE.Group();

buildingsAllCyl.add(cylBuilding1, cylBuilding2, cylBuilding3, cylBuilding4, cylBuilding5, cylBuilding6, cylBuilding7, cylBuilding8, cylBuilding9, cylBuilding10, cylBuilding11, cylBuilding12, cylBuilding13, cylBuilding14, cylBuilding15, cylBuilding16)
buildingsAllCyl.add(road, road2, road3)
scene.add(buildingsAllCyl)
// scene.add(roads)

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
    
    cylBuilding1.rotation.x = ((Math.PI * time)/multiplier) + 0.2
    cylBuilding2.rotation.x = (Math.PI * time)/multiplier
    cylBuilding3.rotation.x = ((Math.PI * time)/multiplier) +  (Math.PI * 0.5)
    cylBuilding4.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)
    cylBuilding5.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)
    cylBuilding6.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75)
    cylBuilding7.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25)
    cylBuilding8.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)

    cylBuilding9.rotation.x = ((Math.PI * time)/multiplier) + 0.7
    cylBuilding10.rotation.x = ((Math.PI * time)/multiplier)+ 0.5
    cylBuilding11.rotation.x = ((Math.PI * time)/multiplier) +  (Math.PI * 0.5) + 0.5
    cylBuilding12.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.5+0.2)+ 0.7
    cylBuilding13.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75+0.2)+ 0.7
    cylBuilding14.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.75) + 0.5
    cylBuilding15.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25) + 0.5
    cylBuilding16.rotation.x = ((Math.PI * time)/multiplier) + (Math.PI * 0.25 + 0.2)+ 0.7
    // parent.position.x = (Math.sin(time*(multiplier-5))/(multiplier))*(0.4/15)*8
    // parent.position.y = 
    parent.rotation.z = (Math.cos(time*(multiplier-5))/(multiplier*2))*(0.4/15)*8 
    parent.rotation.x = (Math.sin(time*(multiplier-5))/(multiplier*2))*(0.4/15)

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
    //songOn: false
    playMusic:() =>{
      gsap.to(music.play())
    },
    stopMusic:() =>{
      gsap.to(music.stop())
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
scene.add(ambientLight); //this is the main colour, it uses an ambient light for it

//function to change the lighting colour
var changeColor = (val) =>  {
  ambientLight.color.set(guicontrols.color)
} 

//gui controls
const cameraFolder = gui.addFolder('Camera Controls')
const infraFolder = gui.addFolder('Road and Building Controls')
const radiusFolder = gui.addFolder('Building Radius Controls')
const fxFolder = gui.addFolder('Atmosphere and Lighting')
const ctrlFolder = gui.addFolder('Cruise Controls')
const audioFolder = gui.addFolder('Audio Controls')
const vehicleFolder = gui.addFolder('Vehicle Adjustments')

// function for "disposing" of a geometry
const updateGroupGeometry = (mesh, geometry) => {
  mesh.geometry.dispose()
  mesh.geometry = geometry;
}

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


const genNewTall = () => {
  updateGroupGeometry(cylBuilding1, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding3, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding5, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding7, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding9, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding11, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding13, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding15, new THREE.CylinderGeometry(tallBuildingData.radiusTop, tallBuildingData.radiusBottom, tallBuildingData.height, tallBuildingData.radialSegments))
    //1,3,5,7,9,11,13,15
}

const genNewShort = () => {
  updateGroupGeometry(cylBuilding6, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding8, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding14, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding16, new THREE.CylinderGeometry(shortBuildingData.radiusTop, shortBuildingData.radiusBottom, shortBuildingData.height, shortBuildingData.radialSegments))
    //6,8,14,16
}

const genNewMed= () => {
  updateGroupGeometry(cylBuilding2, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding4, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding10, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
  updateGroupGeometry(cylBuilding12, new THREE.CylinderGeometry(medBuildingData.radiusTop, medBuildingData.radiusBottom, medBuildingData.height, medBuildingData.radialSegments))
    //2,4,10,12
}


gui.add(guicontrols, 'instructions').name('Click for Instructions')
ctrlFolder.add(guicontrols, 'speedMultiplier').min(0.4).max(15).step(0.01).name('Cruising Speed')
fxFolder.addColor(guicontrols, 'color').onChange(changeColor).name('Neon Colour')
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
vehicleFolder.add(parent.scale, 'x').min(0.6).max(1.6).name("Width").step(0.0001)
vehicleFolder.add(parent.scale, 'y').min(1).max(1.2).name("Length").step(0.0001)
infraFolder.add(buildingsAllCyl.scale, 'x').min(0.5).max(2).step(0.0001).name("Road Width")
infraFolder.add(tallBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewTall).name("Tall Building Segments")
infraFolder.add(medBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewMed).name("Medium Building Segments")
infraFolder.add(shortBuildingData, 'radialSegments').min(4).max(10).step(1).onChange(genNewShort).name("Short Building Segments")
infraFolder.add(tallBuildingData, 'height').min(45).max(55).step(0.01).onChange(genNewTall).name("Tall Building Height")
infraFolder.add(medBuildingData, 'height').min(40).max(50).step(0.01).onChange(genNewMed).name("Medium Building Height")
infraFolder.add(shortBuildingData, 'height').min(35).max(45).step(0.01).onChange(genNewShort).name("Short Building Height")
radiusFolder.add(tallBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewTall).name("Tall Building Top Radius")
radiusFolder.add(medBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewMed).name("Medium Building Top Radius")
radiusFolder.add(shortBuildingData, 'radiusTop').min(1).max(8).step(0.001).onChange(genNewShort).name("Short Building Top Radius")
radiusFolder.add(tallBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewTall).name("Tall Building Bottom Radius")
radiusFolder.add(medBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewMed).name("Medium Building Bottom Radius")
radiusFolder.add(shortBuildingData, 'radiusBottom').min(1).max(8).step(0.001).onChange(genNewShort).name("Short Building Bottom Radius")



//debug
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;
gui.add(controls,'enableZoom')
gui.add(controls,'enableRotate')
gui.add(controls,'enablePan')
// miscFolder.add(guicontrols, 'songOn').onChange(playing).name("Sound On?")
audioFolder.add(guicontrols,'playMusic').name('paly')
audioFolder.add(guicontrols,'stopMusic').name('stop')

//moving
var isUp = false
var isDown = false
var isLeft = false
var isRight = false

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

var onKeyDown = (e) => {
  // console.log(e.code);
  switch (e.keyCode) {
    case 87:
      isUp = true;
      break;
    case 83:
      isDown = true;
      break;
    case 65:
      isLeft = true;
      break;
    case 68:
      isRight = true;
      break;
  }
  // effectComposer.render
}

var onKeyUp = (e) => {
  // console.log(e.code
  switch (e.keyCode) {
    case 87:
      isUp = false;
      break;
    case 83:
      isDown = false;
      break;
    case 65:
      isLeft = false;
      break;
    case 68:
      isRight = false;
      break;
  }
  
}

// Animate
const tick = () => {
    var elapsedTime = clock.getElapsedTime();
    if(parent.position.x > leftBound && parent.position.x < rightBound && parent.position.y > downBound && parent.position.y < upBound) {
      if (isUp == true) {
        parent.position.y+=0.1
        parent.position.z-=0.1
}

      if (isDown == true) {
        parent.position.y-=0.1
        parent.position.z +=0.1
      }

      if (isLeft == true) {
        // parent.position.y-=elapsedTime*1000
        parent.position.x -=0.1
      }

      if (isRight == true) {
        // parent.position.y-=elapsedTime*1000
        parent.position.x +=0.1
        
      }
    } else if (parent.position.y >= upBound) {
      parent.position.y-=0.01
      parent.position.z+=0.01
    } else if (parent.position.y <= downBound) {
      parent.position.y+=0.1
      parent.position.z-=0.1
    } else if (parent.position.x <= leftBound) {
      parent.position.x +=0.1
    } else if (parent.position.x >= rightBound) {
      parent.position.x -=0.1
    }

     

    // Update controls
    controls.update();

    speedFunction(elapsedTime, guicontrols.speedMultiplier)

    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)

