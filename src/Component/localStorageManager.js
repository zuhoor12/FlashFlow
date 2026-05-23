import localforage from "localforage";
// we use localforage to manage our local storage because it provides a simple API and supports various storage backends
// (IndexedDB, WebSQL, and localStorage) with automatic fallbacks.
// This ensures that our application can store data efficiently across different browsers
// and environments without worrying about compatibility issues. Additionally, localforage offers asynchronous methods,
//  which help prevent blocking the main thread and improve the overall performance of our application when handling larger datasets.
// what this class do is to manage the local storage for our application.
// It provides methods to save, retrieve, and delete words and their meanings across three different
// levels: daily, medium, and master. Each level has its own separate storage instance,
// allowing us to organize the vocabulary data effectively.
//  The class also includes a method to count the total number of words across all levels,
// which can be useful for tracking the user's progress in learning new vocabulary.
export class DataBaseController {
    constructor() {
        // We create a separate instance for each level.

        // for daily level : it means everyday words that user want to learn
        this.daily = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "daily"
        });
        // For intermediate level: means words that the user is learning but has not yet mastered. That is, three days a week.

        this.medium = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "medium"
        });
        // For master level: means words that the user has mastered and wants to keep in long-term memory. That is, once a week.
        this.master = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "master"
        });
    }
    // for internal use to get the correct store based on level
    _getStore(level) {
        if (level === "daily") return this.daily;
        if (level === "medium") return this.medium;
        if (level === "master") return this.master;
        throw new Error(`Unknown storage level: ${level}`);
    }
    // Savee a word and its meaning to the specified level
    async saveWord(level, word, meaning) {
        try {
            const store = this._getStore(level);
            await store.setItem(word, meaning);
        } catch (error) {
            console.error(error);
        }
    }
    // get the meaning of a word from the specified level
    async getWord(level, word) {
        try {
            const store = this._getStore(level);
            return await store.getItem(word);
        } catch (error) {
            console.error(error);
        }
    }
    // get the count of words in the specified level
    async getCountOfData(level) {
        try {
            const store = this._getStore(level);
            return await store.length();
        } catch (error) {
            console.error(error);
        }
    }
    // get all words and their meanings from the specified level
    async getAllData(level) {
        try {
            const store = this._getStore(level);
            const data = [];
            await store.iterate((value, key) => {
                data.push({ word: key, meaning: value });
            });
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    // remove a word from the specified level
    async removeWord(level, word) {
        try {
            const store = this._getStore(level);
            await store.removeItem(word);
        } catch (error) {
            console.error(error);
        }
    }
    // count total words across all levels
    async totalWords() {
        const daily = await this.getCountOfData("daily");
        const medium = await this.getCountOfData("medium");
        const master = await this.getCountOfData("master");
        return daily + medium + master;
    }
}

    

