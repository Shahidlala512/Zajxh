document.addEventListener('DOMContentLoaded', () => {

    

    const MAX_KEYS_PER_GAME_PER_DAY = 10000;

    //const EVENTS_DELAY = 20000;



    const games = {

        1: {
            name: 'ZooPolis',
            appToken: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            promoId: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            eventsDelay: 21000,
            attemptsNumber: 23,
	},

        2: {

            name: 'Chain Cube 2048',

            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',

            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',

            eventsDelay: 20000,

            attemptsNumber: 15

        },

        3: {

            name: 'My Clone Army',

            appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',

            promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',

            eventsDelay: 120000,

            attemptsNumber: 15,

        },

        4: {

            name: 'Train Miner',

            appToken: '82647f43-3f87-402d-88dd-09a90025313f',

            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',

            eventsDelay: 20000,

            attemptsNumber: 15,

        },

        5: {

            name: 'MergeAway',

            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',

            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',

            eventsDelay: 20000,

            attemptsNumber: 15,

        },

        6: {

            name: 'Twerk Race 3D',

            appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',

            promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',

            eventsDelay: 20000,

            attemptsNumber: 15,

            

        },

         7 : {

            name: 'Polysphere',

            appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',

            promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',

            eventsDelay: 20000,

            attemptsNumber: 16,

         },
        8: {
            name: 'Mow and Trim',
            appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            eventsDelay: 21000,
            attemptsNumber: 15,
            
	},
        9: {
            name: 'Gangs Wars',
            appToken: 'b6de60a0-e030-48bb-a551-548372493523',
            promoId: 'c7821fa7-6632-482c-9635-2bd5798585f9',
            eventsDelay: 40000,
            attemptsNumber: 20,
            
	},
        3: {
            name: 'Cafe Dash',
            appToken: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            promoId: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            eventsDelay: 23000,
            attemptsNumber: 16,
        },
    };





    const startBtn = document.getElementById('startBtn');

    const keyCountSelect = document.getElementById('keyCountSelect');

    const keyCountLabel = document.getElementById('keyCountLabel');

    const progressContainer = document.getElementById('progressContainer');

    const progressBar = document.getElementById('progressBar');

    const progressText = document.getElementById('progressText');

    const progressLog = document.getElementById('progressLog');

    const keyContainer = document.getElementById('keyContainer');

    const keysList = document.getElementById('keysList');

    const copyAllBtn = document.getElementById('copyAllBtn');

    const generatedKeysTitle = document.getElementById('generatedKeysTitle');

    const gameSelect = document.getElementById('gameSelect');

    const copyStatus = document.getElementById('copyStatus');

    const previousKeysContainer = document.getElementById('previousKeysContainer');

    const previousKeysList = document.getElementById('previousKeysList');

    const telegramChannelBtn = document.getElementById('telegramChannelBtn');



    //for logs

    const logMessage = (message) => {

        const logArea = document.getElementById('logArea');

        const logCheckbox = document.getElementById('logCheckbox');

    

        if (logCheckbox.checked) {

            logArea.style.display = 'block'; // Show the textarea if logs are enabled

            logArea.value += message + '\n';

            logArea.scrollTop = logArea.scrollHeight; // Auto-scroll to the bottom

        }

    };

    

    document.getElementById('logCheckbox').addEventListener('change', (event) => {

        const logArea = document.getElementById('logArea');

        if (event.target.checked) {

            logArea.style.display = 'block'; // Show the textarea when the checkbox is checked

        } else {

            logArea.style.display = 'none';  // Hide the textarea when the checkbox is unchecked

        }

    });



    const initializeLocalStorage = () => {

        const now = new Date().toISOString().split('T')[0];

        Object.values(games).forEach(game => {

            const storageKey = `keys_generated_${game.name}`;

            const storedData = JSON.parse(localStorage.getItem(storageKey));

            if (!storedData || storedData.date !== now) {

                localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 0, keys: [] }));

            }

        });

    };



    const generateClientId = () => {

        const timestamp = Date.now();

        const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');

        return `${timestamp}-${randomNumbers}`;

    };



    const login = async (clientId, appToken) => {

        const response = await fetch('https://api.gamepromo.io/promo/login-client', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                appToken,

                clientId,

                clientOrigin: 'deviceid'

            })

        });



        if (!response.ok) {

            throw new Error('Failed to login');

        }



        const data = await response.json();

        return data.clientToken;

    };



    const emulateProgress = async (clientToken, promoId) => {

        const response = await fetch('https://api.gamepromo.io/promo/register-event', {

            method: 'POST',

            headers: {

                'Authorization': `Bearer ${clientToken}`,

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                promoId,

                eventId: generateUUID(),

                eventOrigin: 'undefined'

            })

        });



        if (!response.ok) {

            return false;

        }



        const data = await response.json();

        return data.hasCode;

    };



    const generateKey = async (clientToken, promoId) => {

        const response = await fetch('https://api.gamepromo.io/promo/create-code', {

            method: 'POST',

            headers: {

                'Authorization': `Bearer ${clientToken}`,

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                promoId

            })

        });



        if (!response.ok) {

            throw new Error('Failed to generate key');

        }



        const data = await response.json();

        return data.promoCode;

    };



    const generateUUID = () => {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);

        });

    };



    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));



    const delayRandom = () => Math.random() / 3 + 1;



    initializeLocalStorage();



    startBtn.addEventListener('click', async () => {

        const gameChoice = parseInt(gameSelect.value);

        const keyCount = parseInt(keyCountSelect.value);

        const game = games[gameChoice];



        const storageKey = `keys_generated_${game.name}`;

        const storedData = JSON.parse(localStorage.getItem(storageKey));



        if (storedData.count + keyCount > MAX_KEYS_PER_GAME_PER_DAY) {

            alert(`You can generate only ${MAX_KEYS_PER_GAME_PER_DAY - storedData.count} more keys for ${game.name} today.`);

            previousKeysList.innerHTML = storedData.keys.map(key =>

                `<div class="key-item">

                    <input type="text" value="${key}" readonly>

                </div>`

            ).join('');

            previousKeysContainer.classList.remove('hidden');

            return;

        }



        keyCountLabel.innerText = `Number of keys: ${keyCount}`;



        progressBar.style.width = '0%';

        progressText.innerText = '0%';

        progressLog.innerText = 'Starting... \n Please wait It may take upto 1 min to Login';

        progressContainer.classList.remove('hidden');

        keyContainer.classList.add('hidden');

        generatedKeysTitle.classList.add('hidden');

        keysList.innerHTML = '';

        keyCountSelect.classList.add('hidden');

        gameSelect.classList.add('hidden');

        startBtn.classList.add('hidden');

        copyAllBtn.classList.add('hidden');

        startBtn.disabled = true;



        let progress = 0;

        const updateProgress = (increment, message) => {

            progress += increment;

            progressBar.style.width = `${progress}%`;

            progressText.innerText = `${progress}%`;

            progressLog.innerText = message;

        };

    



    const generateKeyProcess = async () => {

    const clientId = generateClientId();

    let clientToken;

    try {

        clientToken = await login(clientId, game.appToken);

    } catch (error) {

        alert(`Failed to login: ${error.message}`);

        startBtn.disabled = false;

        return null;

    }

    for (let i = 0; i < game.attemptsNumber; i++) {

        logMessage(`Attempt ${i + 1}: Sending request...`);

    

        let countdown = game.eventsDelay / 1000;

        const countdownContainer = document.getElementById('countdownContainer');

        const countdownTimer = document.getElementById('countdownTimer');

    

        countdownContainer.style.display = 'block';

        countdownTimer.textContent = countdown;

    

        const countdownInterval = setInterval(() => {

            countdown -= 1;

            countdownTimer.textContent = countdown;

    

            if (countdown <= 0) {

                clearInterval(countdownInterval);

            }

        }, 1000);

    

        await sleep(game.eventsDelay * delayRandom());

    

        clearInterval(countdownInterval);

        countdownContainer.style.display = 'none';

    

        const hasCode = await emulateProgress(clientToken, game.promoId);

        updateProgress(((100 / game.attemptsNumber) / keyCount), 'Emulating progress...');

    

        if (hasCode) {

            logMessage(`Attempt ${i + 1}: Request success. Code received.`);

            break;

        } else {

            logMessage(`Attempt ${i + 1}: Request failed. No code received.`);

        }

    }

    

    try {

        logMessage('Generating the key...');

        const key = await generateKey(clientToken, game.promoId);

        logMessage('Key generation successful.');

        updateProgress(30 / keyCount, 'Generating key...');

        return key;

    } catch (error) {

        logMessage(`Key generation failed: ${error.message}`);

        alert(`Failed to generate key: ${error.message}`);

        return null;

    }

};





        const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));



        if (keys.length > 1) {

            keysList.innerHTML = keys.filter(key => key).map(key =>

                `<div class="key-item">

                    <input type="text" value="${key}" readonly>

                    <button class="copyKeyBtn" data-key="${key}">Copy Key</button>

                </div>`

            ).join('');

            copyAllBtn.classList.remove('hidden');

        } else if (keys.length === 1) {

            keysList.innerHTML =

                `<div class="key-item">

                    <input type="text" value="${keys[0]}" readonly>

                    <button class="copyKeyBtn" data-key="${keys[0]}">Copy Key</button>

                </div>`;

        }



        storedData.count += keys.filter(key => key).length;

        storedData.keys.push(...keys.filter(key => key));

        localStorage.setItem(storageKey, JSON.stringify(storedData));



        keyContainer.classList.remove('hidden');

        generatedKeysTitle.classList.remove('hidden');

        document.querySelectorAll('.copyKeyBtn').forEach(button => {

            button.addEventListener('click', (event) => {

                const key = event.target.getAttribute('data-key');

                navigator.clipboard.writeText(key).then(() => {

                    copyStatus.innerText = `Copied ${key}`;

                    setTimeout(() => {

                        copyStatus.innerText = '';

                    }, 2000);

                }).catch(err => {

                    console.error('Could not copy text: ', err);

                });

            });

        });



        startBtn.disabled = false;

        keyCountSelect.classList.remove('hidden');

        gameSelect.classList.remove('hidden');

        startBtn.classList.remove('hidden');

    });



    copyAllBtn.addEventListener('click', () => {

        const allKeys = Array.from(document.querySelectorAll('.key-item input')).map(input => input.value).join('\n');

        navigator.clipboard.writeText(allKeys).then(() => {

            copyStatus.innerText = 'All keys copied';

            setTimeout(() => {

                copyStatus.innerText = '';

            }, 2000);

        }).catch(err => {

            console.error('Could not copy text: ', err);

        });

    });



    document.getElementById('creatorChannelBtn').addEventListener('click', () => {

        (function() {

            const part1 = atob('aHR0cHM6Ly90ZWxlZ3JhbS5tZS8=');

            const part2 = atob('U2FtX0RtX2JvdA==');

            const url = part1 + part2;

            window['open'](url, '_blank');

        })();

        

    });



    telegramChannelBtn.addEventListener('click', () => {

        (function() {

            const part1 = atob('aHR0cHM6Ly90ZWxlZ3JhbS5tZS8=');

            const part2 = atob('SW5zdGFfQnV5X0ZvbGxvd2Vy');

            const url = part1 + part2;

            window['open'](url, '_blank');

        })();

        

    });



    document.getElementById('ShowKeysBtn').addEventListener('click', () => {

        const generatedCodesContainer = document.getElementById('generatedCodesContainer');

        const generatedCodesList = document.getElementById('generatedCodesList');

        generatedCodesList.innerHTML = ''; // Clear the list



        let codesGeneratedToday = [];



        Object.keys(games).forEach(key => {

            const game = games[key];

            const storageKey = `keys_generated_${game.name}`;

            const storedData = JSON.parse(localStorage.getItem(storageKey));



            if (storedData && storedData.keys && storedData.keys.length > 0) {

                codesGeneratedToday = codesGeneratedToday.concat(storedData.keys.map(code => {

                    return `<li>${game.name}: ${code}</li>`;

                }));

            }

        });



        if (codesGeneratedToday.length > 0) {

            generatedCodesList.innerHTML = codesGeneratedToday.join('');

        } else {

            generatedCodesList.innerHTML = '<li>No codes generated today.</li>';

        }



        generatedCodesContainer.style.display = 'block';

    });



    

});