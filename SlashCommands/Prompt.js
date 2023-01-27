const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
        
	async run(bot, interaction) {
		const cmd = interaction.options.getSubcommand()
		const name = interaction.options.getString('name')

		if(cmd == 'create') {
			const prompt = interaction.options.getString('prompt')
			const role = interaction.options.getRole('role')

			const e = new Discord.MessageEmbed()
				.setTitle(name)
				.setDescription(prompt)
				.setColor('RANDOM')


			const row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton({
						label: 'Answer',
						style: 'SUCCESS',
						customId: 'prompt_answer'
					}),
					new Discord.MessageButton({
						label: 'Edit Answer',
						style: 'SUCCESS',
						customId: 'prompt_edit'
					})
				)

			const row2 = new Discord.MessageActionRow()
					.addComponents(
						new Discord.MessageButton({
							label: 'See Answer(s)',
							style: 'SECONDARY',
							customId: 'prompt_list'
						})
					)

			const msg = await interaction.channel.send({ embeds: [e], components: [row, row2] })
			bot.prompts.set(msg.id, { roleID: role?.id, name })
			bot.prompts.set(name, msg.id)

			return interaction.reply({ content: 'The prompt was created', ephemeral: true })
		}

		if(cmd == 'delete') {
			if(!bot.prompts.has(name)) return interaction.reply({ content: 'There is no such prompt with that name', ephemeral: true })
			bot.prompts.delete(bot.prompts.get(name))
			bot.prompts.delete(name)

			return interaction.reply({ content: 'The prompt was deleted. Feel free to delete the prompt message', ephemeral: true })
		}

		if(cmd == 'list') {
			const names = bot.prompts.all().filter(db => isNaN(db.ID)).map(db => db.ID)
			return interaction.reply({ content: names.join(', ') || 'No prompts', ephemeral: true })
		}
	},

	config: {
		adminOnly: true
	},
	
	data: new SlashCommandBuilder()
		.setName('prompt')
		.setDescription('Manage prompts')
		.addSubcommand(c => c
			.setName('create')
			.setDescription('Create a prompt')
			.addStringOption(o => o
				.setName('name')
				.setDescription('The name of this prompt')
				.setRequired(true)	
			)	
			.addStringOption(o => o
				.setName('prompt')
				.setDescription('The prompt for this channel')
				.setRequired(true)	
			)
			.addRoleOption(o => o
				.setName('role')
				.setDescription('The role to give for answering the prompt')	
			)
		)
		.addSubcommand(c => c
			.setName('delete')
			.setDescription('Delete a prompt')
			.addStringOption(o => o
				.setName('name')
				.setDescription('The name of the prompt you want to delete')
				.setRequired(true)	
			)
		)
		.addSubcommand(c => c
			.setName('list')
			.setDescription('List of all prompts')	
		)
};