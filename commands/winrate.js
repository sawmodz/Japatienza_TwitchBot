const { client } = require("tmi.js");
const filesManagers = require("../utils/filesManagers");

module.exports = (channel, tags, message, client, prefix) => {
  const win = filesManagers.getSettings("settings", "win");
  const loose = filesManagers.getSettings("settings", "lose");
  const winrate = win == 0 ? 0 : (win / (win + loose)) * 100;
  client.say(
    channel,
    filesManagers
      .getSettings("messages", "winrateMessage")
      .replaceAll("%win%", win)
      .replaceAll("%loose%", loose)
      .replaceAll("%purcent%", Math.round(winrate))
  );
};
