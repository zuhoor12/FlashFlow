// Modal.js
export class Modal{
    constructor(){
        this.overlay = document.getElementById("overlay");
        this.promptBox = document.getElementById("promptBox");
        this.addvocabulary = document.getElementById("addvocabulary")
        this.inputText = document.getElementById("word")
        this.inputTextArea = document.getElementById("meaning")
        this.textAreaerrobox = document.getElementById("textAreaerrobox")
        this.wordError = document.getElementById("wordError")
        this.card = document.getElementById("innerCard");
        this.flipped = false;
        this.cartBox = document.getElementById("cartBox")
        this.frontCard = document.getElementById("frontCard")
        this.backCard = document.getElementById("backCard")
        // this.cartBox = document.getElementById("cartBox")
        this.progressBar = document.getElementById("progressBar")
        this.percentage = document.getElementById("percentage")
        this.firstNum = document.getElementById("firstNum")
        this.secondNum = document.getElementById("secondNum")
        this.cartBox.addEventListener("click",()=>{this.cartAnimation()})
    }   
    open(){
        this.overlay.classList.remove("hidden");
        this.promptBox.classList.remove("hidden");
    }
    close(){
        this.overlay.classList.add("hidden")
        this.promptBox.classList.add("hidden")
    }
    SubmitOf(event){
        event.preventDefault();
    }
    ClearInput(){
        this.inputText.value = ""
        this.inputTextArea.value = ""
    }

    clearError(){
        this.wordError.innerText = ""
        this.textAreaerrobox.innerText = ""
    }
    activeBox(selectBox ,parentElements){
        // parentElements.classList.add("boxAnimation")
        parentElements.forEach(element => {
            element.classList.remove("active")
            let icon = element.firstElementChild.firstElementChild;
            if(icon.id == "dailyIcon"){
                icon.src = "/DailyGray.svg"
            }
            else if(icon.id == "mediumIcon"){
                icon.src = "/StarGray.svg"
            } 
            else if(icon.id == "masterIcon"){
                icon.src = "/rewardedIconGray.svg"
            }
        });

        let icon = selectBox.firstElementChild.firstElementChild;
        selectBox.classList.add("active")
        if(icon.id == "dailyIcon"){
            icon.src = "/Daily2.svg"
        }
        else if(icon.id == "mediumIcon"){
            icon.src = "/starIconDark.svg"
        }
        else if(icon.id == "masterIcon"){
            icon.src = "/rewardedIconDark.svg"
        }
        // console.log(selectBox)

    }
    cartAnimation(){
        this.flipped = !this.flipped;
        if (this.flipped) {
            this.card.classList.add("flip");
        } else {
            this.card.classList.remove("flip");
        }

    }
    showWord(word, meaning){
        this.frontCard.innerText = word;
        this.backCard.innerText = meaning
    }
    Progress(lenData, currentIndex){
        console.log(lenData, currentIndex)
        if(lenData != 0){
            this.percentage.innerText =  Math.trunc(((currentIndex) * 100) / (lenData)) + "%"
            this.progressBar.style.width = this.percentage.innerText
        }
        else {
            this.percentage.innerText = "0%"
            this.progressBar.style.width = this.percentage.innerText
        }   
    }
    Counter(lenData, currentIndex){
        if(lenData != 0){
            this.firstNum.innerText = currentIndex
            this.secondNum.innerText = lenData
        }else{
            this.firstNum.innerText = 0
            this.secondNum.innerText = 0
        }
    }

}