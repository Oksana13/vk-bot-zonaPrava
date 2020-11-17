const mapJson = require('./map.json');
const { parseText } = require('./helpers');
const { eventAnalytics } = require ('./analytics');
const kb = require ('./keyboard-buttons');
const Markup = require('node-vk-bot-api/lib/markup');

function mapResultHtml (centers) {
  return centers.map((item, index) => {
    return `
      ${index + 1}. ${item.title}
      ${item.contacts}
      `
  }).join('\n');
}

function showFederalCentersBtn (ctx) {
  ctx.reply(`Просмотреть федеральные кризисные центры?`, null, Markup
    .keyboard(kb.federalCenters, { columns: 1 }),
  )
}

function matchRequest(requestText, mappedText) {
  return Number(mappedText.regionNumber) === Number(requestText)
    || (mappedText.regionName && parseText(mappedText.regionName) === parseText(requestText))
    || (mappedText.regionNameSecondary && parseText(mappedText.regionNameSecondary) === parseText(requestText));
}

module.exports = {
  async searchRegion(text, ctx) {
    const requestStringArr = text.split(' ');

    eventAnalytics('Карта помощи', requestStringArr);
    // search for requested region
    let regionCenters = text
      ? mapJson.filter((item) => {
        return matchRequest(text, item)
          || requestStringArr.find((requestedVal => {
            return matchRequest(requestedVal, item);
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
      await ctx.reply(`К сожалению в данном регионе нет кризисных центров.
        Возможно, вы сделали ошибку в написании или ввели название города.
        Введите номер или название региона.`)

      showFederalCentersBtn(ctx);
    }
  },

  async showFederalCenters(ctx) {
    const federalCenters = mapJson.filter((item) => {
      return item.regionNumber === 0;
    });
    const html = mapResultHtml(federalCenters);

    await ctx.reply(html);
    ctx.reply(`Вернуться в главное меню?`, null, Markup
      .keyboard(kb.backAndSearch, { columns: 1 }),
    )
  },
};