const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6397404181:AAHNizqCWYLqhdsC6up7DQz9_LcP4L5osW4';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async function (msg) {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
        const joke = response.data;

        // Check if the joke is not empty before sending it
        if (joke && joke.joke) {
            
            bot.sendMessage(msg.chat.id, joke.joke);
        } else {
            console.error('Empty or invalid joke response');
            bot.sendMessage(msg.chat.id, 'Error fetching joke. Please try again later.');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(msg.chat.id, 'Error fetching joke. Please try again later.');
    }
});
