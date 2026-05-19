import WordModel from '../models/WordModel.js';
import WordView from '../views/WordView.js';

export default class WordController {
    constructor() {
        this.model = new WordModel();
        this.view = new WordView();

        this.view.bindAddWord(this.handleAddWord.bind(this));
        this.view.bindToggleLearned(this.handleToggleLearned.bind(this));
        this.view.bindDeleteWord(this.handleDeleteWord.bind(this));
        this.view.bindSpeakWord(this.handleSpeakWord.bind(this));
        this.updateView();
    }

    handleAddWord(wordData) {
        this.model.addWord(wordData);
        this.updateView();
    }

    handleToggleLearned(wordId) {
        this.model.toggleLearned(wordId);
        this.updateView();
    }

    handleDeleteWord(wordId) {
        this.model.deleteWord(wordId);
        this.updateView();
    }

    handleSpeakWord(wordId) {
        const word = this.model.getWordById(wordId);

        if (!word) {
            return;
        }

        this.speakSpanish(word.word);
    }

    speakSpanish(text) {
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
            window.showAppMessage?.('Браузер не підтримує озвучування слів.', 'danger');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.85;
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith('es'));

        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }

        utterance.onerror = () => {
            window.showAppMessage?.('Не вдалося відтворити вимову слова.', 'danger');
        };

        window.speechSynthesis.speak(utterance);
    }

    updateView() {
        this.view.renderWords(this.model.getWords());
    }
}
