import * as THREE from 'three';
        import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
        import { Boid } from './Boid.js';

        let scene, camera, renderer, controls;
        const boids = [];

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color('rgb(19,19,22)');

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 300;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enabled = false;

            for (let i = 0; i < 800; i++) {
                boids.push(new Boid(scene));
            }

            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            boids.forEach(boid => boid.update(boids));
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        init();