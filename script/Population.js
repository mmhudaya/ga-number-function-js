class Population{
    constructor(fitnessFn, maxIndividualInPopulation, isMaximization, individualParameter){
        this.fitnessFn = fitnessFn;
        this.isMaximization = isMaximization;
        this.individuals = [];
        this.initialize(maxIndividualInPopulation, individualParameter)
    }

    initialize(maxIndividualInPopulation, individualParameter){
        for (let index = 0; index < maxIndividualInPopulation; index++) {
            let newIndividual = new Individual(individualParameter)
            this.individuals.push(newIndividual)
        }
    }

    evaluate(){
        for(let individual of this.individuals){
            individual.fitness = this.fitnessFn(individual.getX(1), individual.getX(2))
        }
    }

    getArrayOfFitness(){
        let arrayOfFitness = [];
        this.individuals.forEach(individual => {
            arrayOfFitness.push(individual.fitness)
        });

        return arrayOfFitness;
    }

    getMaxFitness(){
        return Math.max(...this.getArrayOfFitness())
    }

    getMinFitness(){
        return Math.min(...this.getArrayOfFitness())
    }

    getSumFitness(){
        if(this.isMaximization){
            return this.getArrayOfFitness().reduce((a,b) => a + b )
        }else{
            let maxFitness = this.getMaxFitness()
            let sumFitness = 0;
            for(let fitness of this.getArrayOfFitness()){
                sumFitness += maxFitness - fitness
            }
            return sumFitness
        }
    }

    isTheBest(deltaF){
        if(this.isMaximization){
            return this.getMaxFitness() >= deltaF
        }else{
            return this.getMinFitness() <= deltaF
        }
    }

    getIndividual(index = 0){
        if(index < 0){
            index = 0
        }else if(index > this.individuals.length - 1){
            index = this.individuals.length - 1
        }
        return this.individuals[index]
    }

    getRandomIndividual(){
        return this.individuals[CoreNumber.getRandomNumber(0, this.individuals.length - 1)]
    }

    getRandomIndividualIndex(){
        return CoreNumber.getRandomNumber(0, this.individuals.length - 1)
    }

    popIndividual(index){
        return this.individuals.splice(index, 1)
    }


    replace(newIndividuals){
        this.individuals = []
        this.individuals = newIndividuals
    }
}
