let player;
let array;
let term;

window.HomeData = function () {
    fetch('category.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.category === 'popular') {
                    document.getElementById('popular').innerHTML += `
                    <div class="category" onclick='window.location.href="player.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle category-name">
                            ${item.name}
                        </div>
                    </div>
                    `;
                } else if (item.category === 'new') {
                    document.getElementById('new').innerHTML += `
                    <div class="category" onclick='window.location.href="player.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle category-name">
                            ${item.name}
                        </div>
                    </div>
                    `;
                } else if (item.category === 'other') {
                    document.getElementById('other').innerHTML += `
                    <div class="category" onclick='window.location.href="player.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle category-name">
                            ${item.name}
                        </div>
                    </div>
                    `;
                }
            });
        })
        .catch(error => console.error('Fehler beim Laden der JSON:', error));
    LoadOwnCategories();
};


function LoadOwnCategories() {
    const savedDataContainer = document.getElementById('own');

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith('CategoryImposterGame')) {
            const savedData = JSON.parse(localStorage.getItem(key));

            savedDataContainer.innerHTML += `
                    <div class="category" onclick='window.location.href="player.html?category=OWN${savedData.category}"'>
                        <div class="justify-middle">
                            <img src="${savedData.image}" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text black-text">
                            ${savedData.category}
                        </div>
                        <div class="justify-middle">
                            <img src="img/edit.png" alt="Edit" class="edit-icon" onclick="Edit(event, '${savedData.category}');">
                        </div>
                    </div>`;
        }
    }
}


window.Edit = function (event, name) {
    event.stopPropagation();
    window.location.href = 'edit.html?category=' + name;
};

function handleFormSubmit(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const categoryInput = document.getElementById('category');

    if (fileInput.files.length === 0 || categoryInput.value.trim() === '') {
        return;
    }

    if (categoryInput.value.trim().length < 3 || categoryInput.value.trim().length > 20) {
        alert('Die Kategorie muss zwischen 3 und 20 Zeichen lang sein.');
        document.getElementById('category').value = '';
        return;
    }

    saveData(fileInput.files[0], categoryInput.value);
}


function saveData(file, category) {
    if (!Quellcode(category)) {
        const reader = new FileReader();

        reader.onloadend = function () {
            const imageData = reader.result;

            const savedData = {
                category: category,
                image: imageData
            };

            localStorage.setItem('CategoryImposterGame:' + category, JSON.stringify(savedData));
            window.location.href = 'index.html';
        };

        reader.readAsDataURL(file);
    } else {
        alert('Quellcode ist nicht erlaubt.');
        document.getElementById('category').value = '';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});



function Delete() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');

    if (category) {
        const key = 'CategoryImposterGame:' + category;
        localStorage.removeItem(key);
        window.location.href = 'index.html';
    } else {
        console.error('Kategorie nicht gefunden.');
    }
}


function AddWord() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');
    const word = document.getElementById('word').value.trim();

    if (!Quellcode(word)) {
        if (word.length > 0 && word.length < 20) {
            const key = 'CategoryImposterGame:' + category;
            const savedData = JSON.parse(localStorage.getItem(key));

            if (savedData) {
                const words = savedData.words || [];
                words.push(word);
                savedData.words = words;

                localStorage.setItem(key, JSON.stringify(savedData));
                document.getElementById('word').value = '';
                window.location.href = 'edit.html?category=' + category;
            } else {
                console.error('Kategorie nicht gefunden.');
            }
        } else {
            alert('Das Wort muss zwischen 1 und 20 Zeichen lang sein.');
            document.getElementById('word').value = '';
        }
    } else {
        alert('Quellcode ist nicht erlaubt.');
        document.getElementById('word').value = '';
    }
}

function LoadWords() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');

    if (category) {
        const key = 'CategoryImposterGame:' + category;
        const savedData = JSON.parse(localStorage.getItem(key));

        if (savedData) {
            const words = savedData.words || [];
            const wordListContainer = document.getElementById('all-words');
            wordListContainer.innerHTML = '';

            words.forEach((word, index) => {
                wordListContainer.innerHTML += `
                    <div class="align-middle">
                        ${word}
                        <svg>
                            <image xlink:href="img/delete.svg" class="delete-button" alt="Delete Icon" onclick="DeleteWord(${index})" />
                        </svg>
                    </div>
                `;
            });
        } else {
            console.error('Kategorie nicht gefunden.');
        }
    }
}


function DeleteWord(index) {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');

    if (category) {
        const key = 'CategoryImposterGame:' + category;
        const savedData = JSON.parse(localStorage.getItem(key));

        if (savedData) {
            const words = savedData.words || [];
            words.splice(index, 1);
            savedData.words = words;

            localStorage.setItem(key, JSON.stringify(savedData));
            LoadWords();
        } else {
            console.error('Kategorie nicht gefunden.');
        }
    }
}



function CheckCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');

    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.replaceState({}, '', url);

    if (category && category.length > 1) {
        if (category.includes('OWN')) {
            const SearchCategory = category.replace('OWN', 'CategoryImposterGame:');

            if (localStorage.getItem(SearchCategory) !== null) {
                const value = localStorage.getItem(SearchCategory);
                const data = JSON.parse(value);

                if (data.words && data.words.length > 5) {
                    const randomWord = data.words[Math.floor(Math.random() * data.words.length)];
                    SaveWord(randomWord);;
                } else {
                    alert('Diese Kategorie hat zu wenig Begriffe!');
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        } else {
            fetch('category.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Fehler beim Laden der JSON-Datei');
                    }
                    return response.json();
                })
                .then(data => {
                    const entry = data.find(entry => entry.name === category);

                    if (entry) {
                        const words = entry.words;
                        const randomWord = words[Math.floor(Math.random() * words.length)];
                        SaveWord(randomWord);
                    } else {
                        window.location.href = 'index.html';
                    }
                })
                .catch(error => {
                    console.error('Fehler:', error);
                });
        }
    } else {
        window.location.href = 'index.html';
    }
}


function SaveWord(name) {
    localStorage.setItem('PlayImposter', name);
}


function AddPlayer() {
    const player = document.getElementById('player');
    const inputs = player.getElementsByTagName('input');
    const count = inputs.length;


    if (count < 20) {
        const NewInput = document.createElement('input');
        NewInput.name = 'player ' + (count + 1);
        NewInput.id = 'player ' + (count + 1);
        NewInput.type = 'text';
        NewInput.placeholder = 'Spieler ' + (count + 1);
        player.appendChild(NewInput);

        const number = document.getElementById('number');
        const options = number.getElementsByTagName('option');

        if (options.length < 10) {
            const NewOption = document.createElement('option');
            NewOption.value = (options.length + 1);
            NewOption.innerText = (options.length + 1);
            number.appendChild(NewOption);
        }
    } else {
        alert('Es können keine weiteren Spieler mehr hinzugefügt werden!');
    }
}


function Next() {
    const player = document.getElementById('player');
    const textInputs = player.querySelectorAll('input[type="text"]');
    const valuesArray = Array.from(textInputs).map(input => input.value.trim());

    let hasError = false;
    const seenValues = new Set();

    valuesArray.forEach(value => {
        if (value.length === 0 || !value.length > 1) {
            hasError = true;
        }
        if (value.length > 20) {
            console.error(`Fehler: Wert "${value}" ist länger als 20 Zeichen.`);
            hasError = true;
        }

        if (seenValues.has(value)) {
            console.error(`Fehler: Wert "${value}" kommt doppelt vor.`);
            hasError = true;
        } else {
            seenValues.add(value);
        }
    });

    if (hasError) {
        alert('Es gibt Fehler in den Eingaben! Jeder Spielername muss mindestens 2 Buchstaben haben und darf nicht länger als 20 Buchstaben sein! Kein Name darf öfters vorkommen.');
    } else {
        const select = document.getElementById('number');
        const selectedValue = select.value;

        if (selectedValue >= 1 && selectedValue <= 10) {
            const playerObjects = valuesArray.map(name => ({ name, role: 'Detektiv' }));

            function getRandomIndices(arrayLength, count) {
                const indices = new Set();
                while (indices.size < count) {
                    const randomIndex = Math.floor(Math.random() * arrayLength);
                    indices.add(randomIndex);
                }
                return Array.from(indices);
            }

            const imposterIndices = getRandomIndices(playerObjects.length, selectedValue);

            imposterIndices.forEach(index => {
                playerObjects[index].role = 'Imposter';
            });

            const oldValue = localStorage.getItem('PlayImposter');
            const jsonString = JSON.stringify(playerObjects);
            localStorage.setItem('PlayImposter', oldValue + jsonString);
            window.location.href = 'role.html';
        }
    }
}


function LoadRole() {
    const input = localStorage.getItem('PlayImposter');

    const indexOfBracket = input.indexOf('[');
    term = input.substring(0, indexOfBracket);
    const jsonArrayString = input.substring(indexOfBracket);

    try {
        array = JSON.parse(jsonArrayString);
    } catch (e) {
        console.error('Fehler beim Parsen des Arrays:', e);
    }

    document.getElementById('player-name').innerText = array[0].name;
    player = 0;
}


function TurnAround() {
    const role = array[player].role;
    const card = document.querySelector('.card');
    const cardBack = document.getElementById('cardBack');


    if (role === 'Detektiv') {
        cardBack.innerText = 'Du bist ein Detektiv! Das Wort lautet: ' + term + '.';
    } else {
        cardBack.innerText = 'Du bist ein Imposter!';
    }

    card.classList.toggle('flip');
}


function NextRole() {
    player++;
    document.getElementById('player-name').innerText = array[player].name;

    if (!(array.length > player + 1)) {
        const btn = document.getElementById('btn');
        btn.innerText = 'Spiel starten';
        btn.onclick = function () {
            window.location.href = 'game.html';
        };
    }
}


function StartGame() {
    const input = localStorage.getItem('PlayImposter');

    const indexOfBracket = input.indexOf('[');
    const jsonArrayString = input.substring(indexOfBracket);

    try {
        array = JSON.parse(jsonArrayString);
    } catch (e) {
        console.error('Fehler beim Parsen des Arrays:', e);
    }

    const detectives = array.filter(person => person.role === 'Detektiv');


    if (detectives.length > 0) {
        const randomIndex = Math.floor(Math.random() * detectives.length);
        const randomDetective = detectives[randomIndex].name;
        document.getElementById('first').innerText = randomDetective + ' beginnt.';
    }

    StartGameSound();
    StartCountdown();
}


function StartCountdown() {
    let totalSeconds = 2 * 60;
    const display = document.getElementById('time');
    const alarm = document.getElementById('alarm-sound');

    const countdown = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedTime =
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        display.innerText = formattedTime;

        if (totalSeconds <= 0) {
            clearInterval(countdown);
            alarm.play();
        } else {
            totalSeconds--;
        }
    }, 1000);
}

function StartGameSound() {
    const sound = document.getElementById('start-sound');
    sound.play();
}

function Solution() {
    const input = localStorage.getItem('PlayImposter');

    const indexOfBracket = input.indexOf('[');
    term = input.substring(0, indexOfBracket);
    const jsonArrayString = input.substring(indexOfBracket);

    try {
        array = JSON.parse(jsonArrayString);
    } catch (e) {
        console.error('Fehler beim Parsen des Arrays:', e);
    }

    document.getElementById('word').innerText = 'Das Wort war "' + term + '".';

    const imposters = array
        .filter(p => p.role === 'Imposter')
        .map(p => p.name);

    let text = 'Imposter: ';

    if (imposters.length === 1) {
        text += imposters[0];
    } else if (imposters.length === 2) {
        text += imposters.join(' und ');
    } else if (imposters.length > 2) {
        const last = imposters.pop();
        text += imposters.join(', ') + ' und ' + last;
    }

    document.getElementById('imposter').innerText = text;
    localStorage.removeItem('PlayImposter');
}


window.DeleteWord = DeleteWord;
window.AddWord = AddWord;
window.Delete = Delete;
window.CheckCategory = CheckCategory;
window.AddPlayer = AddPlayer;
window.Next = Next;
window.LoadRole = LoadRole;
window.TurnAround = TurnAround;
window.NextRole = NextRole;
window.StartGame = StartGame;
window.Solution = Solution;


function Quellcode(variable) {
    return typeof variable === 'string' && (variable.includes('<') || variable.includes('>'));
}

