module.exports = {
    createEmbed(shoe){
        return new Promise((resolve,reject)=>{
            
            const ShoeEmbed = {
                color: 0x0099ff,
                title: shoe.name,
                //url: shoe.url,
                
                fields: [
                    {
                        name: `PRICE`,
                        value: shoe.price,
                        inline:true
                        
                    },  
                    {
                        name: `SIZE`,
                        value: shoe.size,
                        inline:true
                        
                    },
                    {
                        name: `RELEASE DATE`,
                        value: shoe.release,
                        inline:false
                        
                    },
                    {
                        name: `SKU`,
                        value: shoe.sku,
                        inline:false
                        
                    },
                    {
                        name: `AVAILABILITY`,
                        value: "```"+shoe.avail.toString().replaceAll(",","")+"```",
                        inline:false
                        
                    },
                    
                ],
                image: {
                    url: shoe.image,
                },
                timestamp: new Date(),
                footer: {
                    text: `Sneakers APIv2 by Kukyn`,
                   
                },  
            }
            resolve(ShoeEmbed)
        
        })
    
    }
}