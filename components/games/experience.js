// modules/experience.js
// import * as THREE from 'three';
import { Character } from './character.js';
import { keyboardState } from './keyboardControls.js';

export class Experience {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ececec");

    this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(3, 3, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 0.65);
    light.position.set(-15, 10, 15);
    light.castShadow = true;
    this.scene.add(light);

    // Character
    this.character = new Character(this.scene);

    // Movement
    this.velocity = new THREE.Vector3();
    this.rotation = 0;
    this.speed = {
      walk: 0.8,
      run: 1.6,
    };

    // Clock
    this.clock = new THREE.Clock();

    this.animate();
    window.addEventListener('resize', () => this.onResize(container));
  }

  onResize(container) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    this.updateMovement();
    this.character.update(delta);

    this.renderer.render(this.scene, this.camera);
  }

  updateMovement() {
    let moveZ = 0;
    let moveX = 0;
    let speed = this.speed.walk;

    if (keyboardState.run) speed = this.speed.run;
    if (keyboardState.forward) moveZ = -1;
    if (keyboardState.backward) moveZ = 1;
    if (keyboardState.left) moveX = -1;
    if (keyboardState.right) moveX = 1;

    this.velocity.set(moveX, 0, moveZ).normalize().multiplyScalar(speed);

    if (this.character.group) {
      this.character.group.position.add(this.velocity.clone().multiplyScalar(0.1));
      
      if (moveX !== 0 || moveZ !== 0) {
        this.character.playAnimation(speed === this.speed.run ? 'run' : 'walk');
      } else {
        this.character.playAnimation('idle');
      }
    }
  }
}
