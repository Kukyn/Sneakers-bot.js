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
                
                json.feed.items[2].articles.forEach((element,i) => {
                
                
                sendEmbed(element,Discord,message,i,length)
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
     					     
                        {
                            name: `Colors`,
                            value: jsonarray.supplierColor,
                            inline: false 
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Shoes ${i+1}/${length}`,
                       
                    },
                }
                message.channel.send({ embeds: [Shoe] });
     
            }
        }
        
        function getReleaseDate(jsonarray){
            if(jsonarray.availability.comingSoon == true){
                return [{
                    name: "State",
                    value: "To be released",
                    inline: false
                    },
                    {
                    name: `Release date`,
                    value:  `${jsonarray.availability.releaseDate.split("-")[2].split(" ")[0]}.${jsonarray.availability.releaseDate.split("-")[1]}.20${jsonarray.availability.releaseDate.split("-")[0]} ${jsonarray.availability.releaseDate.split("-")[2].split(" ")[1]}`,
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


    }
}