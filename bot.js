require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

// Initialize bot with your token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Store active users and last seen airdrops
const activeUsers = new Set();
let lastSeenAirdrops = new Set();

// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  activeUsers.add(chatId);
  bot.sendMessage(chatId, 'Welcome! You will now receive notifications about new airdrops');
});

// Stop command handler
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  activeUsers.delete(chatId);
  bot.sendMessage(chatId, 'You have unsubscribed from airdrop notifications.');
});

async function scrapeAirdrops() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.cryptorank.io/drophunting');

    // Wait for the airdrops to load
    await page.waitForSelector('.airdrops-list');

    const airdrops = await page.evaluate(() => {
      const airdropElements = document.querySelectorAll('.airdrop-item');
      return Array.from(airdropElements).map(element => {
        return {
          name: element.querySelector('.airdrop-name')?.textContent?.trim() || 'Unknown',
          duration: element.querySelector('.duration')?.textContent?.trim() || 'Unknown',
          cost: element.querySelector('.cost')?.textContent?.trim() || 'Free',
          isViral: element.querySelector('.viral-badge') !== null
        };
      });
    });

    await browser.close();
    return airdrops;
  } catch (error) {
    console.error('Error scraping airdrops:', error);
    return [];
  }
}

async function checkForNewAirdrops() {
  const airdrops = await scrapeAirdrops();
  
  // Check for new airdrops
  airdrops.forEach(airdrop => {
    const airdropKey = `${airdrop.name}-${airdrop.duration}-${airdrop.cost}`;
    
    if (!lastSeenAirdrops.has(airdropKey)) {
      // New airdrop found, notify all active users
      const message = `🚨 New Airdrop Alert! 🚨\n\n` +
        `Name: ${airdrop.name}\n` +
        `Duration: ${airdrop.duration}\n` +
        `Cost: ${airdrop.cost}\n` +
        `Viral: ${airdrop.isViral ? '✅' : '❌'}\n\n` +
        `Check it out at: https://www.cryptorank.io/drophunting`;

      activeUsers.forEach(chatId => {
        bot.sendMessage(chatId, message);
      });
    }
  });

  // Update last seen airdrops
  lastSeenAirdrops = new Set(airdrops.map(airdrop => 
    `${airdrop.name}-${airdrop.duration}-${airdrop.cost}`
  ));
}

// Check for new airdrops periodically
const checkInterval = parseInt(process.env.CHECK_INTERVAL) || 300000; // Default 5 minutes
setInterval(checkForNewAirdrops, checkInterval);

console.log('Telegram bot is running...');