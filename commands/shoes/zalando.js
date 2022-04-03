module.exports={
    name: "zalando",
    category: "shoes",
    dev0only: true,
    run: async ({client, message, args}) =>{
        let channels = {
            man:{
                id: "936740642871214081",
                url: "https://www.zalando.cz/release-calendar/tenisky-muzi/"
            },
            woman: {
                id: "936740747347112006",
                url: "https://www.zalando.cz/release-calendar/tenisky-zeny/"
            }        
        }
        var url = ""
        
        if(message.channel.id === channels.man.id || message.channel.id === channels.woman.id){
            switch(message.channel.id){
                case channels.man.id:
                    url = channels.man.url
                    break
                case channels.woman.id:
                    url = channels.woman.url
                    break
                default:
                    return 
            }
            const Discord = require("discord.js")
            const axios = require("axios")
            const cheerio = require("cheerio")        
    
        
             
            await message.channel.messages.fetch().then(messages =>{
                message.channel.bulkDelete(messages)
            })
            //Preparation for autamatic updates
            /*urls.forEach(url => {

            })*/
            axios(url)
                .then(response => {
                const html = response.data
                const $ = cheerio.load(html)
                var jsontext = ""
               
                $.root().find("body").find("script").each(function(){
                    if($(this).html().startsWith('window.feedPreloadedState={"feed"')){jsontext = $(this).html().toString().split("=")[1].slice(0, -1)}
                })
                let json = JSON.parse(jsontext)
                let length = json.feed.items[2].articles.length;
                var ii = -1
                json.feed.items[2].articles.forEach((element) => {
                    
                    if(element.availability.comingSoon == true){
                        ii+=1
                        sendEmbed(element,Discord,message,ii,length)
                    }
                
                })
                
            })
            
    
            function sendEmbed(jsonarray, Discord,message,i,length){
                
                    const Shoe = {
                        color: 0x0099ff,
                        title: jsonarray.name.split(" - ")[0],
                        url: `https://www.zalando.cz/${jsonarray.urlKey}.html`,
                        description: jsonarray.brand,
                        thumbnail: {
                            url: jsonarray.imageUrl,
                        },
                        fields: [
                            {
                                name: `Current price`,
                                value: jsonarray.price.current,
                                inline:true
                                
                            },  
    
                                getSize(jsonarray),
                              
                                getReleaseDate(jsonarray),

                                getAvailability(jsonarray)
                                  
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: `Shoes ${i+1}`,
                           
                        },
                    }
                    message.channel.send({ embeds: [Shoe] })
                
                
     
            }
        }
        
        function getReleaseDate(jsonarray){
            if(jsonarray.availability.comingSoon == true){
                const date = new Date("20"+jsonarray.availability.releaseDate)
                const timeplus2 = date.setHours( date.getHours() + 2 );
                const kkt = new Date(timeplus2) 
                return [{
                    name: "State",
                    value: "To be released",
                    inline: false
                    },
                    {
                    name: `Release date`,
                    value:  `${kkt.toLocaleDateString()} ${kkt.toLocaleTimeString()}`,
                    inline: true
                }]
            }
                return [{
                    name: "State",
                    value: "Already released",
                    inline:false
                    },
                    
                ]
            }
        function getSize(jsonarray){
            return {name: `Size`, value: `${jsonarray.simples[0].size.local_size} - ${jsonarray.simples[Object.keys(jsonarray.simples).length-1].size.local_size}`, inline:true}
        }
        function getAvailability(jsonarray){
            const simples = jsonarray.simples
            const array = []
            simples.forEach((element,i)=>{
                if(element.fulfillment_qualities !== undefined){
                    array.push(`${jsonarray.simples[i].size.local_size} - ${element.fulfillment_qualities[0]}\n`)
                }else{
                    array.push(`${jsonarray.simples[i].size.local_size} - UNKNOWN\n`)
                }
               
            })
            return[{
                name: "Availability",
                value: array.toString().replaceAll(",",""),
                inline: false
            }]
        }

    }
}