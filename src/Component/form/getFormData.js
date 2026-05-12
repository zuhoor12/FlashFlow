// in this file, we should create a class called FromData that will be responsible for
// getting the data from the input fields in the modal and returning it as an object.
// This class will have a constructor that initializes the properties for the word and meaning input fields,
// and a method called getData that retrieves the values from these fields and returns them in an object format.
// This will allow us to easily access the user input data when we need to validate it or save it to the database.
export class FromData{
    constructor(){
        this.word = document.getElementById("word");
        this.meaning = document.getElementById("meaning");
    }
    getData(){
        return {
            "word" : this.word.value,
            "meaning" :this.meaning.value
        }
    }
}