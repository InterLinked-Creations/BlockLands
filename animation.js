/*
    Animation Types:
    rotation: only rotates the player
    movement: rotates and moves the player

    Default Position:
    {
        torso: { x: 0, y: .5, z: 0 },
        neck: { x: 0, y: 0.4, z: 0 },
        leftArm: { x: -0.4, y: 0.4, z: 0 },
        rightArm: { x: 0.4, y: 0.4, z: 0 },
        leftLeg: { x: -0.1, y: -0.4, z: 0 },
        rightLeg: { x: 0.1, y: -0.4, z: 0 }
    },
*/
var animation = {
    player: {
        "idle": {
            "type": "rotation",
            "frame": [
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 0, y: 0, z: 0 },
                    rightArm: { x: 0, y: 0, z: 0 },
                    leftLeg: { x: 0, y: 0, z: 0 },
                    rightLeg: { x: 0, y: 0, z: 0 }
                },
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 0, y: 0, z: -0.2 },
                    rightArm: { x: 0, y: 0, z: 0.2 },
                    leftLeg: { x: 0, y: 0, z: 0 },
                    rightLeg: { x: 0, y: 0, z: 0 }
                },
            ],
            speed: 10
        },

        "walk": {
            "type": "rotation",
            "frame": [
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 0, y: 0, z: -0.5 },
                    rightArm: { x: 0, y: 0, z: 0.5 },
                    leftLeg: { x: 0, y: 0, z: 0 },
                    rightLeg: { x: 0, y: 0, z: 0 }
                },
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 1, y: 0, z: -0.5 },
                    rightArm: { x: -1, y: 0, z: 0.5 },
                    leftLeg: { x: -1, y: 0, z: 0 },
                    rightLeg: { x: 1, y: 0, z: 0 }
                },
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 0, y: 0, z: -0.5 },
                    rightArm: { x: 0, y: 0, z: 0.5 },
                    leftLeg: { x: 0, y: 0, z: 0 },
                    rightLeg: { x: 0, y: 0, z: 0 }
                },
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: -1, y: 0, z: -0.5 },
                    rightArm: { x: 1, y: 0, z: 0.5 },
                    leftLeg: { x: 1, y: 0, z: 0 },
                    rightLeg: { x: -1, y: 0, z: 0 }
                }
            ],
            speed: 1,
        },

        "fall": {
            "type": "rotation",
            "frame": [
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: -0.2, y: 0, z: -2 },
                    rightArm: { x: -0.2, y: 0, z: 2 },
                    leftLeg: { x: -0.3, y: 0, z: -0.5 },
                    rightLeg: { x: -0.3, y: 0, z: 0.5 }
                },
            ],
            speed: 1,
        },

        "jump": {
            "type": "rotation",
            "frame": [
                {
                    torso: { x: 0, y: 0, z: 0 },
                    neck: { x: -0.5, y: 0, z: 0 },
                    leftArm: { x: 0.3, y: 0, z: -0.4 },
                    rightArm: { x: 0.3, y: 0, z: 0.4 },
                    leftLeg: { x: 0.3, y: 0, z: 0 },
                    rightLeg: { x: 0.3, y: 0, z: 0 }
                },
            ],
            speed: 1,
        },

        "crouch": {
            "type": "translation",
            "rotationFrame": [
                {
                    torso: { x: 0.3, y: 0, z: 0 },
                    neck: { x: 0, y: 0, z: 0 },
                    leftArm: { x: 0, y: 0, z: -3 },
                    rightArm: { x: 0, y: 0, z: 3 },
                    leftLeg: { x: -0.3, y: 0, z: 0 },
                    rightLeg: { x: -0.3, y: 0, z: 0 }
                },
                // {
                //     torso: { x: 0, y: 0, z: 0 },
                //     neck: { x: 1, y: 0, z: 0 },
                //     leftArm: { x: 0, y: 0, z: 0 },
                //     rightArm: { x: 0, y: 0, z: 0 },
                //     leftLeg: { x: 0, y: 0, z: 0 },
                //     rightLeg: { x: 0, y: 0, z: 0 }
                // }
            ],
            "movementFrame": [
                {
                    torso: { x: 0, y: 0, z: -0.2 },
                    neck: { x: 0, y: 0.4, z: 0 },
                    leftArm: { x: -0.4, y: 0.4, z: 0 },
                    rightArm: { x: 0.4, y: 0.4, z: 0 },
                    leftLeg: { x: -0.3, y: 0.08, z: 0.2 },
                    rightLeg: { x: 0.3, y: 0.08, z: 0.2 }
                },
                // {
                //     torso: { x: 0, y: .5, z: 0 },
                //     neck: { x: 0, y: 0.4, z: 0 },
                //     leftArm: { x: -0.4, y: 0.4, z: 0 },
                //     rightArm: { x: 0.4, y: 0.4, z: 0 },
                //     leftLeg: { x: -0.1, y: -0.4, z: 0 },
                //     rightLeg: { x: 0.1, y: -0.4, z: 0 }
                // },
            ],
            speed: 1,
        }
    }
}