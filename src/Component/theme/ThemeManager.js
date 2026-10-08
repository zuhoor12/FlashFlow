// ThemeManager.js
// Handles the light / dark mode toggle.
// The "dark" class is placed on <html>. A tiny inline script in index.html applies the saved theme
// before the page paints (so there is no white flash), and this class only handles the toggle button.
const STORAGE_KEY = "vocabflow-theme";

export class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.button = document.getElementById("themeToggle");
        if (this.button) {
            this.button.addEventListener("click", () => this.toggle());
        }
    }
    isDark() {
        return this.root.classList.contains("dark");
    }
    toggle() {
        const dark = this.root.classList.toggle("dark");
        try {
            localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
        } catch (error) {
            console.error(error);
        }
    }
}
