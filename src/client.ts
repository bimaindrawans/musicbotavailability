import Glob from 'glob';
import { Console } from 'console'; // Mengganti Consola dengan Console
import { promisify } from 'util';
import { Client, Collection, Intents, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Config } from './types/config';
import { Command } from './types/command';
import { Event } from './types/event';
import monk from 'monk';

class Bot extends Client {
    public globPromise = promisify(Glob);
    public Config!: Config; // Tambahkan tanda "!" untuk menandakan bahwa Config pasti akan diisi
    public db = monk(process.env.MONGO_URI!); // Tambahkan "!" untuk menandakan bahwa MONGO_URI pasti akan ada
    public logger: Console = console; // Ganti ke Console jika tidak menggunakan Consola
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();

    public constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    }

    public async start(config: Config): Promise<any> {
        await this.db.then(() => this.logger.log('Database connected')); // Menggunakan this.logger.log untuk log informasi

        this.Config = config;
        this.login(config.token);

        const commandFiles: string[] = await this.globPromise(`${__dirname}/commands/**/*{.ts,.js}`);
        await Promise.all(commandFiles.map(async (value: string) => { // Tambahkan "await" dan "Promise.all" untuk menunggu semua command selesai dimuat
            const file: Command = await import(value);
            this.commands.set(file.name, file);
            this.logger.log(`Success load command: ${file.name}`);
        }));

        const eventFiles: string[] = await this.globPromise(`${__dirname}/events/**/*{.ts,.js}`);
        await Promise.all(eventFiles.map(async (value: string) => { // Tambahkan "await" dan "Promise.all" untuk menunggu semua event selesai dimuat
            const file: Event = await import(value);
            this.events.set(file.name, file);
            this.on(file.name, file.run.bind(null, this));
        }));
    }

    public embed(options: MessageEmbedOptions): MessageEmbed {
        return new MessageEmbed({ ...options, color: 'RANDOM' }).setTimestamp();
    }
}

export { Bot };