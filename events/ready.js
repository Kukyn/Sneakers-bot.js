module.exports={
    name: "ready",
    run: async (bot) => {
        console.log("Logged as " + bot.client.user.tag)
      
       
        async function taskStart(){
            const {client} = bot
            let task = client.tasks.get("snkrs")
            try{
                await task.run(bot)
                console.log(`Task ${task.name} reloaded`)
            }
            catch (err){
                let errMsg = err.toString()

                if(errMsg.startsWith("?")){
                    errMsg = errMsg.slice(1)
                    await message.reply(errMsg)
                }
                else
                    console.error(err)
            }
            
        }
        function getTime(){
                var now = new Date()
        		var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0) - now
        		if (millisTill10 < 0) {
            		millisTill10 += 86400000; // it's after 6am, try 6am tomorrow.
        		}
                return millisTill10
            }
            const time = getTime()
            setInterval(taskStart, time)
            taskStart()
    }
}