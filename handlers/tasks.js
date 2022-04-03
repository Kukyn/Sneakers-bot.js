const { getFiles } = require("../util/functions")

module.exports = (bot, reload) => {
    const { client } = bot
    let tasks = getFiles("./tasks/",".js")

    tasks.forEach((f,i) => {
        const task = require(`../tasks/${f}`)
        client.tasks.set(task.name, task)
    })
    
}

