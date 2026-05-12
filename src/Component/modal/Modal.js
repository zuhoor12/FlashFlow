// Modal.js
// in this file we will create a class for modal that will be used to add new word and meaning to the database and also to show the word and meaning in the flashcard
// The class will have methods to open and close the modal, clear the input fields, and show the word and meaning in the flashcard. It will also have a method to flip the flashcard and show the progress of learning new words.
export class Modal{
    constructor(){

        // We will get all the necessary elements from the DOM and store them as properties of the class for easy access in the methods.
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
        this.progressBar = document.getElementById("progressBar")
        this.percentage = document.getElementById("percentage")
        this.firstNum = document.getElementById("firstNum")
        this.secondNum = document.getElementById("secondNum")
        this.cartBox.addEventListener("click",()=>{this.cartAnimation()})
    }   
    // The open method will remove the "hidden" class from the overlay and prompt box to make them visible, while the close method will add the "hidden" class back to hide them.
    open(){
        this.overlay.classList.remove("hidden");
        this.promptBox.classList.remove("hidden");
    }
    // the close method will add the "hidden" class back to hide the overlay and prompt box.
    close(){
        this.overlay.classList.add("hidden")
        this.promptBox.classList.add("hidden")
    }
    // the SubmitOf method will prevent the default form submission behavior when the user clicks the "Add Vocabulary" button, allowing us to handle the form data with JavaScript instead.
    SubmitOf(event){
        event.preventDefault();
    }
    // The ClearInput method will reset the values of the input fields for the word and its meaning, allowing the user to enter new data without having to manually clear the previous entries. The clearError method will reset any error messages that may have been displayed, ensuring that the user has a clean slate when adding new vocabulary.
    ClearInput(){
        this.inputText.value = ""
        this.inputTextArea.value = ""
    }
    // clearError method will reset any error messages that may have been displayed, ensuring that the user has a clean slate when adding new vocabulary.
    clearError(){
        this.wordError.innerText = ""
        this.textAreaerrobox.innerText = ""
    }
    // the active box method will be used to highlight the selected box (daily, medium, or master) and change the icon accordingly. It will remove the "active" class from all boxes and add it to the selected box, while also changing the icon to indicate which box is currently active.
    activeBox(selectBox ,parentElements){
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

    }
    // cartAnimation method will toggle the "flip" class on the card element to create a flipping animation effect when the user clicks on the flashcard. This allows the user to see both the word and its meaning by flipping the card over.
    cartAnimation(){
        this.flipped = !this.flipped;
        if (this.flipped) {
            this.card.classList.add("flip");
        } else {
            this.card.classList.remove("flip");
        }

    }
    // the showWord method will update the text content of the front and back of the flashcard to display the word and its meaning, allowing the user to see the information they have added in a visually appealing way.
    showWord(word, meaning){
        this.frontCard.innerText = word;
        this.backCard.innerText = meaning
    }
    // the Progress method will update the progress bar and percentage text to reflect the user's progress in learning new words. It calculates the percentage based on the current index of the word being studied and the total number of words, providing visual feedback on how much of the vocabulary has been learned.
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
    // the Counter method will update the text content of the first and second number elements to show the current index and total number of words, providing a clear indication of the user's progress in learning new vocabulary.
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