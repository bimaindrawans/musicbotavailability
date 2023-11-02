import { RunFunction } from '../../types/event';
import { Bot } from '../../client';

const name: string = 'ready';
const run: RunFunction = async (client: Bot) => {
    if (!client.user) return;

    client.logger.log(`Logged in as ${client.user.tag}`);
};

export { name, run };