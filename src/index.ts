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
bot.help((ctx) => ctx.reply(`
Send me a google maps link and I reply with the location. So you can use it in telegram. 
Examples: 
- If you clicked on the Share button in Google Maps: https://maps.app.goo.gl/J6dgKT4WQ9yWfenQ8
- If you copy the url from the browser URL: https://www.google.com/maps/place/Butembo,+Democratic+Republic+of+the+Congo/@0.124411,29.1492715,12z/data=!3m1!4b1!4m12!1m5!3m4!2zMzXCsDQxJzE3LjAiTiA1MsKwMzcnNTIuOSJF!8m2!3d35.688062!4d52.631363!3m5!1s0x17602e28e2ecd1b7:0x68163c8279330245!8m2!3d0.114047!4d29.3018011!16zL20vMDY1NWd2?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D
- If you copy the url from the browser without any place selected: https://www.google.com/maps/@58.70376,-114.5576505,5z?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D
- If you copy the url from the browser in direction mode: https://www.google.com/maps/dir/Hotel+Apex/''/@21.9473881,96.1044432,14z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x30cb6da5a7a162ad:0xc5b6da638f8313fb!2m2!1d96.1184119!2d21.9674606!1m5!1m1!1s0x30cb73c2d08d82d5:0xe51b9416d28bfba8!2m2!1d96.1325736!2d21.9274138!3e0?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D
    `));
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
    ctx.reply(error.message);
  }
});

bot.launch(() => {
  console.log("Bot is up and running!");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
