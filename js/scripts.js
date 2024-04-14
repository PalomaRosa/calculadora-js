const currentPreview = document.querySelector('.current-preview');
const previousView = document.querySelector('.previous-view');
const btnOperators = document.querySelectorAll('.oper');
const btnNumbers = document.querySelectorAll('.num');
const btnClearAC = document.querySelector('#clearAC');
const btnClearC = document.querySelector('#clearC');
const timeEl = document.querySelector('.hours');

let primeiroBtn = true;

class Calculadora {
    constructor(currentPreview, previousView, timeEl) {
        this.currentPreview = currentPreview;
        this.previousView = previousView;
        this.timeEl = timeEl;
        this.currentOperator = "";
    }

    addHeader(){
        function formatTime(time){
            return time.length < 2 ? '0' + time : time;
        }

        const date = new Date();
        const hours = formatTime(date.getHours().toString());
        const minutes = formatTime(date.getMinutes().toString());

        this.timeEl.textContent = `${hours}:${minutes}`;
    }

    clearDisplay(dig){
        if(dig === "C" || dig === 'AC'){
            currentPreview.innerText = 0;
            previousView.innerText = "";
            this.currentOperator = "";
            primeiroBtn = true;

        } else {
            currentPreview.innerText = "";
        }
    }

    addDigito(digito) {
        
        if (digito >= 0 || digito === "," ){
            currentPreview.textContent += digito;
        }  
        else if(digito === "+/-"){
            console.log(primeiroBtn);
            if(primeiroBtn) {
              currentPreview.textContent = "";
               currentPreview.textContent += "-";
            } else{
                currentPreview.textContent = "-" + currentPreview.textContent;
            }
        }        
        else if (digito != '=' && digito != '%'){
            this.currentOperator += digito;
            previousView.textContent += currentPreview.innerText;
            previousView.textContent += digito; 
            
            this.clearDisplay(digito);        
        } else if (digito === '%') {
            previousView.textContent += currentPreview.innerText;
            this.currentOperator += digito;
        } else {
            previousView.textContent += currentPreview.innerText;
            previousView.textContent += digito;   
            
        }
    }

    processaCalculos(numCurrent) {
        const previous = previousView.innerText;
        const operadores = /[+\-*%/]/; //expressão regular
        const previousPartes = previous.split(operadores);
        let numPrevious;

        if(previousPartes.length > 2){
            numPrevious = -parseFloat(previousPartes[1].replace(",", "."));
        } else {
            numPrevious = parseFloat(previousPartes[0].replace(",", ".")); 
        }    

        console.log(numPrevious);

        let operador = this.currentOperator;

        // Valida se exite mais de 1 operador para fazer o cálculo da porcentagem e valor negativo
        if (operador.length > 1){
            operador = operador.charAt(1);           
        } 
        
        numCurrent = parseFloat(currentPreview.innerHTML.replace(",", "."));
        let result = 0;

        
        

        const operacoes = {
            "+": (numPrevious, numCurrent) => numPrevious + numCurrent,
            "-": (numPrevious, numCurrent) => numPrevious - numCurrent,
            "*": (numPrevious, numCurrent) => numPrevious * numCurrent,
            "/": (numPrevious, numCurrent) => numPrevious / numCurrent,
            "%": (numPrevious, numCurrent) => numPrevious + (numCurrent * numPrevious) / 100
        };

        // Verifica se o operador existe no objeto operacoes
        if (operador in operacoes) {
            result = operacoes[operador](numPrevious, numCurrent); // chamo a função pela variavel composta em [] e salvo o retorno da função em result
        } else {
            console.log('Operador desconhecido:', operador);
        }

        currentPreview.innerText = result.toString().replace(".", ",");
    }


    alternarClearBtn() {

        btnClearAC.classList.toggle("hide");
        btnClearC.classList.toggle("hide");
    }

}

const calc = new Calculadora(currentPreview, previousView, timeEl);

calc.addHeader();
setInterval(() => {
    calc.addHeader();
}, 1000);

btnOperators.forEach(operator => {
    operator.addEventListener("click", () => {
        let operatorSelect = operator.innerText;
        if(primeiroBtn && operatorSelect != '+/-') return;
        else if(operatorSelect === '+/-') {
            calc.addDigito(operatorSelect);            
            calc.alternarClearBtn();
            primeiroBtn = false;
        } else{

            switch(operatorSelect){
                case "=":
                    calc.addDigito(operatorSelect);
                    calc.processaCalculos(currentPreview.innerText);
                    break
                case "%":
                    calc.addDigito(operatorSelect);
                    calc.processaCalculos(currentPreview.innerText);
                    break
                case "+/-":
                    break
                default:
                    calc.addDigito(operatorSelect);
                    break;     
            }
        }

    });
});

btnNumbers.forEach(number => {
    number.addEventListener("click", () => {
        if(primeiroBtn) {
            currentPreview.innerText = "";
            calc.addDigito(number.innerText);            
            calc.alternarClearBtn();
            primeiroBtn = false;
        } else {
            calc.addDigito(number.innerText);
        }
    });
});

btnClearC.addEventListener("click", (e) =>{    
    console.log(e.target);
    calc.alternarClearBtn();
    calc.clearDisplay(btnClearC.innerHTML);
});

btnClearAC.addEventListener("click", (e) =>{
    if(e.target.innerText === 'AC') {
        calc.clearDisplay(btnClearC.innerHTML);
    }
});