// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

varying vec2 vUv;

varying float vRandom;


void main()
{   
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += aRandom * uFrequency.y;
    // modelPosition.x += aRandom * uFrequency.y;

    vRandom = aRandom;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;


}



const torus = new THREE.TorusGeometry(10, 5);
const material = new THREE.MeshStandardMaterial({
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
console.log(torus)

// var uniforms = THREE.UniformsUtils.merge( [

// 	THREE.UniformsLib[ "lights" ],
// 	// ...

// ] );

var uniforms = THREE.UniformsUtils.merge(THREE.UniformsLib["lights"]);
uniforms['uTime'] = {value:0};
uniforms['uFrequency'] = {value: new THREE.Vector2(0,0)},
uniforms['uTexture'] = {value: gridTexture};


const shaderMat = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  lights:true,
  uniforms: uniforms
})