const mapJson = require('./map.json');
const { parseText } = require('./helpers');
const { analytics, eventAnalytics } = require ('./analytics');
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

module.exports = {
  async helpMapHandler(ctx) {
    // analytics('/helpmap', 'Карта помощи');
    try {
      await ctx.reply('Укажите название или номер вашего региона');
    } catch (error) {
      console.error('Ошибка во время обработки кнопки карты помощи', error);
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

  showFederalCentersBtn (bot) {
    bot.reply(`Просмотреть федеральные кризисные центры?`, null, Markup
      .keyboard(kb.federalCenters, { columns: 1 }),
    )
  },
};