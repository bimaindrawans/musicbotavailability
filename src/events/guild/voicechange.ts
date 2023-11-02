import { RunFunction } from '../../types/event';
import { VoiceState } from 'discord.js';

const name: string = 'voiceStateUpdate';
const run: RunFunction = async (client, oldState: VoiceState, newState: VoiceState) => {
    const configcollection = client.db.get('config');
    if (!newState.member || !oldState.member || !newState.member.user.bot || !oldState.member.user.bot) return;

    configcollection.find({ guildId: newState.guild.id }).then(async (docs) => {
        if (!docs[0]) return;
        const { roleId, channelId } = docs[0];
        const listofallbot = newState.guild.members.cache || oldState.guild.members.cache;
        const musicbot = listofallbot.filter(a => a.user.bot && a.roles.cache.has(String(roleId)));
        const channeltargetedmessages = client.channels.cache.get(String(channelId));
        if (channeltargetedmessages && channeltargetedmessages.isText()) {
            const fetchedmessage = await channeltargetedmessages.messages.fetch();
            const latestmessage = fetchedmessage.filter(a => a.author.id === client.user?.id).first();
            const embed = client.embed({
                title: 'Available Music Bot :',
                description: String(
                    musicbot.map(e => `${e.voice.channel ? '<a:no:977182406249431100>' : '<a:yes:977182232953364490>'} | ${e.displayName}`).join('\n')
                ),
            });
            if (latestmessage) {
                latestmessage.edit({ embeds: [embed] });
            }
        }
    }).catch(err => console.error(err));
}

export { name, run }