const TelegramBot = require('node-telegram-bot-api');
const isPrime = require('is-prime');
const token = '5996800481:AAECYGwDV1tNGML85pDkzZVAoK57KXzaQ94'; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello! Please give a number to check if it is prime.");
});

bot.on('message', (msg) => {
  console.log('Received message:', msg.text);

  // Skip prime number check if the message starts with "/start"
  if (msg.text.startsWith('/start')) {
    return;
  }

  const text = msg.text.trim();
  if (!isNaN(text) && isPrime(parseInt(text))) {
    console.log('Yes, the number is prime.');
    bot.sendMessage(msg.chat.id, "Yes, the number is prime.");
  } else {
    console.log('No, the number is not prime.');
    bot.sendMessage(msg.chat.id, "No, the number is not prime.");
  }
});
