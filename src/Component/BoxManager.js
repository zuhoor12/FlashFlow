// BoxManager.js
// in this file we will create a class called BoxManager that will be responsible for managing the three boxes (daily, medium, master) and the flashcard. This class will have methods to render the words in the flashcard, move words between boxes, delete words, and update the total word count in each box. It will also handle the navigation through the words in each box and display the progress of learning new words.
import { DataBaseController } from "./localStorageManager.js";

export class BoxManager {
    // the constructor will initialize the properties for the daily, medium, and master boxes, as well as the total word count elements. It will also create an instance of the DataBaseController to interact with the local storage and a reference to the modal for displaying flashcards. The constructor will also set up event listeners for navigating through words, moving words between boxes, deleting words, and showing the meaning of words on the flashcard.
    constructor(modal) {
        this.dailyBox = document.getElementById("daily");
        this.mediumBox = document.getElementById("medium");
        this.masterBox = document.getElementById("master");
        this.totalWord = document.getElementById("totalWord");
        this.totalDaily = document.getElementById("totalDaily");
        this.totalMedium = document.getElementById("totalMedium");
        this.totalMaster = document.getElementById("totalMaster");
        this.totalDaily1 = document.getElementById("totalDaily1");
        this.totalMedium1 = document.getElementById("totalMedium1");
        this.totalMaster1 = document.getElementById("totalMaster1");
        this.DatabaseManagerInstance = new DataBaseController();
        this.modal = modal;
        this.currentWords = [];
        this.currentIndex = 0;
        // we will set up event listeners for navigating through words, moving words between boxes, deleting words, and showing the meaning of words on the flashcard.
        document.getElementById("next").addEventListener("click", () => {
            this.nextWord();
        });
        document.getElementById("move").addEventListener("click", () => {
            this.moveWord();
        });
        document.getElementById("delete").addEventListener("click", () => {
            this.deleteWord();
        });
        document.getElementById("showMeaning").addEventListener("click", () => {
            this.modal.cartAnimation();
        });

        this.element = null;
    }

    async render(element) {
        // We have two states in which these boxes should be rendered. The first one is when a new word is added and the render function is called. The second one is when the user clicks on one of the desired boxes, causing the render function to be called again.
        // first we will check if the element parameter is null, which means that we want to render the currently active box. If there is an active box, we will set it as the current element and call the render method again with that element to display its contents. If there is no active box, we will simply return without rendering anything.
        if (element == null) {
            const allbox = [this.dailyBox, this.mediumBox, this.masterBox];
            const activebox = allbox.find((box) => box.classList.contains("active")) || null;
            if (activebox) {
                this.element = activebox;
                return this.render(this.element);
            }
            return;
        }
        // if the element parameter is not null, we will set it as the current element and proceed to render the contents of the selected box. We will call the activeBox method of the modal to highlight the selected box and update the icons accordingly. Then, we will retrieve all the words from the database for the selected level and store them in the currentWords array. We will also reset the currentIndex to 0 to start from the first word in the box.
        this.element = element;
        this.modal.activeBox(this.element, [this.dailyBox, this.mediumBox, this.masterBox]);
        const level = this.element.id;

        this.currentWords = await this.DatabaseManagerInstance.getAllData(level);
        this.currentIndex = 0;

        this.modal.Progress(this.currentWords.length, this.currentIndex + 1);
        this.modal.Counter(this.currentWords.length, this.currentIndex + 1);

        if (this.currentWords.length > 0) {
            this.modal.showWord(this.currentWords[this.currentIndex].word, this.currentWords[this.currentIndex].meaning);
        } else {
            this.modal.showWord("No Words", "Please add some words to this box");
        }
        // we will also check if the selected box is the master box. If it is, we will hide the "move" button and show the "delete" button, since words in the master box cannot be moved to another box but can be deleted. If the selected box is not the master box, we will show the "move" button and hide the "delete" button, allowing users to move words to the next level or delete them if they wish.
        if (this.element.id === "master") {
            document.getElementById("move").classList.add("hidden");
            document.getElementById("delete").classList.remove("hidden");
        } else {
            document.getElementById("move").classList.remove("hidden");
            document.getElementById("delete").classList.add("hidden");
        }
    }
    // the nextWord method will be responsible for navigating through the words in the current box. It will increment the currentIndex and update the progress and counter on the modal. If the currentIndex exceeds the length of the currentWords array, it will reset to 0 to loop back to the first word. It will also call the showWord method of the modal to display the current word and its meaning on the flashcard.
    nextWord() {
        if (this.currentWords.length === 0) {
            return;
        }

        this.currentIndex += 1;
        if (this.currentIndex === this.currentWords.length) {
            this.currentIndex = 0;
        }

        this.modal.Progress(this.currentWords.length, this.currentIndex + 1);
        this.modal.Counter(this.currentWords.length, this.currentIndex + 1);
        this.modal.showWord(this.currentWords[this.currentIndex].word, this.currentWords[this.currentIndex].meaning);
    }
    // the moveWord method will be responsible for moving a word from the current box to the next level box. It will check if there are any words in the current box and if there is a current word selected. If the current box is the daily box, it will move the word to the medium box and remove it from the daily box. If the current box is the medium box, it will move the word to the master box and remove it from the medium box. After moving the word, it will re-render the current box and update the total word count in each box to reflect the changes.
    async moveWord() {
        if (this.currentWords.length === 0) {
            return;
        }
        const currentWord = this.currentWords[this.currentIndex];
        if (!currentWord) {
            return;
        }
        if (this.element.id === "daily") {
            await this.DatabaseManagerInstance.saveWord("medium", currentWord.word, currentWord.meaning);
            await this.DatabaseManagerInstance.removeWord("daily", currentWord.word);
            await this.render(this.element);
            await this.updateTotalWord();
        } else if (this.element.id === "medium") {
            await this.DatabaseManagerInstance.saveWord("master", currentWord.word, currentWord.meaning);
            await this.DatabaseManagerInstance.removeWord("medium", currentWord.word);
            await this.render(this.element);
            await this.updateTotalWord();
        }
    }
    // the deleteWord method will be responsible for deleting a word from the current box. It will check if there are any words in the current box and if there is a current word selected. If there is a current word, it will remove it from the database and re-render the current box to reflect the changes. It will also update the total word count in each box after deleting the word.
    async deleteWord() {
        if (this.currentWords.length === 0) {
            return;
        }
        const currentWord = this.currentWords[this.currentIndex];
        if (!currentWord) {
            return;
        }
        await this.DatabaseManagerInstance.removeWord(this.element.id, currentWord.word);
        await this.render(this.element);
        await this.updateTotalWord();
    }
    // updateTotalWord method will be responsible for updating the total word count displayed in each box. It will retrieve the count of words in each level (daily, medium, master) from the database and update the corresponding elements in the UI to reflect the current totals. This method will be called whenever there is a change in the word counts, such as when a new word is added, moved, or deleted, ensuring that the user always sees accurate information about their vocabulary progress.
    async updateTotalWord() {
        const dailyCount = await this.DatabaseManagerInstance.getCountOfData("daily");
        const mediumCount = await this.DatabaseManagerInstance.getCountOfData("medium");
        const masterCount = await this.DatabaseManagerInstance.getCountOfData("master");
        const total = dailyCount + mediumCount + masterCount;
        this.totalWord.innerText = total;
        this.totalDaily.innerText = dailyCount;
        this.totalMedium.innerText = mediumCount;
        this.totalMaster.innerText = masterCount;
        this.totalDaily1.innerText = dailyCount;
        this.totalMedium1.innerText = mediumCount;
        this.totalMaster1.innerText = masterCount;
    }
}




