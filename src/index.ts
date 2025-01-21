import { Telegraf } from 'telegraf';
import {message} from 'telegraf/filters';
import dotenv from 'dotenv-safe';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a message and I\'ll echo it!'));
bot.on('text', (ctx) => ctx.reply(ctx.message.text));

bot.launch(() => {
    console.log('Bot is up and running!')
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
