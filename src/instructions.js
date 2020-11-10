const Markup = require('node-vk-bot-api/lib/markup');
const { l10n, instructions } = require ('./constants');
const kb = require ('./keyboard-buttons');
const { analytics } = require ('./analytics');

const LINKS = {
  SAFETY_PLAN: 'https://zonaprava.com/domestic-violence/instructions/safe-plan.php',
  PHISICAL_VIOLENCE: 'https://zonaprava.com/domestic-violence/instructions/physical-violence.php',
  SEXUAL_VIOLENCE: 'https://zonaprava.com/domestic-violence/instructions/sexualized-violence.php',
  RULES_SENDING_APPLICATION: 'https://zonaprava.com/domestic-violence/instructions/correct-application.php',
};

function linkToSite(link) {
  return [
    Markup.button({
      action: {
        type: 'open_link',
        link: link,
        label: l10n.openInstructionOnSite,
        payload: JSON.stringify({
          url: link,
        }),
      },
    }),
  ]
}

function continueReading(button) {
  return [
    Markup.button({
      action: {
        type: 'text',
        label:  l10n.continue,
        payload: JSON.stringify({
          button,
        }),
      },
    }),
  ]
}

function instructionKeyboard(link, button) {
  const defaultBns = [
    kb.backToInstructions,
    linkToSite(link),
    kb.backButton,
  ];

  if (button) {
    return [
      continueReading(button),
      ...defaultBns,
    ]
  } else {
    return defaultBns
  }
}

function reply(ctx, text, link, part) {
  ctx.reply(text, null, Markup
    .keyboard(
      instructionKeyboard(link, part),
    ),
  );
}

function showInstructionOne(ctx, instructionPart) {
  switch (instructionPart) {
    case 1:
      reply(ctx, instructions.INSTRUCTION_1_PART_1, LINKS.SAFETY_PLAN, l10n.INSTRUCTION_1_PART_2);
      break;

    case 2:
      reply(ctx, instructions.INSTRUCTION_1_PART_2, LINKS.SAFETY_PLAN, l10n.INSTRUCTION_1_PART_3);
      break;

    case 3:
      reply(ctx, instructions.INSTRUCTION_1_PART_3, LINKS.SAFETY_PLAN);
      break;

    default:
      break;
  }
}

function showInstructionTwo(ctx, instructionPart) {
  switch (instructionPart) {
    case 1:
      reply(ctx, instructions.INSTRUCTION_2_PART_1, LINKS.PHISICAL_VIOLENCE, l10n.INSTRUCTION_2_PART_2);
      break;

    case 2:
      reply(ctx, instructions.INSTRUCTION_2_PART_2, LINKS.PHISICAL_VIOLENCE);
      break;

    default:
      break;
  }
}

function showInstructionThree(ctx, instructionPart) {
  switch (instructionPart) {
    case 1:
      reply(ctx, instructions.INSTRUCTION_3_PART_1, LINKS.SEXUAL_VIOLENCE, l10n.INSTRUCTION_3_PART_2);
      break;

    case 2:
      reply(ctx, instructions.INSTRUCTION_3_PART_2, LINKS.SEXUAL_VIOLENCE);
      break;

    default:
      break;
  }
}

function showInstructionFour(ctx) {
  reply(ctx, instructions.INSTRUCTION_4, LINKS.RULES_SENDING_APPLICATION);
}

module.exports = {
  async instructionsHandler (ctx) {
    analytics('/instructions', 'Инструкции');
    ctx.reply('Выберите инструкцию:', null, Markup
      .keyboard(kb.instructions, { columns: 1 }),
    );
  },

  showInstruction(ctx, instructionNumber, instructionPart) {
    switch (instructionNumber) {
      case 1:
        analytics('/instruction1', 'План безопасности');
        showInstructionOne(ctx, instructionPart);
        break;

      case 2:
        analytics('/instruction2', 'Что делать, если вы пострадали от физического насилия?');
        showInstructionTwo(ctx, instructionPart);
        break;

      case 3:
        analytics('/instruction3', 'Что делать, если вы пострадали от сексуализированного насилия?');
        showInstructionThree(ctx, instructionPart);
        break;

      case 4:
        analytics('/instruction4', 'Как правильно подавать заявления и вести свое дело');
        showInstructionFour(ctx, instructionPart);
        break;

      default:
        break;
    }
  },
};
