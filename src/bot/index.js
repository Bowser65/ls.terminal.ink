const Discord = require('eris');
const config = require('config');

const client = new Discord.Client(config.get('discord').token);

client.on('ready', () => {
	console.log('Discord Bot is online');

	client.editStatus('online', {
		name: 'ls.terminal.ink',
		type: 0
	});

	module.exports.guild = client.guilds.get(config.get('discord').guild);
	module.exports.channel = module.exports.guild.channels.get(config.get('discord').channel);
});

client.on('guildMemberAdd', (guild, member) => {
	if (module.exports.guild.id === guild.id && member.bot) {
		member.addRole(config.get('discord').bot);
	}
});

client.connect();

module.exports.client = client;
