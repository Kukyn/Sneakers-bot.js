const getArray = require("../api/snkrs")
const SnkrsCommand = require("./../commands/shoes/snkrs")


module.exports={
    name: "snkrs",
    run: async (bot) => {
        SnkrsCommand.run
    }
}   
