const axios = require("axios")

module.exports = function createArray(){
    return new Promise((resolve,reject)=>{
        var shoes = []
       
        let url = "https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace%28CZ%29&filter=language%28en-GB%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc"
        axios(url)
            .then(response => {
            const json = response.data.objects
            var length = json.length

            json.forEach(async(element,i) => {
                if(element.productInfo[0].merchProduct.productType == "FOOTWEAR" ){
                    
                    
                    let shoe = {
                        name: element.productInfo[0].productContent.title,
                        price: `${element.productInfo[0].merchPrice.currentPrice} EUR`,
                        genders: [
                            element.productInfo[0].merchProduct.genders
                        ],
                        url: getURL(element),
                        image: getImage(element),
                        size: getSizes(element),
                        avail:availability(element),
                        release: getRelease(element),
                        sku: getSKU(element),
                        length: length
                    }
                    shoes.push(shoe)
                    
                    
                } ////productInfo/0/merchProduct/productType
                
            });  
            resolve(shoes)
             
        })

        function getSizes(element){
            return `${element.productInfo[0].skus[0].countrySpecifications[0].localizedSize} - ${element.productInfo[0].skus[Object.keys(element.productInfo[0].skus).length-1].countrySpecifications[0].localizedSize}`
        }

        function getURL(element){
            return `https://www.nike.com/cz/en/launch/t/${element.publishedContent.properties.seo.slug}`
        }

        function getImage(element){
            if(element.publishedContent.nodes[0].nodes[0] != undefined){
                return element.publishedContent.nodes[0].nodes[0].properties.squarishURL
            }else{
                return element.publishedContent.nodes[0].nodes[1].properties.portraitURL
            }
            
        }
        function getSKU(element){
           /* return new Promise((resolve,reject)=>{
                 let sku = element.productInfo[0].merchProduct.styleColor
              axios
                .get(`https://stockx.com/api/browse?_search=${sku}&country=CZ&dataType=product&filterVersion=2`, 
                { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36' }  } )
            .then(response => {
                console.log(`[${sku}](https://stockx.com/${response.data.Products[0].urlKey})`)
                resolve (`https://stockx.com/${response.data.Products[0].urlKey}`)
                })
                .catch(function(e) {
                console.log(e);
                })
            })*/
           let sku = element.productInfo[0].merchProduct.styleColor
     
            const url = ""
            return `[${sku}](${url})`
             //console.log(`[${sku}](${url})`)
             
            
            
        }
        function getRelease(element){
            var lauchview = element.productInfo[0].launchView
            const dateNow = new Date().toISOString()
            
            if(!(lauchview === undefined)){
                const dateDropStart = new Date(lauchview.startEntryDate)
                const timeplus2 = dateDropStart.setHours( dateDropStart.getHours() + 2 );
                const kktstart = new Date(timeplus2) 
                if(lauchview.stopEntryDate !== undefined){
                    
                    const dateDropEnd = new Date(lauchview.stopEntryDate)
                    const timeplus2 = dateDropEnd.setHours( dateDropEnd.getHours() + 2 );
                    const kktend = new Date(timeplus2) 
                    if(dateNow < kktstart.toISOString()){
                        return `[RAFFLE]
                        ${kktstart.toLocaleDateString()}\n${kktstart.toLocaleTimeString()} - ${kktend.toLocaleTimeString()}`
                    }
                   
                    
                }
                return `[RELEASE]
                ${kktstart.toLocaleDateString()} ${kktstart.toLocaleTimeString()}`
               
            }
            return "[AVAILABLE FOR PURCHASE]" 
        }
        function getstockXURL(sku){
            
                axios
                .get(`https://stockx.com/api/browse?_search=${sku}&country=CZ&dataType=product&filterVersion=2`, 
                { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1' }  } )
            .then(response => {
                console.log(`https://stockx.com/${response.data.Products[0].urlKey}`)
                return (`https://stockx.com/${response.data.Products[0].urlKey}`)
                })
                .catch(function(e) {
                console.log(e);
                })
            
            
        }
        function availability(element){
            const gtins = element.productInfo[0].availableGtins
            const skus = element.productInfo[0].skus 
            const array = []
            gtins.forEach((gtin,i) =>{
                if(gtin.level !== undefined){
                    array.push(`${skus[i].countrySpecifications[0].localizedSize} - ${gtin.level}\n`)
                }else{
                    array.push(`${skus[i].countrySpecifications[0].localizedSize} - UNKNOWN\n`)
                }
                
                
            })
            
            return(array.filter(element => {
                return element !== "";
            }))
           
            array.forEach((element,i)=>{
                if((element == "" || element == undefined || element == null)){
                    console.log("kokot " + typeof(element))
                }
                else{
                    console.log(element)
                }
            })
            
            
        }
    })
 
}
//https://stockx.com/api/browse?_search=DQ9324600&country=CZ&dataType=product&filterVersion=2