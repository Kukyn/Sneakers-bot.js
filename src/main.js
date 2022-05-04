const Discord = require("discord.js")
require("dotenv").config();

const client = new Discord.Client({
    intents:[
        "GUILDS",
        "GUILD_MESSAGES"
    ]
})
let bot = {
    client,
    prefix: "?",
    owners: ["395201513397551106","287671560872132618"]
    
}
client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.tasks = new Discord.Collection()
//TODO load taskt into task collection
client.loadEvents = (bot,reload) => require("./handlers/events")(bot,reload)
client.loadCommands = (bot,reload) => require("./handlers/commands")(bot,reload)
//client.loadTasks = (bot,reload) => require("./handlers/tasks")(bot,reload)
//TODO add tasks handler

client.loadTasks(bot,false)
client.loadEvents(bot, false)
client.loadCommands(bot,false)

module.exports = bot


client.login(process.env.botToken)