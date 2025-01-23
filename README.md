# Telegram Airdrop Notification Bot

This bot monitors cryptorank.io/drophunting for new airdrops and sends notifications to subscribed users.

## Setup Instructions

1. Create a new Telegram bot:
   - Message @BotFather on Telegram
   - Use the `/newbot` command
   - Follow the instructions to create your bot
   - Save the bot token you receive

2. Configure the bot:
   - Copy your bot token into the `.env` file:
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token_here
     CHECK_INTERVAL=300000  # Check every 5 minutes (in milliseconds)
     ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Bot Commands
- `/start` - Subscribe to airdrop notifications
- `/stop` - Unsubscribe from notifications

## Features
- Monitors cryptorank.io/drophunting for new airdrops
- Sends notifications with airdrop details:
  - Name
  - Duration
  - Cost
  - Viral status
- Checks for new airdrops every 5 minutes (configurable)