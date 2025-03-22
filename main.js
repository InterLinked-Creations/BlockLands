const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const cameraOffset = new THREE.Vector3(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x87ceeb);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gravity = new THREE.Vector3(0, -35, 0); // Example gravity vector
const velocity = new THREE.Vector3(0, 5, 0);

const clock = new THREE.Clock();

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5); // Sky color, ground color, intensity
scene.add(hemiLight);

const light_1 = new THREE.DirectionalLight(0xffffff, 1);
light_1.castShadow = true;

light_1.shadow.mapSize.width = 2048; // Increase for better quality
light_1.shadow.mapSize.height = 2048;
light_1.position.set(10, 5, 0);
light_1.rotation.z = 2;
scene.add(light_1);


let player;
let playerBox;

let keyState = {};
let isGrounded = false;

const World = {
    players: [],
    obstacles: [],

    addPlayer: function (color, x, y, z, rotation) {
        let player = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 1.3, 1.3),
            new THREE.MeshStandardMaterial({ 
                color: color,
                transparent: true,
                opacity: 0,
                depthWrite: false
            })
        );
        player.position.set(x, y, z);
        player.rotation.y = rotation;
        // player.castShadow = true;
        // player.receiveShadow = true;

        // Assemble the player's body.
        let torso = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.8, 0.5),
            new THREE.MeshStandardMaterial({ color: color })
        )
        torso.position.set(0, .5, 0);
        torso.castShadow = true;
        torso.receiveShadow = true;
        player.add(torso);

        let neck = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0xffd875 })
        )
        neck.position.set(0, 0.4, 0);
        neck.castShadow = true;
        neck.receiveShadow = true;
        torso.add(neck);

        let head = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ color: 0xffd875 })
        )
        head.position.set(0, 0.5, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        neck.add(head);

        let leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        )
        leftArm.position.set(-0.4, 0.4, 0);
        torso.add(leftArm);

        let rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        )
        rightArm.position.set(0.4, 0.4, 0);
        torso.add(rightArm);

        let leftLeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        )
        leftLeg.position.set(-0.1, -0.4, 0);
        torso.add(leftLeg);

        let rightLeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        )
        rightLeg.position.set(0.1, -0.4, 0);
        torso.add(rightLeg);



        player.BlockBody = {
            torso: torso,
            neck: neck,
            head: head,
            leftArm: leftArm,
            rightArm: rightArm,
            leftLeg: leftLeg,
            rightLeg: rightLeg
        }



        let rightSleve = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.7, 0.2),
            new THREE.MeshStandardMaterial({ color: color })
        )
        rightSleve.position.set(0, -0.3, 0);
        rightSleve.castShadow = true;
        rightSleve.receiveShadow = true;
        rightArm.add(rightSleve);

        let leftSleve = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.7, 0.2),
            new THREE.MeshStandardMaterial({ color: color })
        )
        leftSleve.position.set(0, -0.3, 0);
        leftSleve.castShadow = true;
        leftSleve.receiveShadow = true;
        leftArm.add(leftSleve);

        let rightBoot = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.7, 0.3),
            new THREE.MeshStandardMaterial({ color: color })
        )
        rightBoot.position.set(0, -0.3, 0);
        rightBoot.castShadow = true;
        rightBoot.receiveShadow = true;
        rightLeg.add(rightBoot);

        let leftBoot = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.7, 0.3),
            new THREE.MeshStandardMaterial({ color: color })
        )
        leftBoot.position.set(0, -0.3, 0);
        leftBoot.castShadow = true;
        leftBoot.receiveShadow = true;
        leftLeg.add(leftBoot);


        player.animation = {};
        player.animation.current = "walk";
        player.animation.currentFrame = 0;
        player.animation.frameDuration = 0;

        this.players.push(player);
        scene.add(player);
    },

    addObstacle: function (color, x, y, z, width, height, depth, rotation) {
        let obstacle = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({ color: color })
        );
        obstacle.position.set(x, y, z);
        obstacle.rotation.y = rotation;
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;

        this.obstacles.push(obstacle);
        scene.add(obstacle);
    }
}

function applyGravity(deltaTime) {
    if (!isGrounded) {
        velocity.add(gravity.clone().multiplyScalar(deltaTime));
    }
    player.position.add(velocity.clone().multiplyScalar(deltaTime));
    updateBoundingBox();
}

function calculateCameraRelativeMovement() {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, camera.up).normalize();

    // light_1.position.copy(camera.position);

    const cameraViewSize = 20; // Customize to match your scene's scale
    light_1.shadow.camera.left = -cameraViewSize;
    light_1.shadow.camera.right = cameraViewSize;
    light_1.shadow.camera.top = cameraViewSize;
    light_1.shadow.camera.bottom = -cameraViewSize;
    light_1.shadow.camera.near = 1; // Adjust based on your scene
    light_1.shadow.camera.far = 200; // Extend further for larger scenes
    light_1.shadow.camera.updateProjectionMatrix();
  

    const movement = new THREE.Vector3();

    if (keyState['w'] || keyState['ArrowUp']) movement.add(forward);
    if (keyState['s'] || keyState['ArrowDown']) movement.sub(forward);
    if (keyState['a'] || keyState['ArrowLeft']) movement.sub(right);
    if (keyState['d'] || keyState['ArrowRight']) movement.add(right);

    return movement.normalize();
}

function startGame() {
    // Player
    World.addPlayer(0x00ff00, 0, 10, -15, 0);
    player = World.players[0];
    playerBox = new THREE.Box3().setFromObject(player);

    // Ground
    World.addObstacle(0x808080, 0, -1, 0, 20, 1, 20, 0);
    World.addObstacle(0x808080, 0, 2, -15, 10, 1, 10, 0);

    // Obstacle
    World.addObstacle(0xff0000, 5, 0, 0, 2, 2, 2, 0);
    World.addObstacle(0xff0000, -5, 0, 0, 2, 2, 2, 0);

    World.addObstacle(0xff0000, 0, 0, 5, 2, 2, 2, 0);

    animate();
    velocity.y = 10
}

const speed = 0.1;
const rotationSpeed = 0.5;

function updateBoundingBox() {
    playerBox.setFromObject(player);
}

function checkCollisions(lastPosition) {   
    let onGround = false;
    for (const obstacle of World.obstacles) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        if (playerBox.intersectsBox(obstacleBox)) {
            const overlapX = Math.min(playerBox.max.x, obstacleBox.max.x) - Math.max(playerBox.min.x, obstacleBox.min.x);
            const overlapY = Math.min(playerBox.max.y, obstacleBox.max.y) - Math.max(playerBox.min.y, obstacleBox.min.y);
            const overlapZ = Math.min(playerBox.max.z, obstacleBox.max.z) - Math.max(playerBox.min.z, obstacleBox.min.z);

            if (overlapX < overlapY && overlapX < overlapZ) {
                player.position.x += (player.position.x > obstacle.position.x) ? overlapX : -overlapX;
            } else if (overlapY < overlapX && overlapY < overlapZ) {
                if(lastPosition.y > obstacle.position.y){
                    player.position.y += overlapY;
                    onGround = true;
                    velocity.y = 0;
                }
                else{
                    player.position.y += -overlapY-0.05
                }
                velocity.y = 0;
                
            } else {
                player.position.z += (player.position.z > obstacle.position.z) ? overlapZ : -overlapZ;
            }

            updateBoundingBox();
        }
    }
    isGrounded = onGround;
}

function setAnimation(animationName) {
    if (player.animation.current != animationName) {
        console.log(animationName);

        player.animation.current = animationName;
        player.animation.currentFrame = 0;
        player.animation.frameDuration = 0;
    }
}

function applyFrameRotation(part, rotationData) {
    part.rotation.set(rotationData.x, rotationData.y, rotationData.z);
}
function applyFrameTranslation(part, translationData) {
    part.position.set(translationData.x, translationData.y, translationData.z);
}

function animate() {
    const delta = clock.getDelta();

    // Controls
    const movement = calculateCameraRelativeMovement();
    if (keyState[' '] && isGrounded) {
        velocity.y = 17;
        isGrounded = false;
    }

    // Apply gravity if player is not on the ground
    if(!isGrounded) applyGravity(delta);

    // Save the player's current position before movement
    let lastPosition = player.position.clone();

    // Set animation based on key states and player state
    if (keyState['Shift'] && isGrounded) {
        setAnimation("crouch");
    }
    else if (!isGrounded) {
        if (velocity.y > 0) {
            setAnimation("jump");
        }   
        else {
            setAnimation("fall");
        }
    }
    else if (movement.length() > 0) {
        setAnimation("walk");
    }
    else{
        setAnimation("idle");
    }

    // Move the player
    if( movement.length() > 0){
        // Rotate the player towards the movement direction
        const targetAngle = Math.atan2(movement.x, movement.z);
        const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetAngle);
        player.quaternion.slerp(targetQuaternion, rotationSpeed);
        
        // Move the player in the direction of the movement vector
        player.position.addScaledVector(movement, speed);
        updateBoundingBox();
    }

    // Check for collisions
    checkCollisions(lastPosition);

    // Update player animation
    const action = player.animation.current;
    const frame = player.animation.currentFrame;

    if (animation.player[action].type == "rotation") {

        applyFrameRotation(player.BlockBody.torso, animation.player[action].frame[frame].torso);
        applyFrameRotation(player.BlockBody.neck, animation.player[action].frame[frame].neck);
        applyFrameRotation(player.BlockBody.leftArm, animation.player[action].frame[frame].leftArm);
        applyFrameRotation(player.BlockBody.rightArm, animation.player[action].frame[frame].rightArm);
        applyFrameRotation(player.BlockBody.leftLeg, animation.player[action].frame[frame].leftLeg);
        applyFrameRotation(player.BlockBody.rightLeg, animation.player[action].frame[frame].rightLeg);

        if(player.animation.frameDuration >= animation.player[action].speed / 10){
            player.animation.currentFrame = (player.animation.currentFrame + 1) % animation.player[action].frame.length;
            player.animation.frameDuration = 0;
        }

        //Restart the body position
        applyFrameTranslation(player.BlockBody.torso, { x: 0, y: .5, z: 0 });
        applyFrameTranslation(player.BlockBody.neck, { x: 0, y: 0.4, z: 0 });
        applyFrameTranslation(player.BlockBody.leftArm, { x: -0.4, y: 0.4, z: 0 });
        applyFrameTranslation(player.BlockBody.rightArm, { x: 0.4, y: 0.4, z: 0 });
        applyFrameTranslation(player.BlockBody.leftLeg, { x: -0.1, y: -0.4, z: 0 });
        applyFrameTranslation(player.BlockBody.rightLeg, { x: 0.1, y: -0.4, z: 0 });

        /*
        torso.position.set(0, .5, 0);
        neck.position.set(0, 0.4, 0);
        leftArm.position.set(-0.4, 0.4, 0);
        rightArm.position.set(0.4, 0.4, 0);
        leftLeg.position.set(-0.1, -0.4, 0);
        rightLeg.position.set(0.1, -0.4, 0);
        */
    }

    else if (animation.player[action].type == "translation") {
        console.log("movement!");
        applyFrameRotation(player.BlockBody.torso, animation.player[action].rotationFrame[frame].torso);
        applyFrameRotation(player.BlockBody.neck, animation.player[action].rotationFrame[frame].neck);
        applyFrameRotation(player.BlockBody.leftArm, animation.player[action].rotationFrame[frame].leftArm);
        applyFrameRotation(player.BlockBody.rightArm, animation.player[action].rotationFrame[frame].rightArm);
        applyFrameRotation(player.BlockBody.leftLeg, animation.player[action].rotationFrame[frame].leftLeg);
        applyFrameRotation(player.BlockBody.rightLeg, animation.player[action].rotationFrame[frame].rightLeg);

        applyFrameTranslation(player.BlockBody.torso, animation.player[action].movementFrame[frame].torso);
        applyFrameTranslation(player.BlockBody.neck, animation.player[action].movementFrame[frame].neck);
        applyFrameTranslation(player.BlockBody.leftArm, animation.player[action].movementFrame[frame].leftArm);
        applyFrameTranslation(player.BlockBody.rightArm, animation.player[action].movementFrame[frame].rightArm);
        applyFrameTranslation(player.BlockBody.leftLeg, animation.player[action].movementFrame[frame].leftLeg);
        applyFrameTranslation(player.BlockBody.rightLeg, animation.player[action].movementFrame[frame].rightLeg);

        if(player.animation.frameDuration >= animation.player[action].speed / 10){
            player.animation.currentFrame = (player.animation.currentFrame + 1) % animation.player[action].rotationFrame.length;
            player.animation.frameDuration = 0;
        }
    }

    player.animation.frameDuration += delta;


    // Move Camera
    const targetPosition = player.position.clone().add(cameraOffset);
    camera.position.lerp(targetPosition, 1);
    camera.lookAt(player.position);

    // Update the scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


document.addEventListener('keydown', (event) => {
    keyState[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

startGame();