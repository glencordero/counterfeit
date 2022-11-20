class Bill {
    constructor(){
        function randomNumberGenerator(min = 100000000, max = 999999999) {
            return Math.floor(Math.random() * (max - min) + min)
          }
        let issuers = ["Bank of Las Vegas", "Bank of Denver", "Bank of New York"]
        let phrases = ["Annuit Coeptis", "Habeus Corpus", "Pater Noster", "Hoc Est Enim Corpus", "Ay Dios Mio"]
        let currencyValues = [1, 5, 10, 20, 50, 100] 
        let generateRandomString = function(length=12){
            return Math.random().toString(20).substr(2, length)
            }
        
        this.baseRate = .012
        this.issuer =  issuers[randomNumberGenerator(0,issuers.length)]
        this.issueYear = randomNumberGenerator(1970, 2022)
        this.phrase = phrases[randomNumberGenerator(0, phrases.length)]
        this.currencyValue = currencyValues[randomNumberGenerator(0, currencyValues.length)]
        this.flourescent = randomNumberGenerator(0,2)
        this.worn = randomNumberGenerator(0,2)
        this.smudged = randomNumberGenerator(0,2)
        this.serialNumber = generateRandomString()
        this.cps = this.baseRate
    }

    summarize(){
        return `
        Issuer: ${this.issuer}<br>
        Issue Year: ${this.issueYear}<br>
        Phrase: ${this.phrase}<br>
        Currency Value: ${this.currencyValue}<br>
        Flourescent: ${this.flourescent ? "Yes" : "No"}<br>
        Worn: ${this.worn ? "Yes" : "No"}<br>
        Smudged: ${this.smudged ? "Yes" : "No"}<br>
        Serial Number: ${this.serialNumber}<br>
        `
    }
}

scannableBills = []

// for (let i = 0; i < 500; i++) {
//     scannableBills.push(new Bill())
//   }

let createBill = document.querySelector("#create")
createBill.addEventListener("click", generateBill)
let generatedBill = null
let detectCounterfeit = document.querySelector("#detect")
detectCounterfeit.addEventListener("click", scanBill )

let billDisplayDiv = document.querySelector("#bill-display")

function generateBill(event){
    generatedBill = new Bill
    billDisplayDiv.innerHTML = generatedBill.summarize()
    detectCounterfeit.classList.remove("hide")
    createBill.classList.add("hide")
}

function scanBill(event){
    detector(generatedBill)
    billDisplayDiv.innerHTML = `
    CPS Score: ${generatedBill.cps}<br>
    Counterfeit: ${generatedBill.cps > .05 ? "Yes" : "No"}
    `
}



function detector(bill){
    if(bill.issuer == "Bank of Las Vegas"){
        bill.cps = 1
        return bill.cps
    }
    if(bill.issueYear == 2022){
        bill.cps += .024 
    }
    if(bill.phrase !== "Annuit Coeptis"){
        bill.cps = 1
        return bill.cps
    }
    if(bill.currencyValue == 100){
        bill.cps *= 2
    }
    if(bill.flourescent == 1){
        bill.cps -= 0.031
    }
    if(bill.worn == 1){
        bill.cps -= 0.07
    }
    if (bill.smudged == 1){
        bill.cps += 0.047
    }
    if (bill.serialNumber.includes('w')){
        bill.cps += 0.03
    }
    if (bill.serialNumber.includes('x')){
        bill.cps += 0.025
    }
    if (bill.serialNumber.includes('w')&& bill.serialNumber.includes('x')){
        bill.cps = bill.cps - 0.03 - 0.025 + 0.72
    }
}

scannableBills.forEach(scannableBill=>{
    detector(scannableBill)
})


let counterfeits = scannableBills.filter(scannedBill => scannedBill.cps > .5)


// replace create-bill button with detect-counterfeit button
// when pressed, display whether bill is prob counterfeit/not, as well as cps score

