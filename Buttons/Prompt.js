const Discord = require('discord.js');

module.exports.run = async (bot, interaction, [action]) => {

    //Code Start
    if(!bot.db.has(interaction.user.id)) bot.db.set(interaction.user.id, {})
    const prompt = bot.prompts.get(interaction.message.id)


    if(action == 'list') {
        if(interaction.member.roles.cache.has(bot.config.adminRoleID)) {
            const members = await interaction.guild.members.fetch()
            let data = ['userID;userTag;answer']
            bot.db.all().forEach(db => {
                data.push([db.ID, members.get(db.ID).user.tag, bot.db.get(`${db.ID}.${prompt.name}`)].join(';'))
            })

            const file = new Discord.MessageAttachment(Buffer.from(data.join('\n')), 'answers.csv')
            return interaction.reply({ files: [file], ephemeral: true })

        } else {
            return interaction.reply({ content: bot.db.get(`${interaction.user.id}.${prompt.name}`) || 'No goal', ephemeral: true })
        }
    }


    const id = Math.floor(Math.random() * 1000)
    const modal = new Discord.Modal()
        .setTitle('Answer form')
        .setCustomId('answermodal' + id)
        .addComponents(
            new Discord.MessageActionRow()
                .addComponents(
                    new Discord.TextInputComponent({
                        label: 'Answer',
                        customId: 'answer',
                        style: 'PARAGRAPH',
                        required: true
                    })
                )
        )
        

    await interaction.showModal(modal)

    const answerInteraction = await interaction.awaitModalSubmit({ filter: i => i.customId.endsWith(id), time: 300_000 }).catch(err => false)
    if(!answerInteraction) return

    let answer = answerInteraction.fields.getTextInputValue('answer')

    if(action == 'answer') {
        if(prompt.roleID) interaction.member.roles.add(prompt.roleID)
        bot.db.set(`${interaction.user.id}.${prompt.name}`, answer)
        return answerInteraction.reply({ content: `Your answer:\n${answer}`, ephemeral: true })
    }

    if(action == 'edit') {
        bot.db.set(`${interaction.user.id}.${prompt.name}`, answer)
        return answerInteraction.reply({ content: `You changed your answer to:\n${answer}`, ephemeral: true })
    }

	//Code End

}

module.exports.config = {
    buttonID: "prompt",
}