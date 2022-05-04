module.exports={
    name: "ready",
    run: async (bot) => {
        console.log("Logged as " + bot.client.user.tag)
    }
}