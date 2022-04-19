const filesManagers = require("./utils/filesManagers");
const tmi = require("tmi.js");
const request = require("request");
const io = require("socket.io-client");

const streamlabs = io(
  `https://sockets.streamlabs.com?token=${filesManagers.getSettings(
    "auth",
    "streamlabs_apiKey"
  )}`,
  {
    transports: ["websocket"],
  }
);

const prefixCommande = require("./commands/prefix");

const addCommands = require("./commands/addCommands");
const removeCommands = require("./commands/removeCommands");
const changeCommands = require("./commands/changeCommands");
const winrate = require("./commands/winrate");
const win = require("./commands/win");
const loose = require("./commands/loose");

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: filesManagers.getSettings("auth", "bot_name"),
    password: filesManagers.getSettings("auth", "password"),
  },
  channels: filesManagers.getSettings("auth", "channel_to_connect"),
});

client.connect();

client.on("message", async (channel, tags, message, self) => {
  if (self) return;

  let prefix = filesManagers.getSettings("settings", "prefix");

  switch (message.toLowerCase().split(" ")[0]) {
    case prefix + "prefix":
      prefixCommande(channel, tags, message, client);
      return;
    case prefix + "addcommand":
      addCommands(channel, tags, message, client, prefix);
      return;
    case prefix + "removecommand":
      removeCommands(channel, tags, message, client, prefix);
      return;
    case prefix + "changecommand":
      changeCommands(channel, tags, message, client, prefix);
      return;
    case prefix + "winrate":
      winrate(channel, tags, message, client, prefix);
      return;
    case prefix + "addwin":
      win(channel, tags, message, client, prefix);
      return;
    case prefix + "addlost":
      loose(channel, tags, message, client, prefix);
      return;
    case prefix + "resetwinrate":
      reset(channel, tags, message, client, prefix);
      return;
  }

  if (message.startsWith(prefix)) {
    if (
      filesManagers.getSettings(
        "customCommands",
        message.toLowerCase().split(" ")[0]
      ) != undefined
    ) {
      const options = {
        url: "https://api.twitch.tv/helix/subscriptions?broadcaster_id=415831430",
        json: true,
        headers: {
          "Client-ID": filesManagers.getSettings("auth", "clientid"),
          Authorization:
            "Bearer " +
            filesManagers.getSettings("auth", "secondAuthorisation"),
        },
      };

      request.get(options, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        const subCount = body.total;

        const options = {
          url: "https://api.twitch.tv/helix/users/follows?to_id=415831430",
          json: true,
          headers: {
            "Client-ID": filesManagers.getSettings("auth", "clientid"),
            Authorization:
              "Bearer " +
              filesManagers.getSettings("auth", "secondAuthorisation"),
          },
        };

        request.get(options, (err, res, body) => {
          if (err) {
            return console.log(err);
          }

          const followCount = body.total;
          let subTime = 0;

          if (
            tags["badge-info"] != null &&
            tags["badge-info"].subscriber != null
          ) {
            subTime = tags["badge-info"].subscriber;
          }

          client.say(
            channel,
            filesManagers
              .getSettings(
                "customCommands",
                message.toLowerCase().split(" ")[0]
              )
              .replaceAll("%subCount%", subCount)
              .replaceAll("%followCount%", followCount)
              .replaceAll("%subage%", subTime)
          );
        });
      });
      return;
    }
  }
});

streamlabs.on("event", (eventData) => {
  const channel =
    "#" + filesManagers.getSettings("auth", "channel_to_connect")[0];
  if (eventData.for === "twitch_account") {
    switch (eventData.type) {
      case "follow":
        client.say(
          channel,
          filesManagers
            .getSettings("messages", "follow_message")
            .replaceAll("%username%", eventData.message[0].name)
        );
        break;
      case "subscription":
        client.say(
          channel,
          filesManagers
            .getSettings("messages", "sub_message")
            .replaceAll("%username%", eventData.message[0].name)
        );
        break;
      case "bits":
        client.say(
          channel,
          filesManagers
            .getSettings("messages", "bits_message")
            .replaceAll("%username%", eventData.message[0].name)
            .replaceAll("%amount%", eventData.message[0].amount)
        );
        break;
    }
  }
});
