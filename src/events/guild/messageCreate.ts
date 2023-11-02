import { RunFunction } from '../../types/event';
import { Message } from 'discord.js';
import { Command } from '../../types/command';

const name: string = 'messageCreate';
const run: RunFunction = async (client, message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;

    const args: string[] = message.content.slice(client.Config.prefix.length).trim().split(/ +/);
    const cmd: string = args.shift()?.toLowerCase() || '';

    const command: Command | undefined = client.commands.get(cmd) || client.commands.find((a: Command) => {
        if (a.aliases && a.aliases.includes(cmd)) {
            return true;
        }
        return false;
    });

    if (!command) return;

    if (!message.guild) return;

    if (!message.guild.me?.permissionsIn(message.channel).has(command.permissionBot)) {
        return message.reply("Bot doesn't have permission to execute the command");
    }

    if (!message.member?.permissions.has(command.permissionUser)) {
        return message.reply("You don't have permission for this command");
    }

    try {
        await command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error while executing this command.');
    }
};

export { name, run };