const themeButtons = document.querySelectorAll('.theme-icon');
const textArea = document.querySelector('.text-input');
const excludeSpaces = document.querySelector('#exclude-spaces');
const setCharLimit = document.querySelector('#set-char-limit');
const charCountNum = document.querySelector('#total-chars-num');
const wordCountNum = document.querySelector('#word-count-num');
const sentenceCountNum = document.querySelector('#sentence-count-num');
const readingTime = document.querySelector('.reading-time');
const charLimitField = document.querySelector('#character-limit-field');
const avgReadingSpeed = 250; //WPM

let text = "";
let charCount = 0;
let wordCount = 0;
let sentenceCount = 0;
let isExcludeSpaces = false;
let charLimit;
const defaultCharLimit = 300;

/*switch theme*/
themeButtons.forEach(themeButton => {
  themeButton.addEventListener('click', () => {

    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      document.querySelector('#logo-light').classList.remove('hidden');
      document.querySelector('#logo-dark').classList.add('hidden');
      document.querySelector('#theme-dark').classList.add('hidden');
      document.querySelector('#theme-light').classList.remove('hidden');
    } else {
      document.body.classList.add('dark');
      document.querySelector('#logo-dark').classList.remove('hidden');
      document.querySelector('#logo-light').classList.add('hidden');
      document.querySelector('#theme-light').classList.add('hidden');
      document.querySelector('#theme-dark').classList.remove('hidden');
    }
  });
});

/*handle exclude spaces*/
excludeSpaces.addEventListener('click', () => {
  isExcludeSpaces = !isExcludeSpaces;
  calculateCharCount();
  validateText();
});

/*handle char limit*/
setCharLimit.addEventListener('click', () => {
  if (charLimit) {
    charLimit = null;
    charLimitField.classList.add('hidden');
  } else {
    charLimit = defaultCharLimit;
    charLimitField.value = charLimit;
    charLimitField.classList.remove('hidden');
    document.querySelector('.limit-reached-text').innerText = `Limit reached! Your text exceeds ${charLimit} characters!`;
  }

  validateText();
});

/*ADD char limit
validation code here
for negatives and chars*/
charLimitField.addEventListener('input', () => {
  charLimit = charLimitField.value;
  validateText();
  document.querySelector('.limit-reached-text').innerText = `Limit reached! Your text exceeds ${charLimit} characters!`;
});


/*handle text input*/
textArea.addEventListener('input', () => {
  text = textArea.value;
  //update char count
  calculateCharCount();
  //update word count
  const trimmedWords = text.trim().split(/\s/g).filter(word => word.trim() !== '');
  wordCount = trimmedWords.length;
  wordCountNum.innerText = wordCount;
  console.log(trimmedWords);
  //update sentence count
  const trimmedSentences = text.trim().split(/[.!?]+/);
  sentenceCount = trimmedSentences.filter(sentence => sentence.trim() !== '').length;
  sentenceCountNum.innerText = sentenceCount;
  //update reading time
  const minutes = wordCount / avgReadingSpeed;
  if (minutes === 0) {
    readingTime.innerText = `Approx. reading time: 0 minutes`;
  } else {
    readingTime.innerText = `Approx. reading time: ${minutes < 1 ? '<1 minute' : (Math.round(minutes) < 2 ? '1 minute' : Math.round(minutes) + ' minutes')}`;
  }

  validateText();
});

function calculateCharCount() {
  if(!isExcludeSpaces) {
    charCount = text.length;
    charCountNum.innerText = charCount;
    document.querySelector('#total-chars-text').innerText = 'Total Characters';
  } else {
    charCount = text.replace(/\s/g, '').length;
    charCountNum.innerText = text.replace(/\s/g, '').length;
    document.querySelector('#total-chars-text').innerHTML = 'Total Characters <span id="no-space">(no space)</span>';
  }
}

function validateText() {
  const textValidation = document.querySelector('.text-validation');
  const validationHidden = textValidation.classList.contains('hidden');
  console.log(`text length: ${text.length}`);
  console.log(`char limit: ${charLimit}`);
  console.log(`hidden: ${validationHidden}`);
  if (charLimit) {
    if (charCount > charLimit) {
      if (validationHidden) {
        textValidation.classList.remove('hidden');
        textArea.classList.add('error');
      }
    } else {
      if (!validationHidden) {
        textValidation.classList.add('hidden');
        textArea.classList.remove('error');
      }
    }
  } else {
    if (!validationHidden) {
      textValidation.classList.add('hidden');
      textArea.classList.remove('error');
    }
  }
}