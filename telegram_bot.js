const axios = require('axios');
const isPalindrome = require('is-palindrome');
const TelegramBot = require('node-telegram-bot-api');
const token = '6925739578:AAGsXoGlbdnjUY-4StzTFjEsGVapaui_3K8';
const bot = new TelegramBot(token, { polling: true });
bot.on('message', function (msg) {
    console.log(msg);
});
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hello! I am Zemboi 😄", {
        "reply_markup": {
            "keyboard": [["How are you"], ["Bye"], ["Are you a bot?"]]
        }
    });
});
bot.on('message', (msg) => {
    var Hi = "How are you";
    if (msg.text.indexOf(Hi) === 0) {
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name + " I am fine and hope you are doing well");
    }
    var bye = "Bye";
    if (msg.text.includes(bye)) {
        bot.sendMessage(msg.chat.id, "Bye  " + msg.from.first_name + " Have a great day!");
    }
    var robot = "Are you a bot?";
    if (msg.text.indexOf(robot) === 0) {
        bot.sendMessage(msg.chat.id, "<b>Yeah</b> \n <i>I am</i> \n <em>a chatbot from </em> \n <a href=\"https://vishnu.edu.in/\">VITB</a> \n <code>from CSE</code> \n <pre>Department</pre>", { parse_mode: "HTML" });
    }
});
bot.on('message', (msg) => {
    var location = "location";
    if (msg.text.indexOf(location) === 0) {
        bot.sendLocation(msg.chat.id, 33.12345, -88.22235);
        bot.sendMessage(msg.chat.id, "Here is the point");
    }
});
bot.onText(/\/palindrome (.+)/, (msg, match) => {
    const text = match[1];
    const isTextPalindrome = isPalindrome(text.trim().toLowerCase());
    if (isTextPalindrome) {
        bot.sendMessage(msg.chat.id, `"${text.trim()}" is a palindrome!`);
    } else {
        bot.sendMessage(msg.chat.id, `"${text.trim()}" is not a palindrome.`);
    }
});
bot.onText(/^\/capital/, async (msg) => {
    const chatId = msg.chat.id;
    const country = msg.text.replace('/capital', '').trim();
    if (!country) {
        bot.sendMessage(chatId, "Please provide a country name with the /capital command.");
        return;
    }
    try {
        const capital = await getCapitalFromAPI(country);
        bot.sendMessage(chatId, `The capital of ${country} is ${capital}`);
    } catch (error) {
        bot.sendMessage(chatId, `Unable to find the capital for ${country}`);
    }
});
async function getCapitalFromAPI(country) {
    const apiUrl = `https://restcountries.com/v2/name/${country}?fullText=true`;
    const response = await axios.get(apiUrl);
    if (response.data.length > 0) {
        return response.data[0].capital || 'Capital not found';
    } else {
        throw new Error('Country not found');
    }
}