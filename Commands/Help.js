const Discord   = require('discord.js');

module.exports.run = async (bot, message, args) => {

    //Variables
    const prefix = bot.config.prefix
    
    //Code Start
    if(!args.length){
        const e = new Discord.MessageEmbed()
            .setAuthor({ name: `Basic Info` })
            .setDescription(`My prefix is \`${prefix}\` For more detailed info type **${prefix}help [command]**\n**Commands**\n \`\`\`\n${bot.commands.map(cmd => `${bot.config.prefix}${cmd.config.command} ${cmd.config.usage || ''}`).join('\n')} \`\`\` `)
            .setColor("RANDOM")
            .setFooter({ text: `Last used by | ${message.author.username}`, iconURL: message.author.avatarURL() });

        return message.channel.send({ embeds: [e] });
    }

    const commandName = args[0].toLowerCase();
    let command; 

    if(bot.commands.has(commandName)) command = bot.commands.get(commandName);
    else if(bot.aliases.has(commandName)) command = bot.commands.get(bot.aliases.get(commandName));

    if (!command) return message.channel.send('that\'s not a valid command!');
    
    const commandEmbed = new Discord.MessageEmbed()
        .setAuthor({ name: `${command.config.command} command` })

    if (command.config.desc) commandEmbed.addField(`**Description:**`, `${command.config.desc}`);
    if (command.config.aliases) commandEmbed.addField("**Aliases:**", ` \`\`\`\n${command.config.aliases.join(', ')}\`\`\` `);
    if (command.config.usage) commandEmbed.addField(`**Usage:**`, ` \`\`\`\n${prefix}${command.config.command} ${command.config.usage}\`\`\``);
    else commandEmbed.addField(`**Usage:**`, ` \`\`\`\n${prefix}${command.config.command}\`\`\``);
    if (command.config.cmdPerms) commandEmbed.addField(`**Permissions needed:**`, ` \`\`\`\n${command.config.cmdPerms}\`\`\``);

    commandEmbed.addField(`**Cooldown:**`, `${command.config.cooldown || 0} second(s)`)
    commandEmbed.setColor("RANDOM")

    message.channel.send({ embeds: [commandEmbed] });
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "[command]",
    command: "help",
    aliases: ["h"],
    args: false,
}