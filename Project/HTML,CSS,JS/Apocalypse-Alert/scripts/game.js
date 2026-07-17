"use strict";

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d', { alpha: false });

let canvasWidth = canvas.clientWidth;
let canvasHeight = canvas.clientHeight;

let missed, generationCount, dt, lastUpdate, slayer, zombots;

if (window.devicePixelRatio > 1) {
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
}

const createButton = (text, id) => {
    const button = document.createElement('button');
    button.innerText = text;
    button.id = id;
    return button;
};

const leftBtn = createButton('⇦', 'left-btn');
const rightBtn = createButton('⇨', 'right-btn');
const fireBtn = createButton('▭', 'fire-btn');

const findBestIndividual = () => {
    let index = 0, bestFitness = 0;

    for (let i = 0; i < zombots.population.length; i++)
        if (zombots.population[i].fitness > bestFitness) {
            bestFitness = zombots.population[i].fitness;
            index = i;
        }

    if (!zombots.best || zombots.population[index].fitness > zombots.best.fitness)
        zombots.best = zombots.population[index];
};

const gameOver = () => {
    context.fillStyle = '#1b1b1b';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = 'white';
    context.font = '20px Chiller';
    context.fillText('Generation: ' + generationCount, 10, 20);
    context.fillText('Missed: ' + missed, 10, 40);

    const txt = 'Game Over!';
    context.font = '50px Chiller';
    context.fillText(txt, (canvasWidth - context.measureText(txt).width) / 2, canvasHeight / 2);
};

const init = () => {
    missed = 0;
    generationCount = 1;
    dt = 0;
    lastUpdate = Date.now();

    context.canvas.style.border = 'solid';
    const div = document.getElementById('div');

    div.appendChild(leftBtn);
    div.appendChild(fireBtn);
    div.appendChild(rightBtn);

    zombots = new Genetics();
    zombots.createPopulation();
    slayer = new Slayer(canvasWidth / 8, canvasHeight / 4 - 4);

    const updateGame = () => {
        context.fillStyle = '#1b1b1b';
        context.fillRect(0, 0, canvasWidth, canvasHeight);

        context.fillStyle = 'white';
        context.font = '20px Chiller';
        context.fillText('Generation: ' + generationCount, 10, 20);
        context.fillText('Missed: ' + missed, 10, 40);

        for (let i = 0; i < zombots.population.length; i++)
            zombots.population[i].show();

        slayer.show();

        let allDead = true;
        for (let i = 0; i < zombots.population.length; i++)
            if (zombots.population[i].isAlive) {
                allDead = false;
                break;
            }

        if (allDead) {
            findBestIndividual();

            if (generationCount % 7 == 0)
                zombots.elitism();
            else
                zombots.evolution();

            generationCount++;
        }

        if (missed > 4) {
            gameOver();
            return;
        }

        const now = Date.now();
        dt = now - lastUpdate;
        lastUpdate = now;

        requestAnimationFrame(updateGame);
    };

    updateGame();
};

const addEvents = () => {
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'Enter':
                init();
                break;
            case ' ':
                slayer.shoot();
                break;
            case 'ArrowLeft':
            case 'a':
                slayer.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                slayer.right = true;
                break;
        }
    });

    document.addEventListener('keyup', function (e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                slayer.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                slayer.right = false;
                break;
        }
    });

    window.addEventListener('focus', function () {
        lastUpdate = Date.now();
    });

    fireBtn.addEventListener('pointerdown', function () {
        if (missed > 4) {
            init();
        } else {
            slayer.shoot();
        }
    });

    leftBtn.addEventListener('pointerdown', function () {
        slayer.left = true;
    });

    leftBtn.addEventListener('pointerup', function () {
        slayer.left = false;
    });

    rightBtn.addEventListener('pointerdown', function () {
        slayer.right = true;
    });

    rightBtn.addEventListener('pointerup', function () {
        slayer.right = false;
    });    
};

addEvents();
init();
