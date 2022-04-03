const Discord = require("discord.js")
module.exports={
    name: "hello",
    category: "info",
    run: async ({client, message, args}) =>{
        message.reply(`Hello ${message.author} :D`)
    }
}