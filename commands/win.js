const { client } = require("tmi.js");
const filesManagers = require("../utils/filesManagers");

module.exports = (channel, tags, message, client, prefix) => {
  if (tags.mod || (tags.badges != null && tags.badges["broadcaster"] == "1")) {
    filesManagers.setData(
      "settings",
      "win",
      filesManagers.getSettings("settings", "win") + 1
    );
    client.say(channel, filesManagers.getSettings("messages", "winAddSucces"));
  }
};
