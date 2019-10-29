//Run your javascript here
//This genetics algorithm only work to find something with 2 parameter heuristics functions
console.log("Starting Genetics Algorithm");

/**
 * Notes:
 *  - An individual contains 2 variables (in this case would be x1 and x2)
 *  - This program could be more dynamic as we developed it
 *  - Customize as you can but consequence awaits
 */

let fitnessFn = function(x1,x2) {
    return ( (4 - (2.1 * Math.pow(x1,2)) + ((Math.pow(x1,4)) / 3) ) * (Math.pow(x1,2)) + (x1 * x2) + ((-4 + (4 * Math.pow(x2, 2)) ) * (Math.pow(x2,2))) )
}
let currentFunction = fitnessFn.toString()
document.getElementById("currentFn").innerHTML = currentFunction

// [1, 1, 1, 0]
// [1, 0, 1, 0]
// 0.84901691815272

console.log(fitnessFn(-1.4, -1.7333333333333334))

let minx1 = -3
let maxx1 = 3
let minx2 = -2
let maxx2 = 2
let bitLength = 100;

let deltaF = -0.9

let individualParameter = {
    variables: [
        {
            min: minx1,
            max: maxx1,
        },
        {
            min: minx2,
            max: maxx2,
        }
    ],
    bitLength: bitLength
}

//Generate Form variables
let formVariableComponent = document.createElement('div');
for (let index = 0; index < individualParameter.variables.length; index++) {
    const element = individualParameter.variables[index];
    let labelMin = document.createElement('label')
    labelMin.textContent = "Min X"+(index+1)
    let inputlMin = document.createElement('input')
    inputlMin.id = "minx"+(index+1)
    inputlMin.value = element.min
    let labelMax = document.createElement('label')
    labelMax.textContent = "Max X"+(index+1)
    let inputlMax = document.createElement('input')
    inputlMax.id = "maxx"+(index+1)
    inputlMax.value = element.max
    
    formVariableComponent.appendChild(labelMin)
    formVariableComponent.appendChild(document.createElement('br'))
    formVariableComponent.appendChild(inputlMin)
    formVariableComponent.appendChild(document.createElement('br'))
    formVariableComponent.appendChild(labelMax)
    formVariableComponent.appendChild(document.createElement('br'))
    formVariableComponent.appendChild(inputlMax)
    formVariableComponent.appendChild(document.createElement('br'))
}
document.getElementById("formVariable").appendChild(formVariableComponent)


function execute(){
    console.log("test")
    //Initiate custom variables
    let mutationRate = 5; //1 - 100%
    let maxGeneration = 84; // number of generation
    let maxIndividualInPopulation = 50

    individualParameter.bitLength = document.getElementById("bitLength").value

    for (let index = 0; index < individualParameter.variables.length; index++) {
        const max = document.getElementById("maxx"+(index+1)).value
        const min = document.getElementById("minx"+(index+1)).value
        individualParameter.variables[index].min = Number.parseInt(min)
        individualParameter.variables[index].max = Number.parseInt(max)
    }

    //Put it into 1 object to simplified parameter  
    let gaParameter = {
        maxIndividualInPopulation:Number.parseInt(document.getElementById("maxIndividualInPopulation").value),
        fitnessFn: fitnessFn,
        individualParameter: individualParameter,

        //Selection
        isMaximization: document.getElementById("isMax").checked,
        isUsingRouletteSelection: document.getElementById("roulette").checked,
        isUsingTournamentSelection: document.getElementById("tournament").checked,
        isUsingRandomSelection: document.getElementById("random").checked,
        
        //Combination
        mutationRate: Number.parseInt(document.getElementById("mutationRate").value),
        
        //Finish State
        maxGeneration: Number.parseInt(document.getElementById("maxGeneration").value),
        // isUsingDeltaF: true,
        // deltaF: -0.9
    }

    console.log(gaParameter)

    let generation = new Generation(gaParameter)
    generation.run()
    document.getElementById("executeBtn").disabled = generation.isRunning


    //End
    generation.evaluatePopulation()
    console.log(generation.population)

}
