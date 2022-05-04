require("dotenv").config()

const { createEmbed } = require("../../util/createEmbed")
const getArray = require("./../../api/api")
module.exports={
    name: "zalando",
    category: "shoes",
    dev0only: true,
    run: async ({client, message, args}) =>{
        
        
        let name = "zalando"
        let gender
        if(message.channel.id === process.env.zalando_men || message.channel.id === process.env.zalando_woman || message.channel.id === process.env.test_channel){
            switch(message.channel.id){
                case process.env.zalando_men:
                    gender = "men"
                    break
                case process.env.zalando_women:
                    gender = "woman"
                    break
                case process.env.test_channel:
                    switch(args[0]){
                        case "men":
                            gender = "men"
                        break
                        case "woman":
                            gender = "woman"
                        break
                        default:
                        
                    }
                    break
                    
                default:
                    gender = "men"
                    break
                    
            }

            await message.channel.messages.fetch().then(messages =>{
                message.channel.bulkDelete(messages)
            })

            getArray(name,gender).then((array)=>{
                
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