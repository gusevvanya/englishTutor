import TelegramBot from 'node-telegram-bot-api';
import { processSessionResult, getPrompt } from '../services/AI';
import { getTableStringsForNewWords } from '../utils';
import { addNewRows } from '../services/google-sheets';
import { PAGES } from '../constants/constants';


// TODO: set set tmeout and clear waiting status if user didn't respond for a long time

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const commands = [
  {
    command: 'add_new',
    description: 'Add new word',
  },
  {
    command: 'get_prompt',
    description: 'Get learning prompt',
  },
  {
    command: 'send_results',
    description: 'Send learning results',
  },
];

bot.setMyCommands(commands);

bot.onText(/\/send_results/, (msg) => {
  const chatId = msg?.chat?.id;
  bot.sendMessage(chatId, 'Attach your results from ChatGPT please:');

  bot.once('message', async (nextMsg) => {
    if (nextMsg.chat.id === chatId) {
      try {
        await processSessionResult(nextMsg.text || '');
        bot.sendMessage(msg?.chat?.id, '✅ Success!');
      } catch (err) {
        bot.sendMessage(msg?.chat?.id, err?.message || 'something went wrong!');
      }
    }
  });
});

bot.onText(/\/add_new/, (msg) => {
  const chatId = msg?.chat?.id;
  bot.sendMessage(chatId, 'Add new word:');

  bot.once('message', async (nextMsg) => {
    if (nextMsg.chat.id === chatId) {
      try {
        const rowWords = nextMsg.text?.split('\n');
        const wordsString = getTableStringsForNewWords(rowWords || []);

        const res = await addNewRows(wordsString as string[][], PAGES.NEW);

        if (!res.ok) {
          throw new Error('Failed to add new words to Google Sheets');
        }

        bot.sendMessage(msg?.chat?.id, '✅ Success!');
      } catch (err) {
        bot.sendMessage(msg?.chat?.id, err?.message || 'something went wrong!');
      }
    }
  });
});

bot.onText(/\/get_prompt/, async (msg) => {
  const chatId = msg?.chat?.id;
  try {
    const prompt = await getPrompt();
    bot.sendMessage(chatId, prompt);
  } catch (err) {
    bot.sendMessage(chatId, err?.message || 'something went wrong!');
  }
});

export default bot;
