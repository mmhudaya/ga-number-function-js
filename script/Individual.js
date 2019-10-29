class Individual{

    constructor(individualParameter){

        //Attribute declartion
        this.fitness = null
        this.probability = 0
        this.genomes = []
        this.values = []
        this.variables = []
        this.parameter = individualParameter

        this.initialize(this.parameter)
    }


    initialize(individualParameter){
        this.variables.push(...individualParameter.variables)

        //Get Random Real
        // let trailZeros = individualParameter.numberOfTrailingZeros >= 0 ? individualParameter.numberOfTrailingZeros : 1;

        for(let variable of this.variables){
            this.genomes.push(CoreNumber.getRandomBinary(individualParameter.bitLength))
        }

        this.values.push(this.getX(1))
        this.values.push(this.getX(2))
    }

    replaceGenome(newGenomes){
        this.genomes = newGenomes
    }

    renewValues(){
        for (let index = 0; index < this.genomes.length; index++) {
            const genome = this.genomes[index];
            this.values[index] = CoreNumber.getNumberFromBinary(genome, this.variables[index].min, this.variables[index].max)
        }
    }


    //#region attribute
    getX(number){
        if(this.genomes.length < number){
            number = this.genomes.length - 1
        }else if(number < 1){
            number = 0
        }else{
            number = number - 1
        }
        return CoreNumber.getNumberFromBinary(this.genomes[number], this.variables[number].min, this.variables[number].max)
    }

    mate(withAnotherIndividual, mutationRate){
        let newChild = this.crossOver(withAnotherIndividual)
        newChild.mutation(mutationRate)
        newChild.renewValues()
        return newChild
    }

    crossOver(withAnotherIndividual){
        let newChild = new Individual(this.parameter)

        let newChildGenome  = []
        for(let genomeIndex = 0; genomeIndex < this.genomes.length; genomeIndex++){
            newChildGenome[genomeIndex] = []
            let midpoint = CoreNumber.getRandomNumber(0, this.parameter.bitLength - 1)
            for (let bitIndex = 0; bitIndex < this.genomes[genomeIndex].length; bitIndex++) {
                if(bitIndex > midpoint){
                    newChildGenome[genomeIndex][bitIndex] = this.genomes[genomeIndex][bitIndex]
                }else{
                    newChildGenome[genomeIndex][bitIndex] = withAnotherIndividual.genomes[genomeIndex][bitIndex]
                }
            }
        }
        newChild.replaceGenome(newChildGenome)

        return newChild
    }

    mutation(mutationRate){
        for(let genome of this.genomes){
            for (let index = 0; index < genome.length; index++) {
                let random = CoreNumber.getRandomNumber(0, 100)
                if(random <= mutationRate){
                    genome[index] = !genome[index] + 1 - 1
                }
                
            }
        }
    }
    //#endregion
}
