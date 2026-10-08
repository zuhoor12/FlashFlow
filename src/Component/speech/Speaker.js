// Speaker.js
// English pronunciation using the browser's built-in Web Speech API (speechSynthesis).
// The speaker button on the front of the card reads the word.
// The best English voice on the device is chosen automatically (natural / neural voices first),
// and a small drop-down lets the user pick another English voice if they prefer.
import Swal from "sweetalert2";

const VOICE_KEY = "vocabflow-english-voice";

// Old robotic / novelty voices that make pronunciation worse.
const BAD_VOICES = /compact|espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|princess/i;

export class Speaker {
    constructor(modal) {
        this.modal = modal;
        this.supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
        this.buttons = document.querySelectorAll("[data-speak]");
        this.select = document.getElementById("speechVoice");
        this.voices = [];
        this.warned = false;

        if (!this.supported) {
            // Hide everything related to speech if the browser does not support it.
            this.buttons.forEach((btn) => btn.classList.add("hidden"));
            return;
        }

        // Voices load asynchronously in Chrome / Edge, so we listen for the change event too.
        this.loadVoices();
        window.speechSynthesis.addEventListener("voiceschanged", () => this.loadVoices());

        if (this.select) {
            this.select.addEventListener("change", () => {
                try {
                    localStorage.setItem(VOICE_KEY, this.select.value);
                } catch (error) {
                    console.error(error);
                }
                // let the user hear the new voice right away
                this.speak(this.modal.frontCard.innerText);
            });
        }

        this.buttons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                // The card flips when clicked, so we stop the click here.
                event.stopPropagation();
                this.speak(this.modal.frontCard.innerText);
            });
        });
    }

    // Higher score = better sounding voice.
    score(voice) {
        const name = voice.name;
        const lang = voice.lang.replace("_", "-").toLowerCase();
        let score = 0;
        if (lang === "en-us") score += 30;
        else if (lang === "en-gb") score += 25;
        else score += 10;
        if (/natural|neural|online/i.test(name)) score += 60; // Microsoft Edge natural voices
        if (/premium|enhanced/i.test(name)) score += 50; // macOS / iOS high quality voices
        if (/google/i.test(name)) score += 40; // Chrome "Google US English" is a good one
        if (/samantha|daniel|karen|moira|serena|aria|jenny|guy|ava|allison|zoe/i.test(name)) score += 15;
        if (!voice.localService) score += 5;
        if (BAD_VOICES.test(name)) score -= 100;
        return score;
    }

    loadVoices() {
        const english = window.speechSynthesis
            .getVoices()
            .filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith("en"));
        if (english.length === 0) return;
        this.voices = english.sort((a, b) => this.score(b) - this.score(a));
        if (!this.select) return;

        // fill the drop-down
        let saved = null;
        try {
            saved = localStorage.getItem(VOICE_KEY);
        } catch (error) {
            console.error(error);
        }
        this.select.innerHTML = "";
        this.voices.forEach((voice) => {
            const option = document.createElement("option");
            option.value = voice.voiceURI;
            option.textContent = `${voice.name.replace(/^(Microsoft|Google)\s+/i, "")} (${voice.lang.replace("_", "-")})`;
            this.select.appendChild(option);
        });
        // the saved voice if it still exists, otherwise the best one
        const savedExists = saved && this.voices.some((v) => v.voiceURI === saved);
        this.select.value = savedExists ? saved : this.voices[0].voiceURI;
        this.select.classList.remove("hidden");
    }

    currentVoice() {
        if (this.voices.length === 0) return null;
        const wanted = this.select && this.select.value;
        return this.voices.find((v) => v.voiceURI === wanted) || this.voices[0];
    }

    speak(text) {
        if (!this.supported || !text || !text.trim()) return;
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text.trim());
        const voice = this.currentVoice();
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        } else {
            utterance.lang = "en-US";
            if (synth.getVoices().length > 0 && !this.warned) {
                // Voices are loaded but there is no English one.
                this.warned = true;
                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "info",
                    title: "No English voice is installed on this device",
                    showConfirmButton: false,
                    timer: 3500,
                    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
                });
            }
        }
        utterance.rate = 0.85; // slightly slower so the pronunciation is clear
        synth.speak(utterance);
    }

    stop() {
        if (this.supported) window.speechSynthesis.cancel();
    }
}
