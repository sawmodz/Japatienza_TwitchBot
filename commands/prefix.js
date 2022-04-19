const { client } = require('tmi.js')
const filesManagers = require('../utils/filesManagers')

module.exports = (channel, tags, message, client) => {
    if(tags.mod || tags.badges != null && tags.badges["broadcaster"] == "1"){
        let prefix =  message.toLowerCase().split(" ")[1]
        if(prefix == null) return
        filesManagers.setData("settings", "prefix", prefix)
        client.say(channel, filesManagers.getSettings("messages", "prefix_change").replace("%prefix%", prefix))
    }
}