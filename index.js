const themeButtons = document.querySelectorAll('.theme-icon');
const textArea = document.querySelector('#text-input');
const excludeSpaces = document.querySelector('#exclude-spaces');
const setCharLimit = document.querySelector('#set-char-limit');
const charCountNum = document.querySelector('#total-chars-num');
const wordCountNum = document.querySelector('#word-count-num');
const sentenceCountNum = document.querySelector('#sentence-count-num');
const readingTime = document.querySelector('.reading-time');
const charLimitField = document.querySelector('#character-limit-field');
const densityList = document.querySelector('.density-list');
const seeMore = document.querySelector('.see-more');
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

    localStorage.setItem('theme', setTheme === 'dark' ? 'light' : 'dark');
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

/*handle char limit field*/
charLimitField.addEventListener('blur', () => {
  charLimit = charLimitField.value.replace(/[^0-9]/g, ''); //remove non-numeric
  if(/^0+$/.test(charLimit) && charLimit.length > 1) {
    charLimit = '0';
  } //remove 0 duplicates if only 0s
  charLimitField.value = charLimit;
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
  generateDensities();
});

/*handle see more*/
seeMore.addEventListener('click', () => {
  if (seeMore.innerText === 'See more ') {
    seeMore.firstChild.nodeValue = 'See less ';
    seeMore.querySelector('i').classList.replace('fa-angle-down', 'fa-angle-up');

    //show all bars
    Array.from(densityList.children).forEach((densityBar) => {
      if (densityBar.classList.contains('hidden')) {
        densityBar.classList.remove('hidden');
      }
    });

  } else {
    seeMore.firstChild.nodeValue = 'See more ';
    seeMore.querySelector('i').classList.replace('fa-angle-up', 'fa-angle-down');

    //show only 5 bars
    Array.from(densityList.children).forEach((densityBar, index) => {
      if (index > 4) {
        densityBar.classList.add('hidden');
      }
    });
  }
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

function generateDensities() {
  const noText = document.querySelector('.no-text-placeholder');
  const densityList = document.querySelector('.density-list');
  const filteredLetters = text.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();

  if (filteredLetters) {
    if (!noText.classList.contains('hidden')) {
      noText.classList.add('hidden');
    }
    if (densityList.classList.contains('hidden')) {
      densityList.classList.remove('hidden');
    }

    //generate info objects
    const uniqueChars = [...new Set(filteredLetters)];
    const uniqueCharsInfo = uniqueChars.map((uniqueChar) => {
      let count = 0;

      for (let char of text) {
        if (char.toUpperCase() === uniqueChar) count++;
      }

      return {letter: uniqueChar, count: count}
    });
    //sort
    const sortedInfo = uniqueCharsInfo.sort((a, b) => b.count - a.count);
    //render
    renderDensities(sortedInfo, filteredLetters);
  } else {
    if (noText.classList.contains('hidden')) {
      noText.classList.remove('hidden');
    }
    if (!densityList.classList.contains('hidden')) {
      densityList.classList.add('hidden');
    }
  }
}

function renderDensities(sortedInfo, alphaText) {
  //remove old densities
  while (densityList.firstChild) {
    densityList.removeChild(densityList.firstChild);
  }
  //create and append density lines
  const isSeeMore = seeMore.innerText === 'See more ';
  console.log(isSeeMore);
  sortedInfo.forEach((info, index) => {
    const densityLine = `
      <div class="density-line ${index > 4 && isSeeMore ? ' hidden' : ''}">
        <span class="density-letter">${info.letter}</span>
        <div class="density-bar">
          <div class="percentage-bar" style="width: ${info.count/alphaText.length * 100}%;"></div>
        </div>
        <span class="density-stats">${info.count + ' (' + (info.count/alphaText.length * 100).toFixed(2) + '%)'}</span>
      </div>
    `;

    densityList.insertAdjacentHTML('beforeend', densityLine);
  });

  if (densityList.childElementCount > 5) {
    if (seeMore.classList.contains('hidden')) {
      seeMore.classList.remove('hidden');
    }
  } else {
    if (!seeMore.classList.contains('hidden')) {
      seeMore.classList.add('hidden');
    }
    seeMore.firstChild.nodeValue = 'See more ';
    seeMore.querySelector('i').classList.replace('fa-angle-up', 'fa-angle-down');
  }
}