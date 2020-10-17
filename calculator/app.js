class CalculatorCore {

    constructor() {
        this.currentOperation = '';
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperand = 0;
        this.result = 0;
        this.corruptedWorld = false;
    }

    setCurrentOperand(number) {
        if (this.currentOperand === 0) {
            this.firstOperand = number;
        } else {
            this.secondOperand = number;
        }
    }

    getCurrentOperand() {
        if (this.currentOperand === 0) {
            return this.firstOperand;
        } else {
            return this.secondOperand;
        }
    }

    setAllClear() {
        this.currentOperation = '';
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperand = 0;
        this.result = 0;
    }

    compute() {
        console.log("compute");
        if (this.firstOperand !== 0 && this.currentOperand !== 0 && this.currentOperation.length > 0) {
            switch (this.currentOperation) {
                case "-":
                    this.result = Number((Number(this.firstOperand) - Number(this.secondOperand)).toFixed(6));
                    break;
                case "+":
                    this.result = Number((Number(this.firstOperand) + Number(this.secondOperand)).toFixed(6));
                    break;
                case "*":
                    this.result = Number((Number(this.firstOperand) * Number(this.secondOperand)).toFixed(6));
                    break;
                case "/":
                    if (this.secondOperand === "0") {
                        alert("You have angered the gods! From now world has changed.");
                        document.querySelector('body').style.background = "#000000 url(https://i.giphy.com/media/xTiTnMj5s7bNlgvZg4/giphy.webp) no-repeat center";
                        document.cookie = "corrupted=true; max-age=360000000";
                        this.corruptedWorld = true;
                        this.setAllClear();
                    } else {
                        this.result = Number((Number(this.firstOperand) / Number(this.secondOperand)).toFixed(6));
                    }
                    break;
                case "pow":
                    this.result = Number(Math.pow(this.firstOperand, this.secondOperand));
                    break;
                case "root":
                    if (this.firstOperand < 0) {
                        alert("Root from negative number. Abortion.");
                        this.setAllClear();
                    }
                    this.result = Number(Math.exp((1 / this.secondOperand) * Math.log(this.firstOperand)));
                    break;
            }
        }
    }


    joinNumToCurrentOperand(number) {
        let num = number;
        if (this.corruptedWorld) {
            num = Array.from([".", "0", "1", "1", "3", "4", "5", "6", "7", "8", "9"])[Math.floor(Math.random() * 11)];
        }

        if (num === "-" && this.getCurrentOperand().indexOf("-") >= 0) {
            return;
        }
        if (num === "." && this.getCurrentOperand().indexOf(".") >= 0) {
            return;
        }
        if (this.getCurrentOperand() === "0" && num === "0") {
            return;
        }
        this.setCurrentOperand(this.getCurrentOperand() + num);
        this.compute();
    }

    deleteFromCurrentOperand() {
        this.setCurrentOperand(this.getCurrentOperand().slice(0, this.firstOperand.toString().length - 1));
        this.compute();
    }


    exeOperation(operation) {
        let oper = operation;
        if (this.corruptedWorld) {
            oper = Array.from(["*", "/", "+", "-", "root", "pow"])[Math.floor(Math.random() * 5)];
        }
        if (this.currentOperand === 1 && (this.getCurrentOperand().length > 0)) {
            this.firstOperand = this.result.toString(10);
            this.setCurrentOperand("");
            this.currentOperation = oper;
            this.compute();
        } else {
            if (this.currentOperand === 0) {
                if ((oper === "-") && (this.getCurrentOperand().length === 0 || this.getCurrentOperand() === "-")) {
                    this.setCurrentOperand("-");
                    this.compute();
                } else {
                    this.compute();
                    this.currentOperand = 1;
                    this.currentOperation = oper;
                }
            }
        }
    }

    getResult() {
        if (this.secondOperand === '' || this.currentOperation === '') {
            this.result = this.firstOperand;
        } else {
            this.currentOperation = '';
            this.firstOperand = '';
            this.secondOperand = '';
            this.currentOperand = 0;
            this.compute();
        }
    }
}

class CalculatorGUI {
    constructor(blockClass) {
        this.blockClass = blockClass;
        this.calculatorCore = new CalculatorCore();
        this.calculatorDiv = document.querySelector('.' + blockClass);
        this.allButtons = document.querySelectorAll('button');

        console.log(this.allButtons.length);


        this.connectButtons();
        if (document.cookie.indexOf("corrupted=true") >= 0) {
            alert('We see you created new world, clean, without "mistakes"?');
            document.cookie = "";
        }
    }

    containsCheckAddEvent(selector, func) {
        document.querySelectorAll(selector).forEach((el) => (this.calculatorDiv.contains(el)) ? el.addEventListener("click", func) : null);
    }

    updateUi() {
        document.querySelector('[data-current-solution]').innerText = this.calculatorCore.firstOperand + " " + this.calculatorCore.currentOperation + " " + this.calculatorCore.secondOperand;
        document.querySelector('[data-current-result]').innerText = this.calculatorCore.result;
    }

    connectButtons() {
        this.containsCheckAddEvent('[data-operation-all-clear]', () => this.calculatorCore.setAllClear());
        this.containsCheckAddEvent('[data-operation-delete]', () => this.calculatorCore.deleteFromCurrentOperand());
        this.containsCheckAddEvent('[data-operation-sum]', () => this.calculatorCore.exeOperation("+"));
        this.containsCheckAddEvent('[data-operation-diff]', () => this.calculatorCore.exeOperation("-"));
        this.containsCheckAddEvent('[data-operation-division]', () => this.calculatorCore.exeOperation("/"));
        this.containsCheckAddEvent('[data-operation-multiply]', () => this.calculatorCore.exeOperation("*"));

        this.containsCheckAddEvent('[data-operation-root]', () => this.calculatorCore.exeOperation("root"));
        this.containsCheckAddEvent('[data-operation-pow]', () => this.calculatorCore.exeOperation("pow"));

        this.containsCheckAddEvent('[data-operation-equals]', () => this.calculatorCore.getResult());

        this.containsCheckAddEvent('[data-number-1]', () => this.calculatorCore.joinNumToCurrentOperand("1"));
        this.containsCheckAddEvent('[data-number-2]', () => this.calculatorCore.joinNumToCurrentOperand("2"));
        this.containsCheckAddEvent('[data-number-3]', () => this.calculatorCore.joinNumToCurrentOperand("3"));
        this.containsCheckAddEvent('[data-number-4]', () => this.calculatorCore.joinNumToCurrentOperand("4"));
        this.containsCheckAddEvent('[data-number-5]', () => this.calculatorCore.joinNumToCurrentOperand("5"));
        this.containsCheckAddEvent('[data-number-6]', () => this.calculatorCore.joinNumToCurrentOperand("6"));
        this.containsCheckAddEvent('[data-number-7]', () => this.calculatorCore.joinNumToCurrentOperand("7"));
        this.containsCheckAddEvent('[data-number-8]', () => this.calculatorCore.joinNumToCurrentOperand("8"));
        this.containsCheckAddEvent('[data-number-9]', () => this.calculatorCore.joinNumToCurrentOperand("9"));
        this.containsCheckAddEvent('[data-number-0]', () => this.calculatorCore.joinNumToCurrentOperand("0"));
        this.containsCheckAddEvent('[data-number-dot]', () => this.calculatorCore.joinNumToCurrentOperand("."));

        this.containsCheckAddEvent('button', () => this.updateUi());
    }

}


const calculator = new CalculatorGUI('calculator-grid');

document.querySelector(".agree-button").addEventListener("click", () => document.querySelector('.reminder').style.visibility = "hidden");