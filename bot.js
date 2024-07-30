const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, collection, addDoc} = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json'); 
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const bot = new TelegramBot('6965487856:AAGLS9kbsgvHxyFQDaiYY7RGMch5Ie2Bzmo', { polling: true });

bot.onText(/\/search (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  searchShows(query)
    .then((shows) => {
      const message = formatShowResults(shows);
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

      storeMessage(msg, message);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      bot.sendMessage(chatId, 'An error occurred while fetching show details.');
    });
});

function searchShows(query) {
  const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
  return axios.get(apiUrl)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`Error fetching data from TVMaze API: ${error.message}`);
    });
}

function formatShowResults(shows) {
  if (shows.length === 0) {
    return 'No shows found for the given query.';
  }
  let message = 'Here are the matching shows:\n\n';
  shows.forEach((show) => {
    message += `[${show.show.name}](${show.show.url})\n`;
    message += `Language: ${show.show.language}\n`;
    message += `Genres: ${show.show.genres.join(', ')}\n\n`;
  });
  return message;
}

async function storeMessage(msg, formattedMessage) {
  const chatId = msg.chat.id;

  try {
    db.collection('message').add( {
        
      chatId: chatId,
      text: msg.text,
      formattedMessage: formattedMessage,
    });

    
  } catch (error) {
    console.error('Error storing message in Firestore: ', error.message);
  }
}
bot.onText(/\/retrieve/, async (msg) => {
    const chatId = msg.chat.id;
  
    try {
    db.collection('message').where('chatId', '==', msg.from.id).get().then((docs)=>{
        docs.forEach((doc) => {
              bot.sendMessage(msg.chat.id, doc.data().text + " " )
            });
      })
    } catch (error) {
      console.error('Error retrieving messages from Firestore: ', error.message);
      bot.sendMessage(chatId, 'An error occurred while retrieving the messages.');
    }
  });
  