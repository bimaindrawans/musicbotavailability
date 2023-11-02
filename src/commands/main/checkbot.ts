import { RunFunction } from '../../types/command';
import { Message } from 'discord.js';

const name: string = 'checkbot';
const description: string = 'Check Available Music Bot';
const category: string = "Utility";
const aliases: string[] = ['cb'];
const run: RunFunction = async (client, message: Message) => {
    if (!message.guild) return message.reply('This command can only be used in a server.');

    const configcollection = client.db.get('config');
    try {
        const docs = await configcollection.find({ guildId: message.guild.id });
        if (docs.length === 0) return message.reply('Please set up the bot first.');

        const musicbot = message.guild.members.cache.filter(member => member.user.bot && member.roles.cache.has(String(docs[0].roleId)));
        const embed = client.embed({
            title: 'Available Bot Music :',
            description: String(musicbot.map(member => `${member.voice.channel ? '✅' : '❌'} | ${member.displayName}`).join('\n'))
        });
        message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        message.reply('Failed to load data from the database.');
    }
};

export { name, description, run, category, aliases };
