const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
        
	async run(bot, interaction) {
		const name = interaction.options.getString('name')
		const userDB = bot.db.get(interaction.user.id)

		interaction.reply({ content: userDB[name] || 'No goal or wrong name', ephemeral: true })
	},

	config: {
		//adminOnly: true
	},
	
	data: new SlashCommandBuilder()
		.setName('seegoal')
		.setDescription('See you goal')
		.addStringOption(o => o
			.setName('name')
			.setDescription('The name of the prompt/goal')	
			.setRequired(true)
		)
};