document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const quizContainer = document.getElementById('quiz-container');
    const questionCardsNodeList = document.querySelectorAll('.question-card');
    const scoreValueEl = document.getElementById('score-value');
    const totalQuestionsEl = document.getElementById('total-questions');
    const resetButton = document.getElementById('reset-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    // --- State ---
    let score = 0;
    const totalQuestions = questionCardsNodeList.length;

    // --- Functions ---

    /**
     * Shuffles an array in place.
     * @param {Array} array The array to shuffle.
     */
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    /**
     * Updates the score display in the UI.
     */
    const updateScoreDisplay = () => {
        scoreValueEl.textContent = score;
    };

    /**
     * Handles a click on an answer option.
     * @param {Event} event The click event.
     */
    const handleOptionClick = (event) => {
        const selectedOption = event.target.closest('.option-btn');
        if (!selectedOption) return;

        const parentCard = selectedOption.closest('.question-card');
        const optionsContainer = parentCard.querySelector('.options-container');
        const feedbackEl = parentCard.querySelector('.feedback');
        
        if (optionsContainer.classList.contains('disabled')) return;
        optionsContainer.classList.add('disabled');

        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        const correctOption = optionsContainer.querySelector('[data-correct="true"]');

        if (isCorrect) {
            score++;
            updateScoreDisplay();
            selectedOption.classList.add('correct');
            feedbackEl.innerHTML = `<span class="font-bold text-green-600 dark:text-green-400">¡Correcto!</span> ${correctOption.dataset.explanation}`;
        } else {
            selectedOption.classList.add('incorrect');
            correctOption.classList.add('correct');
            feedbackEl.innerHTML = `<span class="font-bold text-red-600 dark:text-red-400">Incorrecto.</span> ${correctOption.dataset.explanation}`;
        }

        feedbackEl.style.display = 'block';
    };
    
    /**
     * Resets the entire quiz to its initial state and reshuffles.
     */
    const resetQuiz = () => {
        score = 0;
        updateScoreDisplay();

        questionCardsNodeList.forEach(card => {
            card.querySelector('.options-container').classList.remove('disabled');
            card.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('correct', 'incorrect');
            });
            const feedbackEl = card.querySelector('.feedback');
            feedbackEl.style.display = 'none';
            feedbackEl.innerHTML = '';
        });
        
        initQuiz();
    };
    
    /**
     * Updates the theme toggle icon based on the current theme.
     */
    const updateThemeIcon = () => {
        if (document.documentElement.classList.contains('dark')) {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    };

    /**
     * Toggles the color theme between light and dark.
     */
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        updateThemeIcon();
    };

    /**
     * Initializes the quiz: shuffles questions and options, sets up listeners.
     */
    const initQuiz = () => {
        totalQuestionsEl.textContent = totalQuestions;
        updateScoreDisplay();

        const questionCardsArray = Array.from(questionCardsNodeList);
        shuffleArray(questionCardsArray);
        quizContainer.innerHTML = '';
        questionCardsArray.forEach(card => quizContainer.appendChild(card));

        questionCardsArray.forEach(card => {
            const optionsContainer = card.querySelector('.options-container');
            const options = Array.from(optionsContainer.children);
            shuffleArray(options);
            options.forEach(option => optionsContainer.appendChild(option));
        });
    };

    // --- Event Listeners Setup ---
    quizContainer.addEventListener('click', handleOptionClick);
    resetButton.addEventListener('click', resetQuiz);
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // --- Initial Calls ---
    initQuiz();
    updateThemeIcon();
});