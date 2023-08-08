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
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);

        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, this.radians, Math.PI * 2 - this.radians);
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate;
        }

        this.radians += this.openRate;
    }
}

export class Ghost { //Ghost
    static speed = 2;
    constructor({ position, velocity, color}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.speed = 2;
        this.scared = false;
        this.prevCollision = [];
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? "blue" : this.color; //if scared, blue
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

export class SuperPellet { //power up
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