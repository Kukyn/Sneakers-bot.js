const getArray = require("./../../api/snkrs")

module.exports={
    name: "snkrs",
    category: "shoes",
    dev0only: true,
    run: async ({client, message, args}) =>{

        let textChannel = {
            id: "936762796266364928"
        }
        
        if(message.channel.id === textChannel.id){

            await message.channel.messages.fetch().then(messages =>{
                message.channel.bulkDelete(messages)
            })
           
           
            getArray().then((array)=>{
                array.forEach((element,i)=> {
                    
                    createEmbed(element,element.length,i).then((shoeEmbed) =>{message.channel.send({ embeds: [shoeEmbed] })})
                    
                }) 
                /*message.channel.createWebhook('Sneakers Bot - SNKRS')
                .then(w => w.send({embeds: array,avatarURL: 'https://cdn.discordapp.com/app-icons/936691333794516992/5ce2ea867e8e0bcdb43f40142daefdf8.png?size=256'})); */
            })

        }
        function createEmbed(shoe,length,i){
            return new Promise((resolve,reject)=>{
                
                const ShoeEmbed = {
                    color: 0x0099ff,
                    title: shoe.name,
                    url: shoe.url,
                    thumbnail: {
                        url: shoe.image
                    },
                    fields: [
                        {
                            name: `Current price`,
                            value: shoe.price,
                            inline:true
                            
                        },  
                        {
                            name: `Size`,
                            value: shoe.size,
                            inline:true
                            
                        },
                        {
                            name: `Genders`,
                            value: shoe.genders.toString(),
                            inline:false
                            
                        },
                        {
                            name: `Release date`,
                            value: shoe.release,
                            inline:true
                            
                        },
                        {
                            name: `SKU`,
                            value: shoe.sku,
                            inline:false
                            
                        },
                        {
                            name: `AVAILABILITY`,
                            value: shoe.avail.toString().replaceAll(",",""),
                            inline:false
                            
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Shoes ${i+1}/${length}`,
                       
                    },  
                }
                resolve(ShoeEmbed)
            
            })
        }
    }
}

