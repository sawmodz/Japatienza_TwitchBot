const { client } = require('tmi.js')
const filesManagers = require('../utils/filesManagers')

module.exports = (channel, tags, message, client, prefix) => {
    if(tags.mod || tags.badges != null && tags.badges["broadcaster"] == "1"){
        let args =  message.toLowerCase().split(" ")
        if(args.length >= 3){
            const commandName = "!"+args[1]
            let text = ""
            let i = 0
            args.forEach(textarg => {
                if(i != 0 && i != 1){
                    text += textarg + " "
                }
                i++
            })

            if(filesManagers.getSettings("customCommands", commandName) != undefined){
                filesManagers.setData("customCommands", commandName, text)
                client.say(channel, filesManagers.getSettings("messages", "ok_changeCommand").replace("%command%", commandName))
            }else{
                client.say(channel, filesManagers.getSettings("messages", "already_exist_changeCommand").replace("%command%", commandName))
            }
        }else{
            client.say(channel, filesManagers.getSettings("messages", "error_on_changeCommand").replace("%prefix%", prefix))
        }
    }
}