require("dotenv").config()

const { createEmbed } = require("../../util/createEmbed")
const getArray = require("./../../api/api")
module.exports={
    name: "snkrs",
    category: "shoes",
    dev0only: true,
    run: async ({client, message, args}) =>{
        const name = "snkrs"
        if(message.channel.id === process.env.snkrs || message.channel.id === process.env.test_channel){

            await message.channel.messages.fetch().then(messages =>{
                message.channel.bulkDelete(messages)
            })
         
            getArray(name).then((array)=>{
                
                array.forEach(async (element)=>{
                  
                    message.channel.send({ 
                        embeds: [await createEmbed(element)],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "Store page",
                                        style: 5,
                                        url: element.url
                                    }
                                    
                                ]
                    
                            }
                        ],
                     })
                    
                })
            }).catch((e)=>{message.channel.send(`${e}`)})

        }
        
    }
}

