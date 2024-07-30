//Section - 1 : Importing Modules
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

//Section - 2 :Creating Bot Instance
const bot = new TelegramBot("6965487856:AAGLS9kbsgvHxyFQDaiYY7RGMch5Ie2Bzmo", {
  polling: true,
});

//Section - 3 : Handling Search Function
function searchShows(query) {
  const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
    query
  )}`;
  return axios
    .get(apiUrl)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Error fetching data from TVMaze API: ${error.message}`);
    });
}

//Section - 4 : Formatting the  fetched results from the TVMaze API
function formatShowResults(shows) {
  if (shows.length === 0) {
    return "No shows found for the given query.";
  }
  let message = "Here are the matching shows:\n\n";
  shows.forEach((show) => {
    message += `[${show.show.name}](${show.show.url})\n`;
    message += `Language: ${show.show.language}\n`;
    message += `Genres: ${show.show.genres.join(", ")}\n\n`;
  });
  return message;
}

//Section - 5 : Handling Search command
bot.onText(/\/search (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  searchShows(query)
    .then((shows) => {
      const message = formatShowResults(shows);
      bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    })
    .catch((error) => {
      console.error("Error:", error.message);
      bot.sendMessage(chatId, "An error occurred while fetching show details.");
    });
});
