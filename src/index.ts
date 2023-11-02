import { Bot } from './client.js';
import { config } from 'dotenv';

config();

const { token, prefix } = process.env;

if (!token || !prefix) {
    console.error("Token or prefix is missing in the environment variables.");
    process.exit(1);
}

const client = new Bot();

client.start({ token, prefix });