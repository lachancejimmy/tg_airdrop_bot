const TelegramBot = require('node-telegram-bot-api');

// Remplacez par votre token
const token = "7686392366:AAHsjGJNR-7nMokfVSDYr1rIYU2xgg1lQy0";

// Créez le bot en mode polling
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! I'm alive!");
});

console.log("Bot is running...");