const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
        
	async run(bot, interaction) {
		const member = interaction.options.getUser('member')
		if(member) {
			const userDB = bot.db.get(member.id)
	
			let data = ['name;answer']
			for(let [name, ans] of Object.entries(userDB)){
				data.push(`${name};${ans}`)
			}
	
			const file = new Discord.MessageAttachment(Buffer.from(data.join('\n')), 'answers.csv')
			return interaction.reply({ files: [file], ephemeral: true })
		}
		
		const members = await interaction.guild.members.fetch()
		let data = ['userID;userTag;name;answer']
		bot.db.all().forEach(db => {
			for(let [name, ans] of Object.entries(bot.db.get(db.ID))) {
				data.push([db.ID, members.get(db.ID), name, ans].join(';'))
			}
		})

		const file = new Discord.MessageAttachment(Buffer.from(data.join('\n')), 'answers.csv')
		return interaction.reply({ files: [file], ephemeral: true })
	},

	config: {
		adminOnly: true
	},
	
	data: new SlashCommandBuilder()
		.setName('seegoals')
		.setDescription('See goals of all members or just one')
		.addUserOption(o => o
			.setName('member')
			.setDescription('The member whose goal you\'d like to see')	
			// .setRequired(true)
		)
};