import localforage from "localforage";

export class DataBaseController {
    constructor() {
        this.daily = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "daily"
        });
        this.medium = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "medium"
        });
        this.master = localforage.createInstance({
            name: "VocabularyDb",
            storeName: "master"
        });
    }

    _getStore(level) {
        if (level === "daily") return this.daily;
        if (level === "medium") return this.medium;
        if (level === "master") return this.master;
        throw new Error(`Unknown storage level: ${level}`);
    }

    async saveWord(level, word, meaning) {
        try {
            const store = this._getStore(level);
            await store.setItem(word, meaning);
        } catch (error) {
            console.error(error);
        }
    }

    async getWord(level, word) {
        try {
            const store = this._getStore(level);
            return await store.getItem(word);
        } catch (error) {
            console.error(error);
        }
    }

    async getCountOfData(level) {
        try {
            const store = this._getStore(level);
            return await store.length();
        } catch (error) {
            console.error(error);
        }
    }

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

    async removeWord(level, word) {
        try {
            const store = this._getStore(level);
            await store.removeItem(word);
        } catch (error) {
            console.error(error);
        }
    }

    async totalWords() {
        const daily = await this.getCountOfData("daily");
        const medium = await this.getCountOfData("medium");
        const master = await this.getCountOfData("master");
        return daily + medium + master;
    }
}

    

