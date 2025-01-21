import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv-safe";
import { getCoordinatesFromLink } from "./utils/location.utils";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.start((ctx) =>
  ctx.reply(
    "Welocome! Send me a google maps link and I reply with the location. So you can use it in telegram. \n Example: https://maps.app.goo.gl/J6dgKT4WQ9yWfenQ8"
  )
);
bot.help((ctx) => ctx.reply("Send me a message and I'll echo it!"));
bot.on(message("text"), async (ctx) => {
  try {
    ctx.telegram.sendChatAction(ctx.chat.id, "find_location");
    const urls = ctx.message.text.match(/\b(?:https?:\/\/)?\S+\.\S+\b/gi);
    if (urls) {
      for (const url of urls) {
        const coordinates = await getCoordinatesFromLink(url);
        if (coordinates) {
          ctx.replyWithLocation(coordinates.lat, coordinates.lng);
        } else {
          ctx.reply("Could not extract coordinates from the URL.");
        }
      }
    } else {
      ctx.reply("No URLs found.");
    }
  } catch (error: any) {
    console.error(`Error processing message: ${error.message}`);
    ctx.reply("An error occurred while processing the message.");
  }
});

bot.launch(() => {
  console.log("Bot is up and running!");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
