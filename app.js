const $ = document.querySelector.bind(document);

const container = $('.container');
const searchInput = $('#input');
const removeBtn = $('.close-icon');
const textInfo = $('.info-text');
const synonymsList = $('.synonyms .list');
const volumeBtn = $('.word i');
let audio;

// function to click synonym to search
const search = (word) => {
    fetchAPI(word);
    searchInput.value = word;
}

// render info word
const renderData = (data, word) => {
    container.classList.add('active');
    const wordType = data[0].meanings[0].partOfSpeech;
    const phonetics = `${wordType} /${data[0].phonetic}/`
    const definitions = data[0].meanings[0].definitions[0];
    const meaning = definitions.definition;
    const example = definitions.example + '.';
    const synonyms = definitions.synonyms;
    audio = new Audio("https:" + data[0].phonetics[0].audio);
    $('.word p').innerText = word;
    $('.word span').innerText = phonetics;
    $('.meaning span').innerText = meaning;
    $('.example span').innerText = example;

    if (synonyms.length <= 0 || !synonyms) {
        synonymsList.parentElement.style.display = 'none';
    } else {
        synonymsList.parentElement.style.display = 'block';
        synonymsList.innerHTML = '';
        let length;
        length = synonyms.length < 5 ? synonyms.length : 5;
        for (let i = 0; i < length; i++) {
            let synonymTag = `
                <span onclick="search('${synonyms[i]}')">${synonyms[i]},</span>
            `
            synonymTag = i == 4 ? `<span onclick="search('${synonyms[i]}')">${synonyms[5]},</span>` : synonymTag;
            synonymsList.insertAdjacentHTML("beforeend", synonymTag);
        }
    }
}

// get data from API
const fetchAPI = async(word) => {
    container.classList.remove('active')
    textInfo.innerHTML = `Searching the meaning of <span>" ${word} "</span>`;
    try {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const res = await axios.get(apiUrl);
        renderData(res.data, word);
    } catch {
        textInfo.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }
}

// Set default when click removeBtn
const defaultStatus = () => {
    textInfo.innerHTML = 'Type any existing word and press enter to get meaning, example, synonyms, etc.';
    container.classList.remove('active');
    searchInput.value = '';
    removeBtn.style.visibility = "hidden";
}

// Event press key Enter to search
searchInput.addEventListener('keypress', e => {
    removeBtn.style.visibility = "visible";
    const word = e.target.value.replace(/\s+/g, ' ');
    if (e.key == 'Enter' && word) {
        fetchAPI(word);
    }
})

// When value input empty => hide removeBtn
searchInput.addEventListener('input', e => {
    if (e.target.value == '') {
        removeBtn.style.visibility = "hidden";
    }
});

// Event click removeBtn to resest
removeBtn.addEventListener('click', defaultStatus);

// Event click audio
volumeBtn.addEventListener('click', () => {
    volumeBtn.style.color = '#4d59fb';
    audio.play();
    setTimeout(() => {
        volumeBtn.style.color = '#989898';
    }, 600);
})