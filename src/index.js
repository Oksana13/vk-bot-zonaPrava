require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const VkBot = require('node-vk-bot-api');
const Markup = require('node-vk-bot-api/lib/markup');
const Session = require('node-vk-bot-api/lib/session');
const Stage = require('node-vk-bot-api/lib/stage');
const Scene = require('node-vk-bot-api/lib/scene');

const { instructionsHandler, showInstruction } = require('./instructions');
const { showFederalCenters, searchRegion } = require('./helpMap');
const kb = require ('./keyboard-buttons');
const { mainMenuHandler } = require ('./helpers');
const { analytics } = require ('./analytics');
const { l10n } = require ('./constants');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
});

app.post('/', bot.webhookCallback);
app.listen(process.env.PORT);

// start bot
bot.command(l10n.start, async ctx => {
  try {
    analytics('/start', 'Первое посещение бота');
    mainMenuHandler(ctx);
  } catch (error) {
    console.error('Ошибка при открытии начального экрана', error);
  }
});

// handle region search
try {
  const session = new Session();
  const scene = new Scene('helpMap',
    (ctx) => {
      ctx.scene.next();
      ctx.reply('Укажите название или номер вашего региона');
    },
    (ctx) => {
      const message = ctx.message.body;

      searchRegion(message, ctx);
      ctx.scene.leave();
    });
  const stage = new Stage(scene);

  bot.use(session.middleware());
  bot.use(stage.middleware());
} catch (error) {
  console.error('Ошибка во время обработки кнопки карты помощи', error);
}

bot.event('message_new', async (ctx) => {
  const { message } = ctx;

  if (message && message.payload){
    const { payload } = message;
    const buttonType = JSON.parse(payload).button;
    try {
      switch (buttonType) {
        case l10n.start:
          mainMenuHandler(ctx);
          break;
        case l10n.helpMap:
          analytics('/helpmap', 'Карта помощи');
          ctx.scene.enter('helpMap');
          break;
        case l10n.newSearch:
          ctx.scene.enter('helpMap');
          break;
        case l10n.legalHelp:
          analytics('/legalhelp', 'Помощь юристов');
          ctx.reply(l10n.offerText, null, Markup
            .keyboard(kb.backOrWebsite, { columns: 1 }),
          );
          break;
        case l10n.instructions:
          instructionsHandler(ctx);
          break;
        case l10n.federalCenters:
          showFederalCenters(ctx);
          break;
        case l10n.INSTRUCTION_1:
          showInstruction(ctx, 1, 1);
          break;
        case l10n.INSTRUCTION_1_PART_2:
          showInstruction(ctx, 1, 2);
          break;
        case l10n.INSTRUCTION_1_PART_3:
          showInstruction(ctx, 1, 3);
          break;
        case l10n.INSTRUCTION_2:
          showInstruction(ctx, 2, 1);
          break;
        case l10n.INSTRUCTION_2_PART_2:
          showInstruction(ctx, 2, 2);
          break;
        case l10n.INSTRUCTION_3:
          showInstruction(ctx, 3, 1);
          break;
        case l10n.INSTRUCTION_3_PART_2:
          showInstruction(ctx, 3, 2);
          break;
        case l10n.INSTRUCTION_4:
          showInstruction(ctx, 4);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Ошибка при команде ${buttonType}`, error);
    }
  }
});
