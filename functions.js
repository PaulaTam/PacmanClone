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

/*const arrow = {
    up: 38,
    left: 37,
    down: 40,
    right: 39
}*/

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

export function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        pellet.draw();

        //pellet collision
        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) < pellet.radius + player.radius
        ) {
            pellets.splice(i, 1); //remove pellets from array with splice
            
            if (pellet.constructor.name === "Pellet") { //if class of object is Pellet
                score += 10;
            } else if (pellet.constructor.name === "SuperPellet") { // if class of object is SuperPellet
                score += 15;
                console.log("super");
            }
            
            curScore.innerHTML = score;
        }
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

        const collisions = [];
        boundaries.forEach((boundary) => {
            //boundary collision w/ ghost
            if (!collisions.includes("right") &&
                collisionBoundary ({
                circle: {...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }},
                rectangle: boundary
            })) {
                collisions.push("right");
            }

            if (!collisions.includes("left") &&
                collisionBoundary ({
                circle: {...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }},
                rectangle: boundary
            })) {
                collisions.push("left");
            }

            if (!collisions.includes("down") &&
                collisionBoundary ({
                circle: {...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }},
                rectangle: boundary
            })) {
                collisions.push("down");
            }

            if (!collisions.includes("up") &&
                collisionBoundary ({
                circle: {...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }},
                rectangle: boundary
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
            y: -ghost.speed
        })
    } else if (keys.left.pressed && lastKey === 'a') {
        collisionForLoopX({
            x: -ghost.speed,
            y: 0,
        })
    } else if (keys.down.pressed && lastKey === 's') {
        collisionForLoopY({
            x: 0,
            y: ghost.speed
        })
    } else if (keys.right.pressed && lastKey === 'd') {
        collisionForLoopX({
            x: ghost.speed,
            y: 0
        })
    }
}