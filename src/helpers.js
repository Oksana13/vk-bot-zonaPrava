const Markup = require('node-vk-bot-api/lib/markup');
const kb = require ('./keyboard-buttons');
const { l10n } = require ('./constants');

module.exports = {
  debug(obj = {}) {
    return JSON.stringify(obj, null, 4);
  },

  parseText(text) {
    return text.trim().toLowerCase();
  },

  getChatId(message) {
    console.log(message)
    return message.message.id
  },

  backToMainMenu(ctx) {
    ctx.reply('Вернуться в главное меню?', null, Markup
      .keyboard(kb.backOrWebsite, { columns: 1 }),
    );
  },

  mainMenuHandler(ctx) {
    ctx.reply(l10n.chooseSection, null, Markup
      .keyboard(kb.home, { columns: 1 }),
    );
  },
};
