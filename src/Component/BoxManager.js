// BoxManager.js
import { DataBaseController } from "./localStorageManager.js";

export class BoxManager {
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
        if (element == null) {
            const allbox = [this.dailyBox, this.mediumBox, this.masterBox];
            const activebox = allbox.find((box) => box.classList.contains("active")) || null;
            if (activebox) {
                this.element = activebox;
                return this.render(this.element);
            }
            return;
        }

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

        if (this.element.id === "master") {
            document.getElementById("move").classList.add("hidden");
            document.getElementById("delete").classList.remove("hidden");
        } else {
            document.getElementById("move").classList.remove("hidden");
            document.getElementById("delete").classList.add("hidden");
        }
    }

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




