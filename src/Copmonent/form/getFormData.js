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