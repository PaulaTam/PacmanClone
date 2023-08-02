import { Boundary, Player } from './classes.js';
import { animate } from './functions.js';

export const canvas = document.getElementById("myCanvas"); //look for canvas tag
export const c = canvas.getContext('2d'); // canvas context, using 2d

canvas.width = innerWidth; //window.innerWidth
canvas.height = innerHeight; //window.innerHeight

console.log(canvas);

//draw map
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ',  '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ',  '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', '-', ' ', '-', ' ', ' ', '-', ' ', '-',  '-'],
    ['-', '-', ' ', '-', ' ', ' ', '-', ' ', '-',  '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ',  '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ',  '-'],
    ['-', ' ', ' ', ' ', '-', '-', ' ', ' ', ' ',  '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
];

export const boundaries = [];

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
        };
    });
});

//draw player pacman
export const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },

    velocity: {
        x: 0,
        y: 0
    }
});

animate();