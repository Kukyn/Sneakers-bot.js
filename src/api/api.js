const axios = require("axios")
const cheerio = require("cheerio")  

const urls = {
    snrks: "https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace%28CZ%29&filter=language%28en-GB%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc",
    zalando:{
        men:"https://www.zalando.cz/release-calendar/tenisky-muzi/",
        woman:"https://www.zalando.cz/release-calendar/tenisky-zeny/"
    }
}



module.exports = function createArray(site,siteType)
{
    
    let gender = siteType || null
    let isZalando = false
    var parsedResponse
    
    return new Promise(async(resolve,reject)=>{
        console.log(`API request for ${site} ${gender}`)
        switch(site){
            case "snkrs":
                var url = urls.snrks
                break
            case "zalando":
                isZalando = true
                var url = urls.zalando
                if(gender == "men"){
                    url = url.men
                }else if(gender == "woman"){
                    url = url.woman
                }else{
                    reject(`Info for ${gender} doesnt exist.`)
                }
            break
            default:
                reject(`Site ${site} doesnt exist.`)
            break
        }
        
        axios(url).then((response)=>{
            if(isZalando){
                parsedResponse = parseZalando(response)
                resolve(parsedResponse)
                
            }else{
                parsedResponse = parseSnkrs(response)
                resolve(parsedResponse)
            }
            
        })
        
        


    })

    function parseZalando(response){
        this.name = "zalando"
        const $ = cheerio.load(response.data)
        var data = ""
        $.root().find("body").find("script").each(function(){
            if($(this).html().startsWith('window.feedPreloadedState={"feed"')){data = JSON.parse($(this).html().toString().split("=")[1].slice(0, -1))}
        })

        let usedNames = []
        let apiResponse = []
        data.feed.items[2].articles.forEach(element => { 
            if(element.availability.comingSoon == true && !(usedNames.includes(element.name.split(" - ")[0].replace(/\s+$/, '')))){

                const shoe = {
                    name: element.name.split(" - ")[0].replace(/\s+$/, ''),
                    price: element.price.current,
                    genders: "PLACEHOLDER",
                    url: `https://www.zalando.cz/${element.urlKey}.html`,
                    image: element.imageUrl,
                    avail: getAvailability(element,this.name),
                    release: getReleaseDate(element,this.name),
                    sku: "PLACEHOLDER",
                    size: getSizes(element,this.name)
                }
                usedNames.push(shoe.name)
              
                apiResponse.push(shoe)
            }
        });    
        return apiResponse 
    }

    function parseSnkrs(response){
        this.name = "snkrs"
        let usedNames = []
        let apiResponse = []
        response.data.objects.forEach(element => { 
            if(element.productInfo[0].merchProduct.productType == "FOOTWEAR"  && !(usedNames.includes(element.productInfo[0].productContent.title))){

                const shoe = {
                    name:  element.productInfo[0].productContent.title,
                    price: `${element.productInfo[0].merchPrice.currentPrice} EUR`,
                    genders:  [
                        element.productInfo[0].merchProduct.genders
                    ],
                    url: `https://www.nike.com/cz/en/launch/t/${element.publishedContent.properties.seo.slug}`,
                    image: element.publishedContent.nodes[0].nodes[0].properties.squarishURL,
                    avail: getAvailability(element,this.name),
                    release: getReleaseDate(element,this.name),
                    sku: element.productInfo[0].merchProduct.styleColor,
                    size: getSizes(element,this.name)
                }
                usedNames.push(shoe.name)
              
                apiResponse.push(shoe)
            }
        });    
        return apiResponse 
    }
}
function getSizes(element,site){
    if(site == "zalando"){
        return `${element.simples[0].size.local_size} - ${element.simples[Object.keys(element.simples).length-1].size.local_size}`
    }else if(site == "snkrs"){
        return `${element.productInfo[0].skus[0].countrySpecifications[0].localizedSize} - ${element.productInfo[0].skus[Object.keys(element.productInfo[0].skus).length-1].countrySpecifications[0].localizedSize}`
    }else{
        return "Unknown site argunement passed to funciton"
    }
}
function getAvailability(element,site){
    if(site == "zalando"){
        const simples = element.simples
            const array = []
            simples.forEach((simple,i)=>{
                if(simple.fulfillment_qualities !== undefined){
                    array.push(`${element.simples[i].size.local_size} - ${simple.fulfillment_qualities[0].toUpperCase()}\n`)
                }else{
                    array.push(`${element.simples[i].size.local_size} - UNKNOWN\n`)
                }
               
            })
            return array.toString().replaceAll(",","")
    }else if(site == "snkrs"){
        const gtins = element.productInfo[0].availableGtins
            const skus = element.productInfo[0].skus 
            const array = []
            gtins.forEach((gtin,i) =>{
                try{
                    if(gtin.level !== undefined){
                        //console.log(`${skus[i].countrySpecifications[0].localizedSize} - ${gtin.level}\n`)
                        array.push(`${skus[i].countrySpecifications[0].localizedSize} - ${gtin.level}\n`)
                    }else{
                        array.push(`${skus[i].countrySpecifications[0].localizedSize} - UNKNOWN\n`)
                    }
                }catch(e){
                    array.push('CAN´T LOAD')
                } 
            })
            return array
    }else{
        return "Unknown site argunement passed to funciton"
    }
}
function getReleaseDate(element,site){
    if(site == "zalando"){
        const dateRaw = new Date("20"+element.availability.releaseDate)
        const timeplus2 = dateRaw.setHours( dateRaw.getHours() + 2 );
        const date = new Date(timeplus2) 
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }else if(site == "snkrs"){
        var lauchview = element.productInfo[0].launchView
            const dateNow = new Date().toISOString()
            
            if(!(lauchview === undefined)){
                const dateDropStartRaw = new Date(lauchview.startEntryDate)
                const timeplus2 = dateDropStartRaw.setHours( dateDropStartRaw.getHours() + 2 );
                const dateDropStart = new Date(timeplus2) 
                if(lauchview.stopEntryDate !== undefined){
                    
                    const dateDropEndRaw = new Date(lauchview.stopEntryDate)
                    const timeplus2 = dateDropEndRaw.setHours( dateDropEndRaw.getHours() + 2 );
                    const dateDropEnd = new Date(timeplus2) 
                    if(dateNow < dateDropStart.toISOString()){
                        return `[RAFFLE]
                        ${dateDropStart.toLocaleDateString()}\n${dateDropStart.toLocaleTimeString()} - ${dateDropEnd.toLocaleTimeString()}`
                    }
                   
                    
                }
                return `[RELEASE]
                ${dateDropStart.toLocaleDateString()} ${dateDropStart.toLocaleTimeString()}`
               
            }
    }else{
        return "Unknown site argunement passed to funciton"
    }
}