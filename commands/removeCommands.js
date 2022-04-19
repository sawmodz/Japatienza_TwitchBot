const { client } = require('tmi.js')
const filesManagers = require('../utils/filesManagers')

module.exports = (channel, tags, message, client, prefix) => {
    if(tags.mod || tags.badges != null && tags.badges["broadcaster"] == "1"){
        let args =  message.toLowerCase().split(" ")
        if(args.length == 2){
            const commandName = "!"+args[1]

            if(filesManagers.getSettings("customCommands", commandName) != undefined){
                filesManagers.removeData("customCommands", commandName)
                client.say(channel, filesManagers.getSettings("messages", "ok_removeCommand").replace("%command%", commandName))
            }else{
                client.say(channel, filesManagers.getSettings("messages", "already_exist_removeCommand").replace("%command%", commandName))
            }
        }else{
            client.say(channel, filesManagers.getSettings("messages", "error_on_removeCommand").replace("%prefix%", prefix))
        }
    }
}