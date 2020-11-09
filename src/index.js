require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const VkBot = require('node-vk-bot-api');
const Markup = require('node-vk-bot-api/lib/markup');
const mapJson = require('./map.json');
const { parseText } = require('./helpers');

const {
  instructionsHandler,
  onShowInstruction_1,
  onShowInstruction_2,
  onShowInstruction_3,
  onShowInstruction_4,
} = require('./instructions');
const { helpMapHandler, showFederalCenters, showFederalCentersBtn } = require('./helpMap');
const kb = require ('./keyboard-buttons');
const { mainMenuHandler } = require ('./helpers');
const { analytics } = require ('./analytics');
const { l10n } = require ('./constants');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
})
const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
});

app.post('/', bot.webhookCallback);
app.listen(process.env.PORT);
const offerText =
`Юристы «Зоны права» специализируются на теме домашнего насилия и помогут вам бесплатно.

1. Проведем юридическую консультацию.
2. Подготовим процессуальные документы.
3. Представляем интересы пострадавших на этапе предварительного следствия и в суде.

Позвоните по телефону:
+7 926 648-85-22.
Напишите письмо:
info.zonaprava@gmail.com.`

function mapResultHtml (centers) {
  return centers.map((item, index) => {
    return `${index + 1}. ${item.title}
      ${item.contacts}
    `
  }).join('\n');
}

// start bot
bot.command(l10n.start, async ctx => {
  try {
    // analytics('/start', 'Главное меню');
    mainMenuHandler(ctx);
  } catch (error) {
    console.error('Ошибка при открытии начального экрана', error);
  }
});

const REGION_REG_EXP = /^[а-яА-ЯЁё0-9 ]+$/;

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
          helpMapHandler(ctx, bot);
          break;
        case l10n.legalHelp:
          ctx.reply(offerText, null, Markup
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
          onShowInstruction_1(ctx, 1);
          break;
        case l10n.INSTRUCTION_1_PART_2:
          onShowInstruction_1(ctx, 2);
          break;
        case l10n.INSTRUCTION_1_PART_3:
          onShowInstruction_1(ctx, 3);
          break;
        case l10n.INSTRUCTION_2:
          onShowInstruction_2(ctx, 1);
          break;
        case l10n.INSTRUCTION_2_PART_2:
          onShowInstruction_2(ctx, 2);
          break;
        case l10n.INSTRUCTION_3:
          onShowInstruction_3(ctx, 1);
          break;
        case l10n.INSTRUCTION_3_PART_2:
          onShowInstruction_3(ctx, 2);
          break;
        case l10n.INSTRUCTION_4:
          onShowInstruction_4(ctx);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Ошибка при команде ${buttonType}`, error);
    }
  } else if (REGION_REG_EXP.test(message.body)){
    // searchRegion(message.body, bot);
    const text = message.body;
    const requestStringArr = text.split(' ');

    // eventAnalytics('Карта помощи', requestStringArr);
    // search for requested region
    let regionCenters = text
      ? mapJson.filter((item) => {
        return Number(item.regionNumber) === Number(text)
      || (item.regionName && parseText(item.regionName) === parseText(text))
      || (item.regionNameSecondary && parseText(item.regionNameSecondary) === parseText(text))
      || requestStringArr.find((requestedVal => {
        return Number(item.regionNumber) === Number(requestedVal)
          || (item.regionName && parseText(item.regionName) === parseText(requestedVal))
          || (item.regionNameSecondary && parseText(item.regionNameSecondary) === parseText(requestedVal))
      }))
      }) : [];

    // if we have data for requested region map the data and send to user
    if (regionCenters.length) {
      const html = mapResultHtml(regionCenters);

      await ctx.reply(`
        Результаты по региону ${text}:
        ${html}
      `);

      // Show button for search federal centers

      showFederalCentersBtn(ctx);
    } else {
      // bot.removeTextListener(REGION_REG_EXP);
      // console.log(ctx);
      await ctx.reply(`К сожалению в данном регионе нет кризисных центров.
        Возможно, вы сделали ошибку в написании или ввели название города.
        Введите номер или название региона.`)

      showFederalCentersBtn(ctx);
    }
  }
});
