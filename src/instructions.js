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

function continiuReading(button) {
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
  if (button) {
    return [
      continiuReading(button),
      kb.backToInstructions,
      linkToSite(link),
      kb.backButton,
    ]
  } else {
    return [
      kb.backToInstructions,
      linkToSite(link),
      kb.backButton,
    ]
  }
}

module.exports = {
  async instructionsHandler (ctx) {
    // analytics('/instructions', 'Инструкции');
    ctx.reply('Выберите инструкцию:', null, Markup
      .keyboard(kb.instructions, { columns: 1 }),
    );
  },

  onShowInstruction_1(ctx, instructionNumber) {
    switch (instructionNumber) {
      case 1:
        ctx.reply(instructions.INSTRUCTION_1_PART_1, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.SAFETY_PLAN, l10n.INSTRUCTION_1_PART_2),
          ),
        );
        break;
      case 2:
        ctx.reply(instructions.INSTRUCTION_1_PART_2, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.SAFETY_PLAN, l10n.INSTRUCTION_1_PART_3),
          ),
        );
        break;
      case 3:
        ctx.reply(instructions.INSTRUCTION_1_PART_3, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.SAFETY_PLAN),
          ),
        );
        break;
      default:
        break;
    }
  },

  onShowInstruction_2(ctx, instructionNumber) {
    switch (instructionNumber) {
      case 1:
        ctx.reply(instructions.INSTRUCTION_2_PART_1, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.PHISICAL_VIOLENCE, l10n.INSTRUCTION_2_PART_2),
          ),
        );
        break;
      case 2:
        ctx.reply(instructions.INSTRUCTION_2_PART_2, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.PHISICAL_VIOLENCE),
          ),
        );
        break;
      default:
        break;
    }
  },

  onShowInstruction_3(ctx, instructionNumber) {
    switch (instructionNumber) {
      case 1:
        ctx.reply(instructions.INSTRUCTION_3_PART_1, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.SEXUAL_VIOLENCE, l10n.INSTRUCTION_3_PART_2),
          ),
        );
        break;
      case 2:
        ctx.reply(instructions.INSTRUCTION_3_PART_2, null, Markup
          .keyboard(
            instructionKeyboard(LINKS.SEXUAL_VIOLENCE),
          ),
        );
        break;
      default:
        break;
    }
  },

  onShowInstruction_4(ctx) {
    ctx.reply(instructions.INSTRUCTION_4, null, Markup
      .keyboard(
        instructionKeyboard(LINKS.RULES_SENDING_APPLICATION),
      ),
    );
  },
};
