const Markup = require('node-vk-bot-api/lib/markup');
const kb = require ('./keyboard-buttons');
const { l10n } = require ('./constants');

module.exports = {
  parseText(text) {
    return text.trim().toLowerCase();
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
