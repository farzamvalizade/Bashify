const data = document.currentScript.dataset;
const loginStatus = data.login;
const usernames = data.usernames;
console.log(loginStatus)
document.getElementById('terminalToggle').addEventListener('click', function () {
    let terminal = document.getElementById('terminalCollapse');
    let footerContent = document.getElementById('footerContent');
    
    if (terminal.classList.contains('show')) {
        terminal.classList.remove('show');
        footerContent.classList.remove('hide');
    } else {
        terminal.classList.add('show');
        footerContent.classList.add('hide');
    }
});

const commands = {
    ls: {
        helpText: 'List the available URLs.',
    /**
     * Execute the ls command.
     * @returns {string} The output of the command.
     */
        execute: function() {
            return '<br>/login /signup /change_password(need login) /account ';
        }
    },
    'ls -a': {
        helpText: 'List all URLs including user-specific ones.',
        /**
         * Execute the ls -a command.
         * @returns {string} The output of the command.
         * This function renders a template string with the available URLs
         * including user-specific ones.
         */
        execute: function() {
            return `<br>/login /signup /change_password(need login) /account ${usernames}`;
        }
    },
    clear: {
        helpText: 'Clear the terminal output.',
        /**
         * Clear the terminal output.
         * @returns {string} An empty string to clear the output.
         */
        execute: function() {
            return ''; // Clear the output
        }
    },
    echo: {
        helpText: 'Display a message.',
        /**
         * Execute the echo command.
         * @param {string} message - The message to display.
         * @returns {string} The message to display.
         */
        execute: function(message) {
            return message;
        }
    },touch: {
        helpText: 'Create a new file.',
        /**
         * Execute the touch command.
         * @param {string} filename - The name of the file to create.
         * @returns {string} The output of the command.
         * If the file does not exist, it will be created.
         * If the file already exists, a message will be displayed indicating that.
         */
        execute: function (filename) {
            if (!filename) {
                return 'touch: Missing file name';
            }
            // چک کردن وجود فایل در localStorage
            if (!localStorage.getItem(filename)) {
                localStorage.setItem(filename, ''); // ایجاد فایل خالی در localStorage
                return `File '${filename}' created.`;
            } else {
                return `File '${filename}' already exists.`;
            }
        }
    },
    nano: {
        helpText: 'Edit a file with the given content. Usage: nano filename > content',
        /**
         * Execute the nano command.
         * @param {string} command - The command in the format 'nano filename > content'.
         * @returns {string} The output of the command.
         * If the file does not exist, a message will be displayed indicating that.
         * If the file already exists, its content will be updated.
         */
        execute: function(command) {
            const parts = command.split('>');
            if (parts.length === 2) {
                const filename = parts[0].trim();
                const content = parts[1].trim();
                if (filename && content) {
                    // استفاده مستقیم از localStorage برای دسترسی به فایل
                    if (localStorage.getItem(filename) !== null) {
                        localStorage.setItem(filename, content); // محتوای فایل به‌روزرسانی می‌شود
                        return `File '${filename}' has been updated.`;
                    } else {
                        return `File '${filename}' does not exist.`;
                    }
                }
            }
            return 'Please provide a command in the format: nano filename>content';
        }
    },
    cat: {
        helpText: 'Display the content of a file.',
        /**
         * Execute the cat command.
         * @param {string} filename - The name of the file to display.
         * @returns {string} The content of the file if it exists, or a message indicating that the file does not exist.
         */
        execute: function (filename) {
            if (!filename) {
                return 'cat: Missing file name';
            }
            const content = localStorage.getItem(filename);
            if (content !== null) {
                return content; // نمایش محتوای فایل
            } else {
                return `File '${filename}' not found.`;
            }
        }
    },
    roll: {
        helpText: 'Roll a dice and show a random number between 1 and 6.',
        /**
         * Execute the roll command.
         * @returns {string} A message containing a random number between 1 and 6, simulating the roll of a dice.
         */
        execute: function () {
            const randomNumber = Math.floor(Math.random() * 6) + 1; // تولید عدد تصادفی بین 1 تا 6
            return `You rolled a ${randomNumber}.`;
        }
    },
    ip_address: {
        helpText: 'Display your public IP address.',
        /**
         * Execute the ip_address command.
         * @returns {Promise<void>} A promise that is resolved when the IP address is displayed.
         * @description
         * This method fetches the public IP address from the API at https://api.ipify.org?format=json
         * and displays it with a SweetAlert2 pop-up.
         * If the fetch fails, it displays an error message.
         */
        execute: async function () {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                
                // نمایش آدرس IP با SweetAlert2
                Swal.fire({
                    title: 'Your IP Address',
                    text: `Your public IP address is: ${data.ip}`,
                    icon: 'info',
                    confirmButtonText: 'OK',
                    background: '#333',  // پس‌زمینه تیره
                    color: '#FF1493',    // رنگ متن اصلی
                    iconColor:'#FF1493',
                    customClass: {
                        title: 'custom-title', // کلاس سفارشی برای عنوان
                        content: 'custom-content' // کلاس سفارشی برای محتوا
                    }
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Unable to fetch IP address.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#333',  // پس‌زمینه تیره
                    color: '#FF1493'     // رنگ متن اصلی
                });
            }
        }
    },
    
    weather: {
        helpText: 'Get the current weather for a city. Usage: weather cityname',
        /**
         * Execute the weather command.
         * @param {string} city - The name of the city to get the weather for.
         * @returns {Promise<void>} A promise that is resolved when the weather is displayed.
         * @description
         * This method fetches the weather data from OpenWeatherMap API and displays it with a SweetAlert2 pop-up.
         * If the fetch fails, it displays an error message.
         * If the city is not found, it displays an error message.
         */
        execute: async function (city) {
            if (!city) {
                return 'weather: Missing city name';
            }
            try {
                const apiKey = '1d09d7f182749e2d58c8fa050e9db12a'; // کلید API خود را وارد کنید
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                const weatherData = await weatherResponse.json();
                const response = await fetch('/api/get-username/');
                if (response.ok) {
                    
                }
                if (weatherData.cod === 200) {
                    // نمایش اطلاعات آب و هوا با SweetAlert2
                    Swal.fire({
                        title: `Weather in ${city}`,
                        text: `Temperature: ${weatherData.main.temp}°C\nCondition: ${weatherData.weather[0].description}`,
                        icon: 'info',
                        confirmButtonText: 'OK',
                        background: '#333',  // پس‌زمینه تیره
                        color: '#FF1493',    // رنگ متن اصلی (می‌توانید این را حذف کنید چون با کلاس کنترل می‌شود)
                        iconColor: '#FF1493', // رنگ آیکون طلایی (اختیاری)
                        customClass: {
                            title: 'custom-title', // کلاس سفارشی برای عنوان
                            content: 'custom-content' // کلاس سفارشی برای محتوا
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: `Weather for ${city} not found.`,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Weather for ${city} not found.`,
                    icon: 'error',
                    iconColor: '#FF1493',
                    confirmButtonText: 'OK',
                    background: '#333',  // پس‌زمینه تیره
                    color: '#FF1493'     // رنگ متن اصلی
                });
            }
        }
    },
    date: {
        helpText: 'Display the current date and time.',
        /**
         * Execute the date command.
         * @returns {string} The current date and time in the user's locale format.
         */
        execute: function() {
            return new Date().toLocaleString();
        }
    },
    help: {
        helpText: 'Display available commands.',
        /**
         * Execute the help command.
         * @returns {string} A string containing all available commands, separated by commas.
         */
        execute: function() {
            return Object.keys(commands).map(cmd => cmd).join(', ');
        }
    },
    pwd: {
        helpText: 'Show the current URL.',
        /**
         * Execute the pwd command.
         * @returns {string} The current URL.
         */
        execute: function() {
            return window.location.href;
        }
    },
    whoami: {
        helpText: 'Display the current logged-in username.',
        /**
         * Execute the whoami command.
         * @returns {Promise<string>} A promise that is resolved with the current logged-in username if logged in, or a string indicating that the user needs to log in to use this command.
         * @description
         * This method fetches the current logged-in username from the API and returns it.
         * If the user is not logged in, it returns a message indicating that the user needs to log in to use this command.
         */
        execute: function() {
            return fetch('/api/get-username/')
                .then(response => response.json())
                .then(data => data.username ? data.username : 'Please log in to use this command.');
        }
    },
    exit: {
        helpText: 'Log out and exit the terminal.',
        /**
         * Execute the exit command.
         * @returns {Promise<string>} A promise that is resolved with a message indicating whether the logout was successful or not.
         * @description
         * This method logs out the user using the logout API and returns a message depending on the result.
         * If the user is not logged in, it returns a message indicating that the user needs to log in to use this command.
         */
        execute: function() {
            return fetch('/api/get-username/')
                .then(response => response.json())
                .then(data => {
                    if (data.username) {
                        return fetch('{% url "account:logout" %}', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': '{{ csrf_token }}'
                            },
                            body: JSON.stringify({})
                        }).then(response => {
                            return response.ok ? 'Logging out...' : 'Oops... could not log out.';
                        });
                    } else {
                        return 'Can\'t log out because you did not log in.';
                    }
                });
        }
    },
    cd: {
        helpText: 'Change directory to the specified URL.',
        /**
         * Execute the cd command.
         * @param {string} url The URL to redirect to.
         * @returns {Promise<string>} A promise that is resolved with a message indicating whether the redirection was successful or not.
         * @description
         * This method makes a HEAD request to the specified URL and redirects the user if the request is successful.
         * If the request is not successful, it returns a message indicating that the URL was not found.
         * There is a 2-second delay before the redirection.
         */
        execute: function(url) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    fetch(url, { method: 'HEAD' }).then(response => {
                        if (response.ok) {
                            window.location.href = url; // Redirect to the URL
                        } else {
                            resolve('Oops... can\'t redirect, URL not found.');
                        }
                    }).catch(() => {
                        resolve('Oops... can\'t redirect, URL not found.');
                    });
                }, 2000); // 2-second delay before redirection
            });
        }
    },
    'cd -ut': {
        helpText: 'Search a query on Google. Usage: cd -ut <query>',
        execute: function(query) {
            if (!query) {
                return 'Please provide a search query. Usage: cd -ut <query>';
            }
            
            // ساختن URL جستجو با استفاده از متن وارد شده توسط کاربر
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

            // باز کردن تب جدید با URL جستجو
            window.open(googleSearchUrl, '_blank');

            // بازگشت پیام موفقیت‌آمیز
            return `Searching Google for: ${query}`;
        }
    },

    timer: {
        helpText: 'Set a timer for the specified number of seconds.',
        /**
         * Execute the timer command.
         * @param {number} seconds The number of seconds for the timer.
         * @returns {string} A message indicating whether the timer was set successfully or not.
         * @description
         * This method sets a timer for the specified number of seconds and shows a message when the timer is done.
         * The timer is set using the setTimeout function and shows a message using the Swal.fire function.
         * If the number of seconds is not valid, it returns a message indicating that the input is invalid.
         */
        execute: function(seconds) {
            if (!isNaN(seconds) && seconds > 0) {
                setTimeout(() => {
                    Swal.fire({
                        title: 'Time\'s up!',
                        text: `Your ${seconds} seconds are over.`,
                        icon: 'info',
                        confirmButtonText: 'OK',
                        timer: 5000
                    });
                }, seconds * 1000);
                return `Timer set for ${seconds} seconds.`;
            } else {
                return 'Please provide a valid number of seconds.';
            }
        }
    },
    
    uname: {
        helpText: 'Display site information.',
        /**
         * Execute the uname command.
         * @returns {string} A string containing the current version of Bashify Terminal.
         * @description
         * This method returns the current version of Bashify Terminal.
         */
        execute: function() {
            return "Bashify Terminal version 1.1.0";
        }
    },
    cal: {
        helpText: 'Show the current month\'s calendar.',
        /**
         * Execute the cal command.
         * @returns {string} A string containing the calendar for the current month.
         * @description
         * This method shows the current month's calendar.
         * The calendar is generated using the Date object and the padStart method to generate the days of the month.
         * It also adds a newline at the end of each week.
         */
        execute: function() {
            const today = new Date();
            const month = today.getMonth();
            const year = today.getFullYear();
            let firstDay = new Date(year, month, 1).getDay();
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let calendar = "Su Mo Tu We Th Fr Sa<br>";

            for (let i = 0; i < firstDay; i++) {
                calendar += "   ";
            }

            for (let day = 1; day <= daysInMonth; day++) {
                calendar += day.toString().padStart(2, " ") + " ";
                if ((firstDay + day) % 7 === 0) {
                    calendar += "<br>";
                }
            }
            return calendar;
        }
    },
    'cd -u': {
        helpText: 'Open a specified URL in a new tab.',
        execute: function(command) {
            const url = command.split(' ')[2]; // گرفتن URL
            if (url) {
                // بررسی اینکه آیا URL شروع با http یا https باشد
                const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'http://' + url;

                // باز کردن URL در یک تب جدید
                window.open(fullUrl, '_blank');
                return `Opening ${fullUrl} in a new tab.`;
            } else {
                return 'Usage: cd -u <url>';
            }
        }
    },
    joke: {
            helpText: 'Fetch a random family-friendly joke from the Dad Jokes API and display it.',
            execute: async function() {
                try {
                    const response = await fetch('https://icanhazdadjoke.com/', {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    const data = await response.json(); // دریافت داده‌ها به صورت JSON

                    // نمایش جوک با SweetAlert2 با استایل سفارشی
                    Swal.fire({
                        title: '<span style="color: #f00;">Dad Joke</span>', // رنگ نئون قرمز برای عنوان
                        text: data.joke, // محتوای جوک
                        icon: 'info',
                        iconColor:'#FF1493',
                        background: '#000', // پس‌زمینه سیاه
                        confirmButtonText: 'Haha',
                        confirmButtonColor: '#f00', // رنگ نئون قرمز برای دکمه
                        customClass: {
                            popup: 'swal2-custom-popup', // کلاس سفارشی برای استایل کلی
                            content: 'swal2-custom-content' // کلاس سفارشی برای متن
                        }
                    });
                } catch (error) {
                    Swal.fire({
                        title: '<span style="color: #f00;">Error</span>', // رنگ نئون قرمز برای عنوان خطا
                        text: 'Unable to fetch joke at the moment.',
                        icon: 'error',
                        background: '#000', // پس‌زمینه سیاه
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#f00' // رنگ نئون قرمز برای دکمه
                    });
                }
            }
        },

        'joke -18': {
            helpText: 'Fetch a random Chuck Norris joke from an API and display it.',
            execute: async function() {
                try {
                    const response = await fetch('https://api.chucknorris.io/jokes/random'); // فراخوانی API
                    const data = await response.json(); // دریافت داده‌ها به صورت JSON

                    // نمایش جوک با SweetAlert2
                    Swal.fire({
                        title: 'Chuck Norris Joke',
                        text: data.value, // محتوای جوک
                        icon: 'info',
                        confirmButtonText: 'Laugh',
                        background: '#2c2c2c', // پس‌زمینه سیاه
                        color: '#ffcc00', // رنگ متن زرد مایل به قرمز
                        confirmButtonColor: '#ff3300' // رنگ دکمه تأیید
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Unable to fetch joke at the moment.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        background: '#2c2c2c', // پس‌زمینه سیاه
                        color: '#ffcc00', // رنگ متن زرد مایل به قرمز
                        confirmButtonColor: '#ff3300' // رنگ دکمه تأیید
                    });
                }
            }
        },


    history: {
        helpText: 'Display the history of executed commands.',
        /**
         * Execute the history command.
         * @returns {string} A string containing the history of commands entered in the terminal.
         * @description
         * This method displays the history of executed commands.
         * The history is stored in the local storage and read from there.
         * If the history is empty, it returns a message indicating that there is no history available.
         */
        execute: function() {
            const history = JSON.parse(localStorage.getItem('terminalHistory')) || [];
            return history.length > 0 ? history.join('<br>') : 'No command history available.';
        }
    }
};

const commandList = Object.keys(commands); // لیست دستورات را از شیء commands بگیر

document.getElementById('terminalInput').addEventListener('input', function (e) {
    const input = e.target.value.trim().toLowerCase();
    const suggestions = commandList.filter(cmd => cmd.startsWith(input) && input !== '');

    if (suggestions.length > 0) {
        showSuggestions(suggestions);
    } else {
        hideSuggestions();
    }
});

function showSuggestions(suggestions) {
    const suggestionBox = document.getElementById('suggestionBox');
    suggestionBox.innerHTML = suggestions.map(cmd => `<div>${cmd}</div>`).join('');
    suggestionBox.style.display = 'block'; // نمایش جعبه پیشنهادات
}

function hideSuggestions() {
    const suggestionBox = document.getElementById('suggestionBox');
    suggestionBox.style.display = 'none'; // پنهان کردن جعبه پیشنهادات
}

// انتخاب پیشنهاد با کلیک
document.getElementById('suggestionBox').addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'DIV') {
        const selectedCommand = e.target.textContent;
        document.getElementById('terminalInput').value = selectedCommand; // قرار دادن دستور انتخاب شده در ورودی
        hideSuggestions(); // پنهان کردن جعبه پیشنهادات
    }
});

const history = JSON.parse(localStorage.getItem('terminalHistory')) || [];
let historyIndex = history.length;

document.getElementById('terminalInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let command = e.target.value.trim().toLowerCase();
        let outputDiv = document.getElementById('terminalOutput');
        history.push(command);
        localStorage.setItem('terminalHistory', JSON.stringify(history));
        historyIndex = history.length;

        if (command === '') {
            e.target.value = ''; // ورودی را خالی کن
            return; // از ادامه کد جلوگیری کن
        }

        if (command.endsWith(' --help')) {
            let cmd = command.split(' ')[0];
            if (cmd in commands) {
                outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
                outputDiv.innerHTML += '<br>' + commands[cmd].helpText; // Show the help text
            } else {
                outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
                outputDiv.innerHTML += '<br>No manual entry for ' + cmd + '.';
            }
        } else if (command in commands) {
            outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
            let result;

            if (command === 'help') {
                result = commands.help.execute();
            } else if (command.startsWith('man ')) {
                let cmd = command.slice(4);
                result = commands.man.execute(cmd);
            } else if (command === 'whoami') {
                commands.whoami.execute().then(res => {
                    outputDiv.innerHTML += '<br>' + res;
                });
                e.target.value = ''; // Clear the input
                return; // Exit to prevent scrolling
            } else if (command === 'exit') {
                commands.exit.execute().then(res => {
                    outputDiv.innerHTML += '<br>' + res;
                });
                e.target.value = ''; // Clear the input
                return; // Exit to prevent scrolling
            }else if (command === 'clear') {
                outputDiv.innerHTML = ''; // Clear the terminal output
                outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command; // Optional: show the command entered
            } else if (command === 'ls -a') {
                outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
                outputDiv.innerHTML += commands['ls -a'].execute();
            }
            else if (command === 'uname') {
                outputDiv.innerHTML += '<br>' + commands.uname.execute();
            } else if (command === 'cal') {
                outputDiv.innerHTML += '<br>' + commands.cal.execute();
            } else if (command === 'history') {
                outputDiv.innerHTML += '<br>' + commands.history.execute();
            } else {
                result = commands[command].execute();
            }

            if (result && typeof result === 'string') {
                outputDiv.innerHTML += '<br>' + result;
            }
        } else if (command.startsWith('echo')) {
            
            let message = command.slice(5).trim(); // گرفتن متن بعد از echo و حذف فاصله‌های اضافی
            outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
            if (message) {
                outputDiv.innerHTML += '<br>' + commands.echo.execute(message);
            } else {
                outputDiv.innerHTML += '<br>echo: No message to display.';
            }
        }   else if (command.startsWith('cd -ut')) {
            let query = command.split(' ').slice(2).join(' '); // گرفتن کوئری جستجو
            console.log(query);
            outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
        
            if (query) {
                const result = commands['cd -ut'].execute(query); // اجرای دستور cd -ut
                outputDiv.innerHTML += `<br>${result}`; // نمایش نتیجه
            } else {
                outputDiv.innerHTML += `<br>Please provide a query after 'cd -ut'`;
            }
        }
        else if (command.startsWith('cd -u')) {
            let url = command.split(' ')[2]; // گرفتن URL
            console.log(url);
            outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
            
            if (url) {
                const result = commands['cd -u'].execute(command); // اجرای دستور cd -u
                outputDiv.innerHTML += `<br>${result}`; // نمایش نتیجه
            } else {
                outputDiv.innerHTML += `<br>Please provide a URL after 'cd -u'`;
            }
        }else if (command.includes('cd')) {
            let url = command.split(' ')[1];
            commands.cd.execute(url).then(res => {
                outputDiv.innerHTML += '<br>' + res;
            });
            e.target.value = ''; // Clear the input
            return; // Exit to prevent scrolling
        } else if (command.startsWith('timer')) {
            let seconds = command.split(' ')[1]; // زمان را به صورت عدد بگیر
            let result = commands.timer.execute(seconds); // دستور تایمر را اجرا کن
            outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
            outputDiv.innerHTML += `<br>${result}`;
        }else if (command.startsWith('touch')) {
            if (loginStatus=="true") {
                let filename = command.split(' ')[1]; // گرفتن نام فایل
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                const result = commands.touch.execute(filename); // اجرای دستور touch
                outputDiv.innerHTML += `<br>${result}`;
            }else{
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                outputDiv.innerHTML += `<br>You must login for this command`;
            }
            
        } else if (command.startsWith('nano')) {
            if (loginStatus=="true") {
                let args = command.split(' ').slice(1); // گرفتن آرگومان‌ها
                let filename = args[0]; // نام فایل
                let content = args.slice(1).join(' '); // محتوای جدید
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                const result = commands.nano.execute(filename, content); // اجرای دستور nano
                outputDiv.innerHTML += `<br>${result}`;
            }else{
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                outputDiv.innerHTML += `<br>You must login for this command`;
            }
        } else if (command.startsWith('cat')) {
            if (loginStatus=="true") {
                let filename = command.split(' ')[1]; // گرفتن نام فایل
            outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
            const result = commands.cat.execute(filename); // اجرای دستور cat
            outputDiv.innerHTML += `<br>${result}`;
            }else{
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                outputDiv.innerHTML += `<br>You must login for this command`;
            }
        } else if (command.startsWith('weather')) {
            if (loginStatus=='true') {
                let cityname = command.split(' ')[1]; // گرفتن نام فایل
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                const result = commands.weather.execute(cityname); // اجرای دستور cat
            }else{
                outputDiv.innerHTML += `<br><span>Bashify$</span> ${command}`;
                outputDiv.innerHTML += `<br>You must login for this command`;
                
            }
        }
        else {
            outputDiv.innerHTML += '<br><span>Bashify$</span> ' + command;
            outputDiv.innerHTML += '<br>Command not found: ' + command;
        }

        e.target.value = ''; // Clear the input
        outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to the bottom
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            e.target.value = history[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        if (historyIndex < history.length) {
            historyIndex++;
            e.target.value = history[historyIndex];
        }
    }
});