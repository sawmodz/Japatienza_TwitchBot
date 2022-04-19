const { client } = require("tmi.js");
const filesManagers = require("../utils/filesManagers");

module.exports = (channel, tags, message, client, prefix) => {
  if (tags.mod || (tags.badges != null && tags.badges["broadcaster"] == "1")) {
    filesManagers.setData(
      "settings",
      "lose",
      filesManagers.getSettings("settings", "lose") + 1
    );
    client.say(
      channel,
      filesManagers.getSettings("messages", "looseAddSucces")
    );
  }
};
