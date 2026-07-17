"use strict";

class Genetics {
    constructor() {
        this.population = [];
        this.populationSize = 6;
        this.featuresSize = 16;
        this.best;
    }

    selectParent() {
        let totalFitness = this.population.reduce((total, individual) => total + individual.fitness, 0);

        let randomThreshold = Math.random() * totalFitness;
        for (let i = 0; i < this.population.length; i++) {
            if (randomThreshold < this.population[i].fitness) {
                return this.population[i];
            }
            randomThreshold -= this.population[i].fitness;
        }
    }

    createPopulation() {
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            let genes = [];
            for (let j = 0; j < this.featuresSize; j++)
                genes.push(Math.random() < 0.5 ? 1 : 0);
        
            this.population.push(new Zombot(canvasWidth / 8, Math.random() * -20, genes));
        }
    }

    crossOver(parentA, parentB) {
        let childGenes = parentA.genes.slice();
        let x;

        if (Math.random() < 0.5)
            x = canvasWidth / 8;
        else
            x = parentA.x;

        let rand = Math.random();
        let size = parentA.genes.length;
        if (rand < 0.33) {
            for (let i = 0; i < size; i += 4) {
                childGenes[i] = parentB.genes[i];
                childGenes[i + 1] = parentB.genes[i + 1];
            }
        } else if (rand < 0.66) {
            for (let i = 0; i < size / 2; i++)
                childGenes[i] = parentB.genes[i];
        } else {
            for (let i = 0; i < size; i++)
                childGenes[i] = (i % 2) ? parentA.genes[i] : parentB.genes[i];
        }

        return new Zombot(x, Math.random() * -20, childGenes);
    }

    mutation(individual) {
        let spot = Math.floor(Math.random() * individual.genes.length);
        individual.genes[spot] = individual.genes[spot] ? 0 : 1;

        return individual;
    }

    evolution() {
        let newPopulation = [];
        for (let i = 0; i < this.populationSize; i++) {
            let parentA = this.selectParent();
            let parentB = this.selectParent();
            let child = this.crossOver(parentA, parentB);

            if (Math.random() < 0.1)
                child = this.mutation(child);
        
            newPopulation.push(child);
        }

        this.population = newPopulation;
    }

    elitism() {
        this.createPopulation();
        let randomIndex = Math.floor(Math.random() * this.population.length);
        this.population[randomIndex] = new Zombot(canvasWidth / 8, Math.random() * -20, this.best.genes);
    }
}
