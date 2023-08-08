import { boundaries, player, ghosts, pellets, canvas, c, curScore } from './index.js';
import { Boundary } from "./classes.js";

const keys = {
    up: {
        pressed: false
    },
    left: {
        pressed: false
    },
    down: {
        pressed: false
    },
    right: {
        pressed: false
    }
};

let lastKey = '';
let score = 0;

//event listeners
addEventListener('keydown', ({ key }) => { //when pressing a key
    switch (key) { //use wasd for movement
        case 'w':
            keys.up.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.left.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.down.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.right.pressed = true;
            lastKey = 'd';
            break;
    };
});

addEventListener('keyup', ({ key }) => { //when letting go a key, keeps going in the same direction
    switch (key) {
        case 'w':
            keys.up.pressed;
            break;
        case 'a':
            keys.left.pressed;
            break;
        case 's':
            keys.down.pressed;
            break;
        case 'd':
            keys.right.pressed;
            break;
    };
});

function collisionBoundary({ circle, rectangle }) {
    const padding = Boundary.width/2 - circle.radius - 1;

    return (
        //up collision
        circle.position.y - circle.radius + circle.velocity.y <= //top of circle
            rectangle.position.y + rectangle.height + padding && //bottom of rectangle
        //down collision
        circle.position.y + circle.radius + circle.velocity.y >= //bottom of circle
            rectangle.position.y - padding && //top of rectangle
        //right collision
        circle.position.x + circle.radius + circle.velocity.x >= //right of circle
            rectangle.position.x - padding && //left of rectangle
        //left collision
        circle.position.x - circle.radius + circle.velocity.x <= //left of circle
            rectangle.position.x + rectangle.width + padding //right of rectangle
    );
}

//so player will only go through openings
function collisionForLoopX({ x, y }) { //for left and right collisions
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (collisionBoundary ({
            circle: {...player, 
                    velocity: {
                        x: x,
                        y: y
                    }}, 
            //... is the spread operator, everything in player will be put here
            rectangle: boundary
        })) {
            player.velocity.x = 0;
            break;
        } else {
            player.velocity.x = x;
        }
    }
}

function collisionForLoopY({ x, y }) { //for up and down collisions
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];

        if (collisionBoundary ({
            circle: {...player, 
                    velocity: {
                        x: x,
                        y: y
                    }}, 
            //... is the spread operator, everything in player will be put here
            rectangle: boundary
        })) {
            player.velocity.y = 0;
            break;
        } else {
            player.velocity.y = y;
        }
    }
}

function collisionCircle ({ circle, player }) {
    return Math.hypot(
        circle.position.x - player.position.x,
        circle.position.y - player.position.y
    ) < circle.radius + player.radius;
}

function collisionGhostWall ({ array, dir, ghost, x, y, boundary }) {
    return (!array.includes(dir) &&
    collisionBoundary ({
    circle: {...ghost,
            velocity: {
                x: x,
                y: y
            }},
    rectangle: boundary
    }))
}

let frameId;

export function animate() {
    frameId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        pellet.draw();

        //pellet collision
        if (
            collisionCircle({
                circle: pellet,
                player: player
            })
        ) {
            pellets.splice(i, 1); //remove pellets from array with splice
            
            if (pellet.constructor.name === "Pellet") { //if class of object is Pellet
                score += 10;
            } else if (pellet.constructor.name === "SuperPellet") { // if class of object is SuperPellet
                score += 15;
                
                ghosts.forEach((ghost) => {
                    ghost.scared = true;

                    setTimeout(() => {
                        ghost.scared = false;
                    }, 5000)
                })
            }
            
            curScore.innerHTML = score; //to update score after eating pellet
        }
    }

    if (pellets.length === 0) {
        cancelAnimationFrame(frameId);
        console.log("You Win!");
    }

    boundaries.forEach((boundary) => { //boundaries for the game
        boundary.draw();
        
        //boundary collision
        if (collisionBoundary ({
            circle: player,
            rectangle: boundary })) {
            player.velocity.y = 0;
            player.velocity.x = 0;
        }
    });

    player.update();

    ghosts.forEach((ghost) => {
        ghost.update();

        if (collisionCircle({
            circle: ghost,
            player: player
        }) && !ghost.scared) {
            cancelAnimationFrame(frameId);
            console.log("You Lose...");
        } else if (collisionCircle({
            circle: ghost,
            player: player
        }) && ghost.scared) {
            ghost.position.x = Boundary.width/2 + Boundary.width * 5;
            ghost.position.y = Boundary.height/2 + Boundary.width * 5;
            ghost.scared = false;
            
            score += 30;
            curScore.innerHTML = score; //to update score when killing ghosts
        }

        const collisions = [];
        boundaries.forEach((boundary) => {
            //boundary collision w/ ghost
            if (collisionGhostWall({
                array: collisions,
                dir: "right",
                ghost: ghost,
                x: ghost.speed,
                y: 0,
                boundary: boundary
            })) {
                collisions.push("right");
            }

            if (collisionGhostWall({
                array: collisions,
                dir: "left",
                ghost: ghost,
                x: -ghost.speed,
                y: 0,
                boundary: boundary
            })) {
                collisions.push("left");
            }

            if (collisionGhostWall({
                array: collisions,
                dir: "down",
                ghost: ghost,
                x: 0,
                y: ghost.speed,
                boundary: boundary
            })) {
                collisions.push("down");
            }

            if (collisionGhostWall({
                array: collisions,
                dir: "up",
                ghost: ghost,
                x: 0,
                y: -ghost.speed,
                boundary: boundary
            })) {
                collisions.push("up");
            }
        })

        if (collisions.length > ghost.prevCollision.length) {
            ghost.prevCollision = collisions;
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)) {
            if (ghost.velocity.x > 0) {
                ghost.prevCollision.push("right");
            } else if (ghost.velocity.x < 0) {
                ghost.prevCollision.push("left");
            } else if (ghost.velocity.y > 0) {
                ghost.prevCollision.push("down");
            } else if (ghost.velocity.y < 0) {
                ghost.prevCollision.push("up");
            }

            const pathways = ghost.prevCollision.filter((collision) => {
                return !collisions.includes(collision);
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)];

            switch (direction) {
                case "right":
                    ghost.velocity.x = ghost.speed;
                    ghost.velocity.y = 0;
                    break;
                case "left":
                    ghost.velocity.x = -ghost.speed;
                    ghost.velocity.y = 0;
                    break;
                case "down":
                    ghost.velocity.x = 0;
                    ghost.velocity.y = ghost.speed;
                    break;
                case "up":
                    ghost.velocity.x = 0;
                    ghost.velocity.y = -ghost.speed;
                    break;
            }

            ghost.prevCollision = [];
        }
    })

    if (keys.up.pressed && lastKey === 'w') {
        collisionForLoopY({
            x: 0,
            y: -5
        })
    } else if (keys.left.pressed && lastKey === 'a') {
        collisionForLoopX({
            x: -5,
            y: 0,
        })
    } else if (keys.down.pressed && lastKey === 's') {
        collisionForLoopY({
            x: 0,
            y: 5
        })
    } else if (keys.right.pressed && lastKey === 'd') {
        collisionForLoopX({
            x: 5,
            y: 0
        })
    }

    if (player.velocity.x > 0) {
        player.rotation = 0;
    } else if (player.velocity.x < 0) {
        player.rotation = Math.PI;
    } else if (player.velocity.y > 0) {
        player.rotation = Math.PI/2;
    } else if (player.velocity.y < 0) {
        player.rotation = Math.PI * 1.5;
    }

}