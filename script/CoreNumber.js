var CoreNumber = (function(){
    return {
        getRandomFloatNumber: function(min, max, trailZeros){
            //Convert to float
            if(!this.isFloat(min)){
                min = this.getFloatNumber(min, trailZeros)
            }
    
            if(!this.isFloat(max)){
                max = this.getFloatNumber(max, trailZeros)
            }
    
    
            let randomNumber = (Math.random() * (max - min) + min).toPrecision(trailZeros)

            let randomNumberDecimal = this.countDecimals(randomNumber)
            if( randomNumberDecimal < trailZeros){
                let diff = trailZeros - randomNumberDecimal
                randomNumber += '0'.repeat(diff)
            }

            return randomNumber
        },

        
        getRandomBinary(bitLength = 4){
            let arrBinary = []
            for (let index = 0; index < bitLength; index++) {
               arrBinary.push(Math.random() > 0.5 ? 1 : 0)
            }
            return arrBinary
        },

        getNumberFromBinary(binary, min, max){
            if(max == min){
                return max
            }

            let binaryValue = parseInt(binary.join(''), 2)
            return min + (((max - min) / (Math.pow(2, binary.length) - 1)) * binaryValue)
        },

        isFloat: function(n){
            return Number(n) === n && n % 1 !== 0;
        },

        getFloatNumber: function(number, trailZeros){
            return Number.parseFloat(number.toFixed(trailZeros));
        },
        
    
        getRandomNumber: function(min, max){
            return Math.floor(Math.random() * (max - min) + min)
        },

        countDecimals: function (number) {
            if(Math.floor(number.valueOf()) === number.valueOf()) return 0;
            return number.toString().split(".")[1].length || 0; 
        }
    }
}())