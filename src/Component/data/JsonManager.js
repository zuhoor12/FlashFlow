// JsonManager.js
// Import / export of vocabulary as JSON.
//
// Export: downloads all three boxes in one backup file.
// Import accepts any of these formats:
//   1) [ { "word": "Serendipity", "meaning": "..." }, ... ]   -> goes to the Daily box
//   2) { "words": [ { "word": "...", "meaning": "..." } ] }   -> goes to the Daily box
//   3) { "Serendipity": "meaning", "Ephemeral": "meaning" }   -> goes to the Daily box
//   4) a backup file created by Export ({ "daily": [...], "medium": [...], "master": [...] })
//      -> each word is restored to its own box
// Words that already exist (in any box, case-insensitive) are skipped so progress is never overwritten.
import Swal from "sweetalert2";

const LEVELS = ["daily", "medium", "master"];

export class JsonManager {
    constructor(db) {
        this.db = db;
    }

    _theme() {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }

    // Turn a raw item into { word, meaning } or null when it is not valid.
    _normalize(word, meaning) {
        if (typeof word !== "string" || typeof meaning !== "string") return null;
        word = word.trim();
        meaning = meaning.trim();
        if (!word || !meaning) return null;
        // same rule as the Add Word form: a word cannot be only a number
        if (!isNaN(word)) return null;
        return { word, meaning };
    }

    _collect(list, level, result) {
        if (Array.isArray(list)) {
            for (const item of list) {
                const ok = item && typeof item === "object" ? this._normalize(item.word, item.meaning) : null;
                if (ok) result[level].push(ok);
                else result.invalid++;
            }
        } else if (list && typeof list === "object") {
            for (const [word, meaning] of Object.entries(list)) {
                const ok = this._normalize(word, meaning);
                if (ok) result[level].push(ok);
                else result.invalid++;
            }
        } else {
            result.invalid++;
        }
    }

    // Parse JSON text into { daily: [], medium: [], master: [], invalid: n }. Throws if the JSON is broken.
    parse(text) {
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error("This is not valid JSON. Check commas, quotes and brackets.");
        }
        const result = { daily: [], medium: [], master: [], invalid: 0 };
        if (Array.isArray(data)) {
            this._collect(data, "daily", result);
        } else if (data && typeof data === "object") {
            if (LEVELS.some((level) => level in data)) {
                LEVELS.forEach((level) => {
                    if (data[level] !== undefined) this._collect(data[level], level, result);
                });
            } else if (Array.isArray(data.words)) {
                this._collect(data.words, "daily", result);
            } else {
                this._collect(data, "daily", result);
            }
        } else {
            throw new Error("The JSON must be a list of words.");
        }
        return result;
    }

    // Save parsed words. Returns counts for the summary message.
    async importText(text) {
        const parsed = this.parse(text);
        const seen = new Set();
        for (const level of LEVELS) {
            const existing = (await this.db.getAllData(level)) || [];
            existing.forEach((item) => seen.add(item.word.trim().toLowerCase()));
        }
        const added = { daily: 0, medium: 0, master: 0 };
        let skipped = 0;
        for (const level of LEVELS) {
            for (const item of parsed[level]) {
                const key = item.word.toLowerCase();
                if (seen.has(key)) {
                    skipped++;
                    continue;
                }
                await this.db.saveWord(level, item.word, item.meaning);
                seen.add(key);
                added[level]++;
            }
        }
        const total = added.daily + added.medium + added.master;
        return { added, total, skipped, invalid: parsed.invalid };
    }

    // Download every word from the three boxes as a JSON file.
    async exportAll() {
        const backup = {
            app: "VocabFlow",
            version: 1,
            exportedAt: new Date().toISOString(),
        };
        let total = 0;
        for (const level of LEVELS) {
            const items = (await this.db.getAllData(level)) || [];
            backup[level] = items.map((item) => ({ word: item.word, meaning: item.meaning }));
            total += items.length;
        }
        if (total === 0) {
            await Swal.fire({
                icon: "info",
                title: "Nothing to export",
                text: "Add some words first.",
                theme: this._theme(),
            });
            return false;
        }
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vocabflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return true;
    }

    // Friendly message after an import.
    async showResult(result) {
        const lines = [];
        const { added } = result;
        if (added.daily) lines.push(`${added.daily} added to Daily`);
        if (added.medium) lines.push(`${added.medium} added to Medium`);
        if (added.master) lines.push(`${added.master} added to Mastered`);
        if (result.skipped) lines.push(`${result.skipped} skipped (already exist)`);
        if (result.invalid) lines.push(`${result.invalid} skipped (missing word or meaning)`);
        await Swal.fire({
            icon: result.total > 0 ? "success" : "warning",
            title: result.total > 0 ? `${result.total} ${result.total === 1 ? "word" : "words"} imported` : "No new words imported",
            html: lines.join("<br>"),
            theme: this._theme(),
        });
    }
}
