const Markup = require('node-vk-bot-api/lib/markup');
const { l10n } = require ('./constants');

const backButton = [
  Markup.button({
    action: {
      type: 'text',
      label: l10n.backButton,
      payload: JSON.stringify({
        button: l10n.start,
      }),
    },
    color: 'primary',
  }),
];
const helpMap = [
  Markup.button({
    action: {
      type: 'text',
      label:  l10n.newSearch,
      payload: JSON.stringify({
        button: l10n.helpMap,
      }),
    },
  }),
];

module.exports = {
  home: [
    l10n.instructions,
    l10n.legalHelp,
    l10n.helpMap,
  ],

  federalCenters: [
    [
      Markup.button({
        action: {
          type: 'text',
          label: l10n.federalCenters,
          payload: JSON.stringify({
            button: l10n.federalCenters,
          }),
        },
      }),
    ],
    helpMap,
    backButton,
  ],

  backOrWebsite: [
    [
      Markup.button({
        action: {
          type: 'open_link',
          link: 'https://zonaprava.com/?utm_source=vk',
          label: l10n.webSite,
          payload: JSON.stringify({
            url: 'https://zonaprava.com/?utm_source=vk',
          }),
        },
      }),
    ],
    backButton,
  ],

  backAndSearch: [
    helpMap,
    backButton,
  ],

  instructions: [
    [
      Markup.button(l10n.INSTRUCTION_1),
    ],
    [
      Markup.button(l10n.INSTRUCTION_2),
    ],
    [
      Markup.button(l10n.INSTRUCTION_3),
    ],
    [
      Markup.button(l10n.INSTRUCTION_4),
    ],
    backButton,
  ],

  backButton: backButton,

  backToInstructions: [
    Markup.button({
      action: {
        type: 'text',
        label:  l10n.backToInstructions,
        payload: JSON.stringify({
          button: l10n.instructions,
        }),
      },
    }),
  ],
}