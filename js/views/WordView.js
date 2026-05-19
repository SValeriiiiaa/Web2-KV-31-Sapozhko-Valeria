export default class WordView {
    constructor() {
        this.wordsContainer = document.getElementById('wordsContainer');
        this.wordsCount = document.getElementById('wordsCount');
        this.addWordBtn = document.getElementById('addWordBtn');
        this.wordModalElement = document.getElementById('wordModal');
        this.wordForm = document.getElementById('wordForm');
        this.wordModal = this.wordModalElement ? new bootstrap.Modal(this.wordModalElement) : null;
    }

    renderWords(words) {
        if (!this.wordsContainer) {
            return;
        }

        this.wordsContainer.innerHTML = words.map((word) => this.createWordCard(word)).join('');

        if (this.wordsCount) {
            const learnedCount = words.filter((word) => word.learned).length;
            this.wordsCount.textContent = `Todos (${words.length}) · Вивчено (${learnedCount})`;
        }
    }

    createWordCard(word) {
        const checked = word.learned ? 'checked' : '';
        const learnedClass = word.learned ? 'word-learned' : '';

        return `
                <div class="col-md-4">
                    <div class="word-card ${learnedClass}" data-id="${word.id}">
                        <div class="word-actions">
                            <label class="learned-check" title="Позначити як вивчене">
                                <input type="checkbox" class="learned-toggle" data-id="${word.id}" ${checked}>
                                <span>Вивчено</span>
                            </label>
                            <button type="button" class="delete-word-btn" data-id="${word.id}" title="Видалити слово">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <button type="button" class="audio-icon audio-word-btn" data-id="${word.id}" title="Прослухати вимову">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <span class="tag ${word.tagClass}">${word.type}</span>
                        <h4 class="fw-bold mb-1">${word.word}</h4>
                        <p class="text-muted small mb-3">${word.transcription || ''}</p>
                        <h5 class="text-primary-emphasis mb-3">${word.translation}</h5>
                        <div class="example-box rounded-3">
                            "${word.example || word.word}"
                        </div>
                    </div>
                </div>`;
    }

    bindAddWord(handler) {
        if (!this.addWordBtn || !this.wordForm || !this.wordModal) {
            return;
        }

        this.addWordBtn.addEventListener('click', () => {
            this.wordForm.reset();
            this.showFormMessage('', '');
            this.wordModal.show();
        });

        this.wordForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const word = document.getElementById('wordInput').value.trim();
            const translation = document.getElementById('translationInput').value.trim();
            const type = document.getElementById('typeInput').value;
            const transcription = document.getElementById('transcriptionInput').value.trim();
            const example = document.getElementById('exampleInput').value.trim();

            if (!word || !translation) {
                this.showFormMessage('Заповніть слово і переклад.', 'danger');
                return;
            }

            handler({
                word,
                transcription,
                translation,
                type,
                tagClass: this.getTagClass(type),
                example: example || word
            });

            this.wordModal.hide();
            this.wordForm.reset();
        });
    }

    bindToggleLearned(handler) {
        if (!this.wordsContainer) {
            return;
        }

        this.wordsContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('learned-toggle')) {
                handler(event.target.dataset.id);
            }
        });
    }

    bindDeleteWord(handler) {
        if (!this.wordsContainer) {
            return;
        }

        this.wordsContainer.addEventListener('click', async (event) => {
            const deleteButton = event.target.closest('.delete-word-btn');

            if (deleteButton) {
                const confirmed = await this.confirmAction('Видалити це слово зі словника?');

                if (confirmed) {
                    handler(deleteButton.dataset.id);
                }
            }
        });
    }

    bindSpeakWord(handler) {
        if (!this.wordsContainer) {
            return;
        }

        this.wordsContainer.addEventListener('click', (event) => {
            const audioButton = event.target.closest('.audio-word-btn');

            if (audioButton) {
                handler(audioButton.dataset.id);
            }
        });
    }

    showFormMessage(message, type) {
        if (!this.wordForm) {
            return;
        }

        let messageBox = this.wordForm.querySelector('.word-form-message');

        if (!message) {
            if (messageBox) {
                messageBox.remove();
            }
            return;
        }

        if (!messageBox) {
            messageBox = document.createElement('div');
            this.wordForm.querySelector('.modal-body').prepend(messageBox);
        }

        messageBox.className = `word-form-message form-message form-message-${type}`;
        messageBox.textContent = message;
    }

    confirmAction(message) {
        return new Promise((resolve) => {
            const oldConfirm = document.querySelector('.app-confirm-backdrop');

            if (oldConfirm) {
                oldConfirm.remove();
            }

            const backdrop = document.createElement('div');
            backdrop.className = 'app-confirm-backdrop';
            backdrop.innerHTML = `
                <div class="app-confirm-box">
                    <h6 class="fw-bold mb-2">Підтвердження</h6>
                    <p class="text-muted mb-4">${message}</p>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-light app-confirm-cancel">Скасувати</button>
                        <button type="button" class="btn btn-danger app-confirm-ok">Видалити</button>
                    </div>
                </div>
            `;

            document.body.appendChild(backdrop);

            const close = (result) => {
                backdrop.remove();
                resolve(result);
            };

            backdrop.querySelector('.app-confirm-cancel').addEventListener('click', () => close(false));
            backdrop.querySelector('.app-confirm-ok').addEventListener('click', () => close(true));
            backdrop.addEventListener('click', (event) => {
                if (event.target === backdrop) {
                    close(false);
                }
            });
        });
    }

    notify() {
        // Сповіщення для звичайних дій не показуємо, щоб інтерфейс не був перевантажений.
    }

    getTagClass(type) {
        const normalizedType = type.toLowerCase();

        if (normalizedType.includes('verbo')) {
            return 'tag-verb';
        }

        if (normalizedType.includes('sustantivo')) {
            return 'tag-noun';
        }

        if (normalizedType.includes('adjetivo')) {
            return 'tag-adj';
        }

        return 'tag-phrase';
    }
}
