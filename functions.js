import { boundaries, player, canvas, c } from './index.js';

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
    return (
        //up collision
        circle.position.y - circle.radius + circle.velocity.y <= //top of circle
            rectangle.position.y + rectangle.height && //bottom of rectangle
        //down collision
        circle.position.y + circle.radius + circle.velocity.y >= //bottom of circle
            rectangle.position.y && //top of rectangle
        //right collision
        circle.position.x + circle.radius + circle.velocity.x >= //right of circle
            rectangle.position.x && //left of rectangle
        //left collision
        circle.position.x - circle.radius + circle.velocity.x <= //left of circle
            rectangle.position.x + rectangle.width //right of rectangle
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

    boundaries.forEach((boundary) => { //boundaries for the game
        boundary.draw();
        
        if (collisionBoundary ({ circle: player, rectangle: boundary })) {
            player.velocity.y = 0;
            player.velocity.x = 0;
        }
    });

    player.update();

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
}