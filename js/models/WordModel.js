export default class WordModel {
    constructor() {
        this.storageKey = 'espassWords';
        this.words = this.loadWords();
        this.saveWords();
    }

    loadWords() {
        const savedWords = localStorage.getItem(this.storageKey);

        if (savedWords) {
            try {
                return JSON.parse(savedWords).map((word) => ({
                    learned: false,
                    ...word
                }));
            } catch (error) {
                return this.getDefaultWords();
            }
        }

        return this.getDefaultWords();
    }

    getDefaultWords() {
        return [
            {
                id: Date.now() + 1,
                word: 'Entender',
                transcription: '/en.ten.ˈdeɾ/',
                translation: 'Розуміти',
                type: 'Verbo',
                tagClass: 'tag-verb',
                example: 'No entiendo la pregunta.',
                learned: false
            },
            {
                id: Date.now() + 2,
                word: 'La Libertad',
                transcription: '/li.βeɾ.ˈtað/',
                translation: 'Свобода',
                type: 'Sustantivo',
                tagClass: 'tag-noun',
                example: 'La libertad es un derecho.',
                learned: false
            },
            {
                id: Date.now() + 3,
                word: 'Viajar',
                transcription: '/bja.ˈxaɾ/',
                translation: 'Подорожувати',
                type: 'Verbo',
                tagClass: 'tag-verb',
                example: 'Me gusta viajar en verano.',
                learned: false
            },
            {
                id: Date.now() + 4,
                word: 'Hermoso',
                transcription: '/eɾ.ˈmo.so/',
                translation: 'Прекрасний',
                type: 'Adjetivo',
                tagClass: 'tag-adj',
                example: '¡Qué día tan hermoso!',
                learned: false
            },
            {
                id: Date.now() + 5,
                word: '¡Claro que sí!',
                transcription: '/ˈkla.ɾo ke si/',
                translation: 'Звичайно!',
                type: 'Frase',
                tagClass: 'tag-phrase',
                example: '— ¿Vienes? — ¡Claro que sí!',
                learned: false
            }
        ];
    }

    saveWords() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.words));
    }

    getWords() {
        return this.words;
    }

    addWord(wordData) {
        this.words.push({
            id: Date.now(),
            learned: false,
            ...wordData
        });
        this.saveWords();
    }

    toggleLearned(wordId) {
        this.words = this.words.map((word) => {
            if (Number(word.id) === Number(wordId)) {
                return {
                    ...word,
                    learned: !word.learned
                };
            }

            return word;
        });

        this.saveWords();
    }

    getWordById(wordId) {
        return this.words.find((word) => Number(word.id) === Number(wordId));
    }

    deleteWord(wordId) {
        this.words = this.words.filter((word) => Number(word.id) !== Number(wordId));
        this.saveWords();
    }
}

