"use strict";

class Zombot {
    constructor(
        x = 0,
        y = 0,
        genes = [0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
        color = 'white',
        speed = 0.008
    ) {
        this.x = x;
        this.y = y;
        // this.xDirection = 1;
        this.size = 4;
        this.index = 0;
        this.speed = speed;
        this.frame = 0;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.maxFrame = Math.floor(Math.random() * 32) + 16;
        this.color = color;
        this.genes = genes;
        this.isAlive = true;
        this.fitness = 0;
    }

    update() {
        if (this.y >= canvasHeight >> 2) {
            missed++;
            this.isAlive = false;
            return;
        }

        if (!this.genes[this.index]) {
            const moveValue = this.direction * this.speed * dt;

            if (this.x + moveValue > 0 && (this.x + moveValue) * this.size < canvasWidth - this.size * this.size)
                this.x += moveValue;
        }

        this.y += this.speed * dt;

        if (this.frame === this.maxFrame) {
            this.direction = -this.direction;
            this.frame = 0;
            this.maxFrame = Math.floor(Math.random() * 32) + 16;
            this.index = (this.index + 1) % this.genes.length;
        }

        this.frame++;
        this.fitness = Math.round(this.y);

        const bulletDistance = Math.sqrt((slayer.bullet.y - this.y) ** 2 + (slayer.bullet.x - (this.x + 2)) ** 2);
        if (bulletDistance < 2.5) {
            const x = slayer.bullet.x;
            const y = slayer.bullet.y;
            const area = context.getImageData(x * this.size, y * this.size, slayer.bullet.size + 1, slayer.bullet.size);

            for (let i = 0; i < area.data.length; i++) {
                if (area.data[i]) {
                    this.isAlive = false;
                    slayer.bullet = {};
                    slayer.active = false;
                    break;
                }
            }
        }
    }

    show() {
        if (this.isAlive) {
            context.fillStyle = this.color;

            for (let i = 0; i < this.genes.length; i++) {
                if (this.genes[i])
                    context.fillRect(
                        (this.x + i % 4) * this.size,
                        (this.y + (i >> 2)) * this.size,
                        8,
                        8
                    );
            }

            this.update();
        }
    }
}
