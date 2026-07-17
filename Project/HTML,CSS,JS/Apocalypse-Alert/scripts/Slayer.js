"use strict";

class Slayer {
    constructor(
        x = 0,
        y = 0,
        shape = [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1],
        color = 'white'
    ) {
        this.x = x;
        this.y = y;
        // this.xDirection = 1;
        this.size = 4;
        this.color = color;
        this.shape = shape;
        this.speed = 0.05;
        this.left = false;
        this.right = false;
        this.active = false;
        this.bullet = { x: this.x, y: this.y, size: 3 };
    }


    shoot() {
        if (!this.active) {
            this.bullet = { x: this.x + this.size / 2, y: this.y, size: 3 };
            this.active = true;
        }
    }

    update() {
        if (this.x > 0 && this.left)
            this.x -= this.speed * dt;

        if (this.x < canvasWidth / 4 - this.size && this.right)
            this.x += this.speed * dt;

        if (this.active) {
            this.bullet.y -= 0.1 * dt;
            if (this.bullet.y < 0) {
                this.active = false;
                this.bullet = {};
            }
        }
    }

    show() {
        context.fillStyle = this.color;

        for (let i = 0; i < this.shape.length; i++) {
            if (this.shape[i])
                context.fillRect(
                    (this.x + (i % 4)) * this.size,
                    (this.y + (i >> 2)) * this.size,
                    5,
                    7
                );
        }

        if (this.active)
            context.fillRect(
                this.bullet.x * this.size,
                this.bullet.y * this.size,
                this.bullet.size,
                this.bullet.size
            );
        
        this.update();
    }
}
