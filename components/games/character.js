// modules/character.js
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import model from '../../assets/models/character.glb';
export class Character {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.loader = new THREE.GLTFLoader();
    this.mixer = null;
    this.actions = {};
    this.currentAction = null;

    this.loader.load('../../assets/models/character.glb', (gltf) => {
      this.model = gltf.scene;
      this.group.add(this.model);

      this.mixer = new THREE.AnimationMixer(this.model);
      gltf.animations.forEach((clip) => {
        this.actions[clip.name] = this.mixer.clipAction(clip);
      });

      this.playAnimation('idle');
    });
  }

  playAnimation(name) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.24);
    }
    this.currentAction = this.actions[name];
    if (this.currentAction) {
      this.currentAction.reset().fadeIn(0.24).play();
    }
  }

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
