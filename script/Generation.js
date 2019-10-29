class Generation{
    constructor(gaParameter){
        this.fitnessFn = gaParameter.fitnessFn
        this.maxGeneration = gaParameter.maxGeneration

        this.selectionMethod = {
            usingRoulette: gaParameter.isUsingRouletteSelection,
            usingTournament: gaParameter.isUsingTournamentSelection,
            usingPureRandom: gaParameter.isUsingRandomSelection
        }
        this.recombinationMethod = {
            mutationRate: gaParameter.mutationRate
        }

        this.gaParameter = gaParameter

        this.isRunning = false

        this.matingPool = []
        this.MAX_GENERATION = 20000
        this.population = new Population(gaParameter.fitnessFn, gaParameter.maxIndividualInPopulation, gaParameter.isMaximization, gaParameter.individualParameter)
    }

    //Run
    
    run(){
        this.removeResult()
        this.isRunning = true
        if(this.gaParameter.isUsingDeltaF){
            let currentGeneration = 0
            console.log(this.gaParameter)
            do{     
                currentGeneration++
                setTimeout(() => {
                    document.getElementById("currentGeneration").innerHTML = "Current Generation "+(currentGeneration+1)
                    this.populate()
                    let fittestFitness = this.population.isMaximization ? this.population.getMaxFitness() : this.population.getMinFitness()
                    this.printResult(fittestFitness)
                }, 20);
            }while(!this.population.isTheBest(this.gaParameter.deltaF) && currentGeneration < this.MAX_GENERATION)

        }else{
            for (let index = 0; index < this.maxGeneration; index++) {
                setTimeout(() => {
                    document.getElementById("currentGeneration").innerHTML = "Current Generation "+(index+1)
                    this.populate()
                    let fittestFitness = this.population.isMaximization ? this.population.getMaxFitness() : this.population.getMinFitness()
                    this.printResult(fittestFitness)
                }, 20);
            }

        }
        this.isRunning = false
        // document.getElementById("executeBtn").disabled = false
    }

    populate(){
        let childrens = []
        let parents = []
        
        this.evaluatePopulation()
        parents = this.selection()
        this.printToTable()
        while(childrens.length < this.population.individuals.length){
            // this.matingPool(...parents)
            childrens.push(this.recombination(parents))
        }

        //Replace and evalute
        this.population.replace(childrens)
        this.population.evaluate()
    }

    //Evaluate
    evaluatePopulation(){
        this.population.evaluate()
    }

    //#region Selection
    selection(){
       if(this.selectionMethod.usingRoulette){
           return this.rouletteSelection()
       } else if(this.selectionMethod.usingTournament){
           return this.tournamentSelection()
       }else if(this.selectionMethod.usingPureRandom){
           return this.pureRandomSelection()
       }
    }

    rouletteSelection(){
        //Set probability roulette
        let sumOfProbability = 0
        let sumFitness = this.population.getSumFitness()
        let maxFitness = this.population.getMaxFitness()
        let parents = []
        
        let bias = 0.01 // So number with 0 probability can have a chance
        for(let individual of this.population.individuals){
            let fitness = this.population.isMaximization ? individual.fitness : (maxFitness - individual.fitness)
            individual.probability = sumOfProbability + (fitness / sumFitness) + bias
            sumOfProbability += individual.probability
        }

        let random = Math.random() * sumOfProbability
        // let random = CoreNumber.getRandomFloatNumber(0, 1, 2);

        //Roulette begin
        let tempPopulationIndividuals = Object.assign([], this.population.individuals) //deep copy
        for (let index = 0; index < 2; index++) {
            let bestIndividualIndex = 0
            for (let index = 0; index < tempPopulationIndividuals.length; index++) {
                const individual = tempPopulationIndividuals[index];
                if(individual.probability > random){
                    bestIndividualIndex = index
                    break;
                }
            }
            parents.push(tempPopulationIndividuals.splice(bestIndividualIndex, 1)[0])
        }

        return parents
    }
    
    tournamentSelection(){
        let tempPopulationIndividuals = Object.assign([], this.population.individuals) //deep copy
        let parents = []
        
        for (let index = 0; index < 2; index++) { //do it twice to get best and better individual
            let bestIndividualIndex = -1
            for(let i = 0; i < tempPopulationIndividuals.length; i++){
                let currentIndividualIndex = CoreNumber.getRandomNumber(0, tempPopulationIndividuals.length -1)
                let currentIndividual = tempPopulationIndividuals[currentIndividualIndex]
                if(bestIndividualIndex == -1){
                    bestIndividualIndex = currentIndividualIndex
                }else{
                    let fitterFitness = this.population.isMaximization ?  (currentIndividual.fitness > tempPopulationIndividuals[bestIndividualIndex].fitness) : (currentIndividual.fitness < tempPopulationIndividuals[bestIndividualIndex].fitness)
                    if(fitterFitness){
                        bestIndividualIndex = currentIndividualIndex
                    }
                }
            }
            parents.push(tempPopulationIndividuals.splice(bestIndividualIndex, 1)[0]) //Do pop for higher chance of variety
        }

        return parents
    }

    pureRandomSelection(){
        let tempPopulationIndividuals = Object.assign([], this.population.individuals) //deep copy
        let parents = []
        for (let index = 0; index < 2; index++) {

            let randomIndex = tempPopulationIndividuals[CoreNumber.getRandomNumber(0, tempPopulationIndividuals.length -1)]
            parents.push(tempPopulationIndividuals.splice(randomIndex, 1)[0]) //Do pop for higher chance of variety
        }

        return parents
    }
    //#endregion

    //#region recomebination / offspting
    recombination(parents){
        return parents[0].mate(parents[1], this.recombinationMethod.mutationRate)
    }
    //#endregion

    //#region print
    async printToTable(){
        let number = 1;
        document.getElementById('generation').innerHTML = ''
        for(let individual of this.population.individuals){
            let wrapper = document.createElement('tr')
            let numberEl = document.createElement('td')
            numberEl.innerHTML = number
            let x1ValEl = document.createElement('td')
            x1ValEl.innerHTML = individual.values[0]
            let x2ValEl = document.createElement('td')
            x2ValEl.innerHTML = individual.values[1]
            let x1BitEl = document.createElement('td')
            x1BitEl.innerHTML = individual.genomes[0]
            let x2BitEl = document.createElement('td')
            x2BitEl.innerHTML = individual.genomes[1]
            let fitnessEl = document.createElement('td')
            fitnessEl.innerHTML = individual.fitness
            wrapper.appendChild(numberEl)
            wrapper.appendChild(x1ValEl)
            wrapper.appendChild(x2ValEl)
            wrapper.appendChild(x1BitEl)
            wrapper.appendChild(x2BitEl)
            wrapper.appendChild(fitnessEl)

            
            if(this.selectionMethod.usingRoulette){
                let probabilityEl = document.createElement('td')
                probabilityEl.innerHTML = individual.probability
                wrapper.appendChild(probabilityEl)
            }

            document.getElementById('generation').appendChild(wrapper)
            number++;
        }

    }
    
    printResult(result){
        let resultEl = document.getElementById("result")
        resultEl.innerHTML = "Hasil Generasi Terbaik : <b>"+result+"</b>"
    }

    removeResult(){
        let resultEl = document.getElementById("result")
        resultEl.innerHTML = ""
    }
    //#endregion
}
