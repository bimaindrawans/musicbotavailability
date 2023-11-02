import { RunFunction } from '../../types/command';

const name: string = 'setup';
const description: string = 'Setup check bot';
const category: string = "Utility";
const aliases: string[] = ['s'];
const run: RunFunction = async (client, message, args) => {
    const configcollection = client.db.get('config')
    if (args.length != 0 && args[0]?.toLowerCase() == 'delete') {
        configcollection.find({ guildId: message.guild?.id }).then(docs => { // Tambahkan "?"
            if (docs.length == 0) return message.reply('No settings was saved')
            configcollection.remove({ guildId: message.guild?.id }).then(e => { // Tambahkan "?"
                message.channel.send('Success remove settings')
            }).catch(err => {
                console.error(err)
                message.reply('Failed remove settings')
            })
        })
    } else {
        configcollection.find({ guildId: message.guild?.id }).then(docs => { // Tambahkan "?"
            if (docs.length != 0) return message.reply('Settings already exist, please delete current settings');
            if (!message.mentions.roles.first() && !message.mentions.channels.first()) return message.reply('Please mention channel and role')
            const channelId = message.mentions.channels.first()?.id; // Tambahkan "?"
            const roleId = message.mentions.roles.first()?.id; // Tambahkan "?"
            if (!channelId || !roleId) {
                return message.reply('Invalid channel or role mention');
            }
            configcollection.insert({ guildId: message.guild?.id, channelId, roleId }).then(a => { // Tambahkan "?"
                message.channel.send('Success saving settings')
            }).catch(err => {
                message.reply('Failed saving settings')
                console.error(err)
            })
        }).catch(err => {
            message.reply('Failed load data')
            console.error(err)
        })
    }
}

export { name, description, run, category, aliases }