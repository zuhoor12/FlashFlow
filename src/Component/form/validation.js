export class Validation{
    constructor(data){
        this.errorTextbox = document.getElementById("wordError")
        this.textAreaerrobox = document.getElementById("textAreaerrobox")
        this.word = data.word;
        this.meaning = data.meaning;
        this.reqError =  "This field must not be empty."
        this.numError = "You should not enter a number in this field."
    }

    validator(){
        let isValid = true;

        if(this.word.trim().length <= 0){
            this.error(this.errorTextbox, this.reqError);
            isValid = false;
        }
         else if (!isNaN(this.word)) { // اگر ورودی عدد بود
            this.error(this.errorTextbox, this.numError);
            isValid = false;
        } else {
            this.error(this.errorTextbox, ""); // پاک کردن خطا
        }
        if (this.meaning.trim().length <= 0) {
            this.error(this.textAreaerrobox, this.reqError);
            isValid = false;
        } else if (!isNaN(this.meaning)) { // اگر ورودی عدد بود
            this.error(this.textAreaerrobox, this.numError);
            isValid = false;
        } else {
            this.error(this.textAreaerrobox, ""); // پاک کردن خطا
        }
        return isValid
    }

    error(errorBox,textError){
        if(errorBox){
            errorBox.innerText = textError
        }
    }

}