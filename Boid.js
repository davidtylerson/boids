// Boid.js
import * as THREE from 'three';

export class Boid {
    static count = 0;
    constructor(scene) {
        Boid.count++;
        this.velocity = new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2);
        this.position = new THREE.Vector3(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200);
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 3;
        this.maxForce = 0.1;
        this.geometry = new THREE.PlaneGeometry(.7, .7);

        // Check if this boid should be a different color
        if (Boid.count %5 === 0) {
            // Every 10th boid is a different color, e.g., blue
            this.material = new THREE.MeshBasicMaterial({ color: 'orangered' });
        } else {
            // Other boids are orangered
            this.material = new THREE.MeshBasicMaterial({ color: 'rgb(236,236,237)' });
        }
       //this.material = new THREE.MeshBasicMaterial({ color: 'rgb(236,236,237)' });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }

    update() {
        // Placeholder for the update logic
        this.velocity.add(this.acceleration);
        this.velocity.clampLength(0, this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);
        this.mesh.position.copy(this.position);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }
    separation(boids) {
        let perceptionRadius = 50;
        let steering = new THREE.Vector3();
        let total = 0;
        boids.forEach(other => {
            let distance = this.position.distanceTo(other.position);
            if (other !== this && distance < perceptionRadius) {
                let diff = new THREE.Vector3().subVectors(this.position, other.position).normalize().divideScalar(distance);
                steering.add(diff);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }
        return steering;
    }

    alignment(boids) {
        let perceptionRadius = 50;
        let steering = new THREE.Vector3();
        let total = 0;
        boids.forEach(other => {
            let distance = this.position.distanceTo(other.position);
            if (other !== this && distance < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 40;
        let steering = new THREE.Vector3();
        let total = 0;
        boids.forEach(other => {
            let distance = this.position.distanceTo(other.position);
            if (other !== this && distance < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.position);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }
        return steering;
    }

    edges() {
        let margin = 50; // How close to the edge boids need to be before turning back
        let turnFactor = 1; // Adjust this to control how sharply they turn back

        // Define the boundaries (half-sizes)
        let xBound = 200;
        let yBound = 200;
        let zBound = 200; // Assuming you want them to move freely up to this point

        // X-axis boundaries
        if (this.position.x > xBound) {
            this.velocity.x -= turnFactor;
        } else if (this.position.x < -xBound) {
            this.velocity.x += turnFactor;
        }

        // Y-axis boundaries
        if (this.position.y > yBound) {
            this.velocity.y -= turnFactor;
        } else if (this.position.y < -yBound) {
            this.velocity.y += turnFactor;
        }

        // Z-axis boundaries (if your boids move in 3D)
        if (this.position.z > zBound) {
            this.velocity.z -= turnFactor;
        } else if (this.position.z < -zBound) {
            this.velocity.z += turnFactor;
        }
    }

    // Update the update method to apply these forces
    update(boids) {
        this.edges();
        let separationForce = this.separation(boids);
        let alignmentForce = this.alignment(boids);
        let cohesionForce = this.cohesion(boids);

        this.applyForce(separationForce);
        this.applyForce(alignmentForce);
        this.applyForce(cohesionForce);

        // Continue with the existing update logic
        this.velocity.add(this.acceleration);
        this.velocity.clampLength(0, this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);
        this.mesh.position.copy(this.position);
    }
    // Placeholder for the behaviors (Separation, Alignment, Cohesion)
}
