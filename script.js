const keys = document.querySelectorAll('.key');

keys.forEach(key => {
  key.addEventListener('click', () => {
    const note = key.getAttribute('data-note');
    playSound(note);
  });
});

// Fonction pour jouer le son et changer la couleur de la touche
function playSound(note) {
  const audioElement = new Audio(`notes/${note}.wav`);
  audioElement.currentTime = 0;
  audioElement.play();

  const key = document.querySelector(`[data-note="${note}"]`);
  key.classList.add('active');

  setTimeout(() => {
    key.classList.remove('active');
  }, 300);
}



// Ajoutez un écouteur d'événement de clic à chaque touche
keys.forEach(key => {
  key.addEventListener('mousedown', () => {
    key.classList.add('clicked');
  });

  key.addEventListener('mouseup', () => {
    key.classList.remove('clicked');
  });

  key.addEventListener('click', () => {
    if (currentQuiz) {
      const selectedNote = key.getAttribute('data-note');
      checkAnswer(currentQuiz, selectedNote);
    }
  });
});


// Écoutez les événements MIDI pour jouer les notes via le clavier MIDI
navigator.requestMIDIAccess()
  .then(midiAccess => {
    const inputs = midiAccess.inputs.values();

    for (const input of inputs) {
      input.onmidimessage = event => {
        const [status, note, velocity] = event.data;
        if (status === 144 && velocity > 0) { // Vérifiez le status MIDI (144 = note on)
          const adjustedNote = note - 24; // Ajustez l'index de la note MIDI
          const noteName = convertMIDINoteToName(adjustedNote);
          playSound(noteName);
        }
      };
    }
  })
  .catch(error => console.log('Erreur MIDI :', error));

// Convertir le numéro MIDI en nom de note (C1, Db1, etc.)
function convertMIDINoteToName(note) {
  const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const octave = Math.floor(note / 12) - 1;
  const noteName = noteNames[note % 12] + (octave + 1);
  return noteName;
}

const startButton = document.getElementById('startQuizButton');
const quizSelect = document.getElementById('quizSelect');
const answerElement = document.getElementById('question-display');
let currentQuiz = null;


startButton.addEventListener('click', startQuiz);

function startQuiz() {
  // Masquer le bouton de démarrage
  startButton.style.display = 'none';

  // Récupérer la valeur sélectionnée dans le menu déroulant
  const selectedQuiz = quizSelect.value;
  currentQuiz = null;


  // Afficher la question en fonction du quiz sélectionné
  if (selectedQuiz === 'maj_triads') {
    showMajorTriadQuestion();
  } else if (selectedQuiz === 'min_triads') {
    showMinorTriadQuestion();
  }
}

// Fonctions pour afficher les questions de triades majeures et mineures
function showMajorTriadQuestion() {
  // Afficher la question de triades majeures
  // Mettre à jour le contenu audio, etc.
}

function showMinorTriadQuestion() {
  // Afficher la question de triades mineures
  // Mettre à jour le contenu audio, etc.
}


// ...
const questionAudio = document.getElementById('questions');
const questionDisplay = document.getElementById('question-display');
const pianoKeys = document.querySelectorAll('.key');

const questions = {
  'triades-majeures': {
    question: 'Do Majeur',
    answer: ['C3', 'E3', 'G3']
  },
  'triades-mineures': {
    question: 'La Mineur',
    answer: ['A3', 'C4', 'E4']
  }
};

quizSelect.addEventListener('change', () => {
  const selectedQuiz = quizSelect.value;
  playQuestionAudio(selectedQuiz);
});

pianoKeys.forEach(key => {
  key.addEventListener('click', () => {
    const selectedQuiz = quizSelect.value;
    const selectedNote = key.getAttribute('data-note');
    checkAnswer(selectedQuiz, selectedNote);
  });
});

// Fonction pour afficher la question
function displayQuestion(quiz) {
  currentQuiz = quiz;
  questionAudio.src = `questions/${quiz}.wav`; // Mettez à jour l'extension du fichier audio si nécessaire
  questionAudio.play();
  answerElement.textContent = `Répondez avec les touches correspondantes...`;
}


// Fonction pour vérifier la réponse
function checkAnswer(quiz, selectedNote) {
  const correctAnswer = questions[quiz].answer;
  const selectedKeys = Array.from(document.querySelectorAll('.key.clicked'));
  const selectedNoteNames = selectedKeys.map(key => key.getAttribute('data-note'));

  if (selectedNoteNames.length === correctAnswer.length && selectedNoteNames.every(note => correctAnswer.includes(note))) {
    questionDisplay.textContent = 'Bonne réponse!';
    questionDisplay.style.color = 'green';
  } else {
    questionDisplay.textContent = 'Mauvaise réponse!';
    questionDisplay.style.color = 'red';
    selectedKeys.forEach(key => {
      key.classList.add('wrong');
      setTimeout(() => key.classList.remove('wrong'), 300);
    });
  }
}
// ...
