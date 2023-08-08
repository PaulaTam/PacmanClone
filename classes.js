import { c } from './index.js';

export class Boundary {
    static width = 40;
    static height = 40;

    constructor({position}) {
        this.position = position; //dynamic position
        this.width = 40;
        this.height = 40;
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y,
            this.width, this.height);
    }
}

export class Player { //Pacman
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export class Ghost { //Pacman
    static speed = 2;
    constructor({ position, velocity, color}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.speed = 2;
        this.prevCollision = [];
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export class Pellet { //pellets
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

export class SuperPellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 6;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}