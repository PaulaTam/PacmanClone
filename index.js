import { Boundary, Player, Pellet, SuperPellet, Ghost } from './classes.js';
import { animate } from './functions.js';

export const canvas = document.getElementById("myCanvas"); //look for canvas tag
export const c = canvas.getContext('2d'); // canvas context, using 2d

export const curScore = document.getElementById("curScore"); //get score

canvas.width = innerWidth; //window.innerWidth
canvas.height = innerHeight; //window.innerHeight

console.log(canvas);

//draw map
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '*', '.', '.', '-', '-', '-', '.', '.', '*', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', ' ', '-', '.', '.', '.', '-'],
    ['-', '-', '.', '-', ' ', ' ', ' ', '-', '.', '-', '-'],
    ['-', '-', '.', '-', ' ', '-', ' ', '-', '.', '-', '-'],
    ['-', '-', '.', '-', ' ', ' ', ' ', '-', '.', '-', '-'],
    ['-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '*', '.', '.', '-', '-', '-', '.', '.', '*', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
];

export const boundaries = [];
export const pellets = [];
export const ghosts = [
    new Ghost( {
        position: {
            x: Boundary.width/2 + Boundary.width * 4,
            y: Boundary.height/2 + Boundary.height * 6
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: "red"   
    }),
    new Ghost( {
        position: {
            x: Boundary.width/2 + Boundary.width * 4,
            y: Boundary.height/2 + Boundary.height * 8
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: "orange"   
    }),
    new Ghost( {
        position: {
            x: Boundary.width/2 + Boundary.width * 6,
            y: Boundary.height/2 + Boundary.height * 8
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        color: "lightblue"   
    }),
    new Ghost( {
        position: {
            x: Boundary.width/2 + Boundary.width * 6,
            y: Boundary.height/2 + Boundary.height * 6
        },
        velocity: {
            x: 0,
            y: Ghost.speed
        },
        color: "pink"   
    }) ];

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
                    })
                )
                break;
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width/2 + Boundary.width * j,
                            y: Boundary.height/2 + Boundary.height * i
                        }
                    })
                )
                break;
            case '*':
                pellets.push(
                    new SuperPellet({
                        position: {
                            x: Boundary.width/2 + Boundary.width * j,
                            y: Boundary.height/2 + Boundary.height * i
                        }
                    })
                )
            break;
        };
    });
});

//draw player pacman
export const player = new Player({
    position: {
        x: Boundary.width/2 + Boundary.width * 5,
        y: Boundary.height/2 + Boundary.height * 10
    },

    velocity: {
        x: 0,
        y: 0
    }
});

animate();