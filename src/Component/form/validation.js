// in this file, we will create a class called Validation that will be responsible for validating the user input in the modal form.
// This class will have a constructor that initializes the properties for the word and meaning input fields,
// as well as error messages for required fields and numeric input.
// The validator method will check if the input is valid and display appropriate error messages if it is not.
// The error method will be used to update the error message displayed in the modal when validation fails.
export class Validation {
    constructor(data) {
        this.errorTextbox = document.getElementById("wordError")
        this.textAreaerrobox = document.getElementById("textAreaerrobox")
        this.word = data.word
        this.meaning = data.meaning
        this.reqError = "This field must not be empty."
        this.numError = "You should not enter a number in this field."
    }

    validator() {
        let isValid = true

        if (this.word.trim().length <= 0) {
            this.error(this.errorTextbox, this.reqError)
            isValid = false
        } else if (!isNaN(this.word)) {
            this.error(this.errorTextbox, this.numError)
            isValid = false
        } else {
            this.error(this.errorTextbox, "")
        }

        if (this.meaning.trim().length <= 0) {
            this.error(this.textAreaerrobox, this.reqError)
            isValid = false
        } else if (!isNaN(this.meaning)) {
            this.error(this.textAreaerrobox, this.numError)
            isValid = false
        } else {
            this.error(this.textAreaerrobox, "")
        }

        return isValid
    }

    error(errorBox, textError) {
        if (errorBox) {
            errorBox.innerText = textError
        }
    }
}
