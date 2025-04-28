// import RAPIER from "@dimforge/rapier3d-compat";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { DRACOLoader } from "https://esm.sh/three@0.176.0/examples/jsm/loaders/DRACOLoader.js";
// let scene, camera, renderer, clock;
// let character,
//   characterMixer,
//   actions = {};
// let rigidBody, world;
// let cameraTarget, cameraPosition;
// let isClicking = false;
// let controls;

// const keyboard = {};
// const keysMap = {
//   forward: ["ArrowUp", "KeyW"],
//   backward: ["ArrowDown", "KeyS"],
//   left: ["ArrowLeft", "KeyA"],
//   right: ["ArrowRight", "KeyD"],
//   run: ["ShiftLeft", "ShiftRight"],
// };

// const WALK_SPEED = 0.8;
// const RUN_SPEED = 1.6;
// const ROTATION_SPEED = THREE.MathUtils.degToRad(0.5);

// let rotationTarget = 0;
// let characterRotationTarget = 0;

// const maps = {
//   animal_crossing_map: {
//     scale: 3,
//     position: [-6, -7, 0],
//     model: "../../assets/models/animal_crossing_map.glb",
//   },
// };

// let container; // <- this will hold the container element globally

// export async function create3DSpace(containerId = "td-space") {
//   container = document.getElementById(containerId);
//   container.style.width = "100%";
//   container.style.height = "100%";
//   console.log(container);
//   if (!container) {
//     console.error(`Container with id "${containerId}" not found!`);
//     return;
//   }
//   await init().then(animate);
// }

// async function init() {
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xececec);

//   camera = new THREE.PerspectiveCamera(
//     40,
//     container.clientWidth / container.clientHeight,
//     0.1,
//     100
//   );
//   camera.position.set(3, 3, 3);

//   // Create loading spinner div
//   const loadingSpinner = document.createElement("div");
//   loadingSpinner.id = "loading-spinner";
//   loadingSpinner.style.position = "fixed";
//   loadingSpinner.style.top = "50%";
//   loadingSpinner.style.left = "50%";
//   loadingSpinner.style.transform = "translate(-50%, -50%)";
//   loadingSpinner.style.fontSize = "24px";
//   loadingSpinner.style.color = "#333";
//   loadingSpinner.style.fontFamily = "sans-serif";
//   loadingSpinner.style.zIndex = "9999";
//   loadingSpinner.innerText = "Loading...";

//   // Add it to the document body
//   container.appendChild(loadingSpinner);

//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.shadowMap.enabled = true;
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   container.appendChild(renderer.domElement);
//   console.log(container.clientWidth, container.clientHeight);

//   clock = new THREE.Clock();

//   const light = new THREE.DirectionalLight(0xffffff, 0.65);
//   light.castShadow = true;
//   light.position.set(-15, 10, 15);
//   scene.add(light);

//   const loader = new THREE.GLTFLoader();
//   const dracoLoader = new DRACOLoader();
//   dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Or a local path if you prefer
//   loader.setDRACOLoader(dracoLoader);
//   const mapInfo = maps["animal_crossing_map"];
//   loader.load(
//     mapInfo.model,
//     (gltf) => {
//       const map = gltf.scene;
//       map.scale.setScalar(mapInfo.scale);
//       map.position.set(...mapInfo.position);
//       map.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;

//           if (child.material?.map) {
//             child.material.map.colorSpace = THREE.SRGBColorSpace;
//           }
//         }
//       });
//       scene.add(map);

//       // ✅ Hide loading spinner after loading
//       if (loadingSpinner) {
//         loadingSpinner.style.display = "none";
//       }
//     },
//     (xhr) => {
//       // Optional: you can track progress percentage here
//       if (loadingSpinner) {
//         loadingSpinner.innerText = `Loading... ${Math.round(
//           (xhr.loaded / xhr.total) * 100
//         )}%`;
//       }
//     },
//     (error) => {
//       console.error("An error happened", error);
//       if (loadingSpinner) {
//         loadingSpinner.innerText = "Failed to load assets.";
//       }
//     }
//   );

//   if (typeof RAPIER !== "undefined") {
//     await RAPIER.init({});
//     world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
//   } else {
//     console.error("RAPIER is not loaded correctly.");
//   }

//   const characterRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().lockRotations();
//   rigidBody = world.createRigidBody(characterRigidBodyDesc);
//   const colliderDesc = RAPIER.ColliderDesc.capsule(0.08, 0.15);
//   world.createCollider(colliderDesc, rigidBody);

//   loader.load("../../assets/models/character.glb", (gltf) => {
//     character = gltf.scene;
//     character.scale.set(0.18, 0.18, 0.18);
//     character.position.y = -0.25;
//     scene.add(character);

//     characterMixer = new THREE.AnimationMixer(character);
//     gltf.animations.forEach((clip) => {
//       actions[clip.name] = characterMixer.clipAction(clip);
//     });
//     playAnimation("idle");
//   });

//   cameraTarget = new THREE.Object3D();
//   cameraTarget.position.z = 1.5;
//   scene.add(cameraTarget);

//   cameraPosition = new THREE.Object3D();
//   cameraPosition.position.set(0, 4, -4);
//   scene.add(cameraPosition);

//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;
//   controls.screenSpacePanning = false;
//   controls.minDistance = 1;
//   controls.maxDistance = 50;
//   controls.maxPolarAngle = Math.PI / 2;

//   window.addEventListener("resize", onWindowResize);
//   document.addEventListener("keydown", (e) => (keyboard[e.code] = true));
//   document.addEventListener("keyup", (e) => (keyboard[e.code] = false));
//   document.addEventListener("mousedown", () => (isClicking = true));
//   document.addEventListener("mouseup", () => (isClicking = false));
//   document.addEventListener("touchstart", () => (isClicking = true));
//   document.addEventListener("touchend", () => (isClicking = false));
// }

// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta();
//   if (characterMixer) characterMixer.update(delta);

//   if (character) updateCharacter(delta);

//   world.step();

//   if (character && camera) {
//     const distance = character.position.distanceTo(camera.position);
//     console.log("Distance:", distance);
//   }

//   controls.update(); // ✨ add this line
//   renderer.render(scene, camera);
// }

// // function updateCharacter(delta) {
// //   const vel = rigidBody.linvel();
// //   let movement = { x: 0, z: 0 };

// //   if (isKeyPressed("forward")) movement.z = 1;
// //   if (isKeyPressed("backward")) movement.z = -1;
// //   if (isKeyPressed("left")) movement.x = 1;
// //   if (isKeyPressed("right")) movement.x = -1;

// //   let speed = isKeyPressed("run") ? RUN_SPEED : WALK_SPEED;

// //   if (isClicking) {
// //     // Clicking logic
// //     // Not fully implemented (mouse.x, mouse.y not tracked here)
// //   }

// //   if (movement.x !== 0) rotationTarget += ROTATION_SPEED * movement.x;

// //   if (movement.x !== 0 || movement.z !== 0) {
// //     characterRotationTarget = Math.atan2(movement.x, movement.z);

// //     vel.x = Math.sin(rotationTarget + characterRotationTarget) * speed;
// //     vel.z = Math.cos(rotationTarget + characterRotationTarget) * speed;

// //     if (speed === RUN_SPEED) {
// //       playAnimation("run");
// //     } else {
// //       playAnimation("walk");
// //     }
// //   } else {
// //     playAnimation("idle");
// //   }

// //   // Smooth character rotation
// //   character.rotation.y = lerpAngle(
// //     character.rotation.y,
// //     characterRotationTarget,
// //     0.1
// //   );

// //   rigidBody.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);

// //   // Smooth camera
// //   cameraPosition.getWorldPosition(_vec1);
// //   camera.position.lerp(_vec1, 0.1);
// //   cameraTarget.getWorldPosition(_vec2);
// //   _vec3.lerpVectors(_vec3, _vec2, 0.1);
// //   camera.lookAt(_vec3);

// //   character.position.copy(rigidBody.translation());
// // }

// // Helpers

// function updateCharacter(delta) {
//   const vel = rigidBody.linvel();
//   let movement = { x: 0, z: 0 };

//   if (isKeyPressed("forward")) movement.z = 1;
//   if (isKeyPressed("backward")) movement.z = -1;
//   if (isKeyPressed("left")) movement.x = 1;
//   if (isKeyPressed("right")) movement.x = -1;

//   let speed = isKeyPressed("run") ? RUN_SPEED : WALK_SPEED;

//   if (movement.x !== 0) rotationTarget += ROTATION_SPEED * movement.x;

//   if (movement.x !== 0 || movement.z !== 0) {
//     characterRotationTarget = Math.atan2(movement.x, movement.z);

//     vel.x = Math.sin(rotationTarget + characterRotationTarget) * speed;
//     vel.z = Math.cos(rotationTarget + characterRotationTarget) * speed;

//     if (speed === RUN_SPEED) {
//       playAnimation("run");
//     } else {
//       playAnimation("walk");
//     }
//   } else {
//     playAnimation("idle");
//   }

//   character.rotation.y = lerpAngle(
//     character.rotation.y,
//     characterRotationTarget,
//     0.1
//   );

//   rigidBody.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);

//   // Update character's position from physics
//   character.position.copy(rigidBody.translation());

//   // ❌ REMOVE: cameraPosition.position.add(new Vector3(0, 2, -2));
//   // ✅ INSTEAD: Calculate new camera position fresh every frame

//   cameraTarget.position.copy(character.position);
//   cameraTarget.position.y += 1.5;

//   // Freshly calculate the desired camera position based on character
//   const cameraOffset = new THREE.Vector3(0, 2, -4); // slightly higher and further back
//   const desiredCameraPosition = character.position.clone().add(cameraOffset);

//   // Smooth camera movement
//   camera.position.lerp(desiredCameraPosition, 0.1);

//   cameraTarget.getWorldPosition(_vec2);
//   _vec3.lerpVectors(_vec3, _vec2, 0.1);
//   camera.lookAt(_vec3);
// }

// function isKeyPressed(action) {
//   return keysMap[action]?.some((code) => keyboard[code]);
// }

// function playAnimation(name) {
//   if (!actions[name]) return;
//   for (let key in actions) {
//     actions[key].fadeOut(0.24);
//   }
//   actions[name].reset().fadeIn(0.24).play();
// }

// function lerpAngle(start, end, t) {
//   start = normalizeAngle(start);
//   end = normalizeAngle(end);

//   if (Math.abs(end - start) > Math.PI) {
//     if (end > start) {
//       start += 2 * Math.PI;
//     } else {
//       end += 2 * Math.PI;
//     }
//   }
//   return normalizeAngle(start + (end - start) * t);
// }

// function normalizeAngle(angle) {
//   while (angle > Math.PI) angle -= 2 * Math.PI;
//   while (angle < -Math.PI) angle += 2 * Math.PI;
//   return angle;
// }

// function onWindowResize() {
//   camera.aspect = container.clientWidth / container.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(container.clientWidth, container.clientHeight); // ← Fix here
// }

// // Vectors for camera
// const _vec1 = new THREE.Vector3();
// const _vec2 = new THREE.Vector3();
// const _vec3 = new THREE.Vector3();

// import RAPIER from "@dimforge/rapier3d-compat";
// import { DRACOLoader } from "https://esm.sh/three@0.176.0/examples/jsm/loaders/DRACOLoader.js";

// // Scene elements
// let scene, camera, renderer, clock;
// let character, characterMixer, actions = {};
// let rigidBody, world;
// let mapColliders = []; // Store map colliders here

// // Camera control
// const cameraOffset = new THREE.Vector3(0, 1.5, -3);
// const cameraLookAt = new THREE.Vector3(0, 1, 0);
// const tempVec = new THREE.Vector3();

// // Character control
// const keyboard = {};
// const keysMap = {
//   forward: ["ArrowUp", "KeyW"],
//   backward: ["ArrowDown", "KeyS"],
//   left: ["ArrowLeft", "KeyA"],
//   right: ["ArrowRight", "KeyD"],
//   run: ["ShiftLeft", "ShiftRight"],
// };

// const WALK_SPEED = 0.8;
// const RUN_SPEED = 1.6;
// const ROTATION_SPEED = THREE.MathUtils.degToRad(2);
// const CHARACTER_HEIGHT = 1.6;
// const CHARACTER_RADIUS = 0.3;

// let characterRotationTarget = 0;

// // Game maps
// const maps = {
//   animal_crossing_map: {
//     scale: 3,
//     position: [-6, -7, 0],
//     model: "../../assets/models/animal_crossing_map.glb",
//   },
// };

// let container;

// export async function create3DSpace(containerId = "td-space") {
//   container = document.getElementById(containerId);
//   if (!container) {
//     console.error(`Container with id "${containerId}" not found!`);
//     return;
//   }

//   container.style.width = "100%";
//   container.style.height = "100%";

//   await init().then(animate);
// }

// async function init() {
//   // Scene setup
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xececec);

//   // Camera setup
//   camera = new THREE.PerspectiveCamera(
//     60,
//     container.clientWidth / container.clientHeight,
//     0.1,
//     100
//   );
//   camera.position.copy(cameraOffset);

//   // Loading spinner
//   const loadingSpinner = document.createElement("div");
//   loadingSpinner.id = "loading-spinner";
//   loadingSpinner.style.position = "fixed";
//   loadingSpinner.style.top = "50%";
//   loadingSpinner.style.left = "50%";
//   loadingSpinner.style.transform = "translate(-50%, -50%)";
//   loadingSpinner.style.fontSize = "24px";
//   loadingSpinner.style.color = "#333";
//   loadingSpinner.style.fontFamily = "sans-serif";
//   loadingSpinner.style.zIndex = "9999";
//   loadingSpinner.innerText = "Loading...";
//   container.appendChild(loadingSpinner);

//   // Renderer
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.shadowMap.enabled = true;
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   container.appendChild(renderer.domElement);

//   clock = new THREE.Clock();

//   // Lighting
//   const light = new THREE.DirectionalLight(0xffffff, 0.65);
//   light.castShadow = true;
//   light.position.set(-15, 10, 15);
//   scene.add(light);

//   // Physics
//   await RAPIER.init();
//   world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

//   // Character physics
//   const characterRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
//     .lockRotations()
//     .setTranslation(0, 5, 0); // Start above ground to prevent falling through
//   rigidBody = world.createRigidBody(characterRigidBodyDesc);

//   // Create character collider (capsule shape)
//   const colliderDesc = RAPIER.ColliderDesc.capsule(CHARACTER_HEIGHT/2, CHARACTER_RADIUS)
//     .setTranslation(0, CHARACTER_HEIGHT/2, 0); // Center the capsule
//   world.createCollider(colliderDesc, rigidBody);

//   // Load map
//   const loader = new THREE.GLTFLoader();
//   const dracoLoader = new DRACOLoader();
//   dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
//   loader.setDRACOLoader(dracoLoader);

//   const mapInfo = maps["animal_crossing_map"];
//   loader.load(
//     mapInfo.model,
//     (gltf) => {
//       const map = gltf.scene;
//       map.scale.setScalar(mapInfo.scale);
//       map.position.set(...mapInfo.position);

//       // Create colliders for map geometry
//       map.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;

//           if (child.material?.map) {
//             child.material.map.colorSpace = THREE.SRGBColorSpace;
//           }

//           // Create collider for each mesh
//           if (child.geometry) {
//             const vertices = child.geometry.attributes.position.array;
//             const indices = child.geometry.index?.array;

//             // Create trimesh collider
//             const colliderDesc = RAPIER.ColliderDesc.trimesh(
//               new Float32Array(vertices),
//               indices ? new Uint32Array(indices) : undefined
//             )
//             .setRotation(child.quaternion)
//             .setTranslation(child.position)
//             .setScale(new THREE.Vector3(mapInfo.scale, mapInfo.scale, mapInfo.scale));

//             const mapCollider = world.createCollider(colliderDesc);
//             mapColliders.push(mapCollider);
//           }
//         }
//       });

//       scene.add(map);
//       loadingSpinner.style.display = "none";
//     },
//     (xhr) => {
//       loadingSpinner.innerText = `Loading... ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
//     },
//     (error) => {
//       console.error("Error loading map:", error);
//       loadingSpinner.innerText = "Failed to load map";
//     }
//   );

//   // Load character
//   loader.load("../../assets/models/character.glb", (gltf) => {
//     character = gltf.scene;
//     character.scale.set(0.18, 0.18, 0.18);
//     character.position.y = -0.25;
//     scene.add(character);

//     characterMixer = new THREE.AnimationMixer(character);
//     gltf.animations.forEach((clip) => {
//       actions[clip.name] = characterMixer.clipAction(clip);
//     });
//     playAnimation("idle");
//   }, undefined, (error) => {
//     console.error("Error loading character:", error);
//   });

//   // Event listeners
//   window.addEventListener("resize", onWindowResize);
//   document.addEventListener("keydown", (e) => (keyboard[e.code] = true));
//   document.addEventListener("keyup", (e) => (keyboard[e.code] = false));
// }

// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta();
//   if (characterMixer) characterMixer.update(delta);
//   if (character) updateCharacter(delta);

//   world.step();

//   // Update character position after physics step
//   if (character && rigidBody) {
//     character.position.copy(rigidBody.translation());
//     character.position.y -= CHARACTER_HEIGHT/2; // Adjust for capsule center
//   }

//   renderer.render(scene, camera);
// }

// function updateCharacter(delta) {
//   if (!rigidBody) return;

//   const vel = rigidBody.linvel();
//   let movement = { x: 0, z: 0 };

//   // Input handling
//   if (isKeyPressed("forward")) movement.z = 1;
//   if (isKeyPressed("backward")) movement.z = -1;
//   if (isKeyPressed("left")) movement.x = 1;
//   if (isKeyPressed("right")) movement.x = -1;

//   // Movement and rotation
//   let speed = isKeyPressed("run") ? RUN_SPEED : WALK_SPEED;

//   if (movement.x !== 0 || movement.z !== 0) {
//     characterRotationTarget = Math.atan2(movement.x, movement.z);

//     vel.x = Math.sin(characterRotationTarget) * speed;
//     vel.z = Math.cos(characterRotationTarget) * speed;

//     playAnimation(speed === RUN_SPEED ? "run" : "walk");
//   } else {
//     playAnimation("idle");
//   }

//   // Smooth rotation
//   character.rotation.y = lerpAngle(
//     character.rotation.y,
//     characterRotationTarget,
//     5 * delta
//   );

//   // Maintain vertical position (prevent falling through floor)
//   const translation = rigidBody.translation();
//   if (translation.y < 0) {
//     rigidBody.setTranslation({ x: translation.x, y: 0, z: translation.z }, true);
//   }

//   // Update physics velocity
//   rigidBody.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);

//   // Update camera
//   updateCamera(delta);
// }

// function updateCamera(delta) {
//   if (!character) return;

//   // Calculate desired camera position
//   tempVec.copy(cameraOffset);
//   tempVec.applyQuaternion(character.quaternion);
//   tempVec.add(character.position);

//   // Smooth camera movement
//   camera.position.lerp(tempVec, 5 * delta);

//   // Calculate look-at point
//   cameraLookAt.copy(character.position);
//   cameraLookAt.y += 1;
//   camera.lookAt(cameraLookAt);
// }

// // Helper functions
// function isKeyPressed(action) {
//   return keysMap[action]?.some((code) => keyboard[code]);
// }

// function playAnimation(name) {
//   if (!actions[name]) return;
//   Object.values(actions).forEach(action => action.fadeOut(0.2));
//   actions[name].reset().fadeIn(0.2).play();
// }

// function lerpAngle(start, end, t) {
//   while (end - start > Math.PI) start += Math.PI * 2;
//   while (end - start < -Math.PI) start -= Math.PI * 2;
//   return start + (end - start) * t;
// }

// function onWindowResize() {
//   camera.aspect = container.clientWidth / container.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(container.clientWidth, container.clientHeight);
// }

import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { DRACOLoader } from "https://esm.sh/three@0.176.0/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "https://esm.sh/three@0.176.0/examples/jsm/loaders/GLTFLoader.js";
import { DynamicJoystickController } from "https://threeviewer.web.app/assets/js/inputs/joystick-controller.js";
// Scene elements
let scene, camera, renderer, clock;
let character,
  characterMixer,
  actions = {};
let rigidBody, world;

// Character dimensions
const CHARACTER_HEIGHT = 1.8;
const CHARACTER_RADIUS = 0.3;
const GROUND_OFFSET = 0.5;

// Camera control
const cameraOffset = new THREE.Vector3(0, 1.5, -3);
const cameraLookAt = new THREE.Vector3(0, 1, 0);
const tempVec = new THREE.Vector3();

// Character control
const keyboard = {};
const keysMap = {
  forward: ["ArrowUp", "KeyW"],
  backward: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  run: ["ShiftLeft", "ShiftRight"],
};

const WALK_SPEED = 0.8;
const RUN_SPEED = 1.6;
const ROTATION_SPEED = THREE.MathUtils.degToRad(2);

let characterRotationTarget = 0;

// Game maps
const maps = {
  animal_crossing_map: {
    scale: 3,
    position: [0, 0, 0],
    model: "../../assets/models/animal_crossing_map.glb",
  },
};

let container;

export async function create3DSpace(containerId = "td-space") {
  container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found!`);
    return;
  }

  container.style.width = "100%";
  container.style.height = "100%";

  await init().then(animate);
}

async function init() {

  // Physics
  await RAPIER.init();
  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xececec);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.copy(cameraOffset);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 0.65);
  light.castShadow = true;
  light.position.set(-15, 10, 15);
  scene.add(light);

  // Load map first
  loadMap(() => {
    setupCharacter();
  });

  // Event listeners
  window.addEventListener("resize", onWindowResize);
  document.addEventListener("keydown", (e) => (keyboard[e.code] = true));
  document.addEventListener("keyup", (e) => (keyboard[e.code] = false));
}

// Loaders
function loadMap(onMapLoaded) {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  const mapInfo = {
    model: "../../assets/models/animal_crossing_map.glb", // Update this
    scale: 1,
    position: [0, 0, 0],
  };

  loader.load(
    mapInfo.model,
    (gltf) => {
      const map = gltf.scene;
      map.scale.setScalar(mapInfo.scale);
      map.position.set(...mapInfo.position);
      scene.add(map);

      map.traverse((child) => {
        if (
          child.isMesh &&
          (child.name.includes("ground") || child.name.includes("floor"))
        ) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material?.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          child.updateMatrixWorld(true);

          const geometry = child.geometry.clone();
          geometry.applyMatrix4(child.matrixWorld);

          const vertices = geometry.attributes.position.array;
          const indices = geometry.index ? geometry.index.array : undefined;

          const colliderDesc = RAPIER.ColliderDesc.trimesh(
            new Float32Array(vertices),
            indices ? new Uint32Array(indices) : undefined
          )
            .setFriction(1.0)
            .setRestitution(0.0);

          world.createCollider(colliderDesc);
        }
      });

      onMapLoaded();
    },
    undefined,
    (error) => {
      console.error("Error loading map:", error);
    }
  );
}

// Load character with improved animation handling
function setupCharacter() {
  // Create character physics body
  const characterRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .lockRotations()
    .setTranslation(0, CHARACTER_HEIGHT + GROUND_OFFSET, 0);

  rigidBody = world.createRigidBody(characterRigidBodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.capsule(
    CHARACTER_HEIGHT / 2,
    CHARACTER_RADIUS
  )
    .setTranslation(0, CHARACTER_HEIGHT / 2, 0)
    .setFriction(1.0)
    .setRestitution(0.0);

  world.createCollider(colliderDesc, rigidBody);

  // Load the character model
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    "../../assets/models/character.glb", // Update this
    (gltf) => {
      character = gltf.scene;
      character.scale.set(0.18, 0.18, 0.18);
      character.position.set(0, 0, 0);
      scene.add(character);

      characterMixer = new THREE.AnimationMixer(character);
      gltf.animations.forEach((clip) => {
        const action = characterMixer.clipAction(clip);
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;
        actions[clip.name.toLowerCase()] = action;
      });

      playAnimation("idle");
    },
    undefined,
    (error) => {
      console.error("Error loading character:", error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1); // Cap delta to prevent physics issues
  if (characterMixer) characterMixer.update(delta);
  if (character) updateCharacter(delta);

  // Step physics with fixed timestep
  world.timestep = 1 / 60;
  world.step();

  // Update character position and handle ground collision
  if (character && rigidBody) {
    const translation = rigidBody.translation();
    character.position.set(
      translation.x,
      translation.y - CHARACTER_HEIGHT / 2,
      translation.z
    );

    // Enhanced ground detection with multiple rays
    const rayOrigin = {
      x: translation.x,
      y: translation.y + 0.1,
      z: translation.z,
    };
    const rayDir = { x: 0, y: -1, z: 0 };
    const maxToi = CHARACTER_HEIGHT * 2;
    const solid = true;

    const ray = new RAPIER.Ray(rayOrigin, rayDir);
    const rayHit = world.castRay(ray, maxToi, solid);

    if (rayHit) {
      const groundDistance = rayHit.toi;
      const groundY = rayOrigin.y - groundDistance;
      const targetY = groundY + CHARACTER_HEIGHT / 2 + 0.01;

      if (translation.y < targetY) {
        rigidBody.setTranslation(
          { x: translation.x, y: targetY, z: translation.z },
          true
        );

        // Only reset downward velocity
        const currentVel = rigidBody.linvel();
        if (currentVel.y < 0) {
          rigidBody.setLinvel({ x: currentVel.x, y: 0, z: currentVel.z }, true);
        }
      }
    } else {
      // Emergency ground check if raycast fails
      if (translation.y < GROUND_OFFSET) {
        rigidBody.setTranslation(
          {
            x: translation.x,
            y: CHARACTER_HEIGHT / 2 + GROUND_OFFSET,
            z: translation.z,
          },
          true
        );
      }
    }
  }

  renderer.render(scene, camera);
}

function updateCharacter(delta) {
  if (!rigidBody || !character) return;

  const vel = rigidBody.linvel();
  let movement = { x: 0, z: 0 };

  // Input handling
  if (isKeyPressed("forward")) movement.z = 1;
  if (isKeyPressed("backward")) movement.z = -1;
  if (isKeyPressed("left")) movement.x = 1;
  if (isKeyPressed("right")) movement.x = -1;

  // Movement calculations
  let speed = isKeyPressed("run") ? RUN_SPEED : WALK_SPEED;
  let isMoving = movement.x !== 0 || movement.z !== 0;

  if (isMoving) {
    characterRotationTarget = Math.atan2(movement.x, movement.z);

    // Apply movement in facing direction
    const currentRotation = character.rotation.y;
    vel.x = Math.sin(currentRotation) * speed;
    vel.z = Math.cos(currentRotation) * speed;

    playAnimation(speed === RUN_SPEED ? "run" : "walk");
  } else {
    // Stop horizontal movement when no keys pressed
    vel.x = 0;
    vel.z = 0;
    playAnimation("idle");
  }

  // Update physics velocity (preserve Y for gravity)
  rigidBody.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);

  // Smooth rotation
  character.rotation.y = lerpAngle(
    character.rotation.y,
    characterRotationTarget,
    5 * delta
  );

  updateCamera(delta);
}

function updateCamera(delta) {
  if (!character) return;

  tempVec.copy(cameraOffset);
  tempVec.applyQuaternion(character.quaternion);
  tempVec.add(character.position);

  // Smooth camera movement
  camera.position.lerp(tempVec, 5 * delta);

  // Calculate look-at point
  cameraLookAt.copy(character.position);
  cameraLookAt.y += 1;
  camera.lookAt(cameraLookAt);
}

function isKeyPressed(action) {
  const keys = keysMap[action];
  return keys?.some((key) => keyboard[key]);
}

function playAnimation(name) {
  if (!actions[name]) return;

  // Stop all other actions
  Object.entries(actions).forEach(([key, action]) => {
    if (key !== name) {
      action.fadeOut(0.2);
      action.stop();
    }
  });

  // Start the new action if not already playing
  if (!actions[name].isRunning()) {
    actions[name]
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(0.2)
      .play();
  }
}

function lerpAngle(from, to, t) {
  const diff = ((to - from + Math.PI) % (2 * Math.PI)) - Math.PI;
  return from + diff * t;
}

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
