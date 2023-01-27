module.exports = async (bot) => {
    require('../Handlers/SlashCommands.js')(bot);
    
    bot.user.setActivity(bot.config.activity, { type: 'PLAYING' })

    console.log(`${bot.user.tag} is Online`)
};

