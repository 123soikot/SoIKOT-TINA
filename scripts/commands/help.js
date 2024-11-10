const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  permission: 0,
  credits: "★Ex 卝 বয়ফ্রেন্ডヅ",
  description: "Shows all available commands together",
  prefix: true,
  category: "guide",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60,
  },
};

module.exports.languages = {
  en: {
    "moduleInfo": "•—»[ %1 ]«—•\n\nUsage: %3\nCategory: %4\nCooldown: %5 seconds\nPermission: %6\nDescription: %2\n\nCoded by: %7",
    "helpList": '[ There are %1 commands available on this bot. Use: "%2help <command_name>" to know how to use a specific command. ]',
  },
};

module.exports.run = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  
  // Generate a list of all commands
  let msg = "Available Commands:\n\n";
  commands.forEach(command => {
    msg += `• ${command.config.name}: ${command.config.description}\n`;
  });

  // Additional info footer
  msg += `\nTotal Commands: ${commands.size}\nDeveloper: ★𝐌𝟗𝐇𝟒𝐌𝐌𝟒𝐃-𝐁𝟒𝐃𝟗𝐋★`;

  // Get random image for attachment
  const images = [
    "https://i.imgur.com/kZU2xK7.jpeg",
    // Add more image URLs if desired
  ];

  const callback = () =>
    api.sendMessage(
      { body: msg, attachment: fs.createReadStream(__dirname + "/cache/helpImage.jpg") },
      threadID,
      (err, info) => {
        fs.unlinkSync(__dirname + "/cache/helpImage.jpg");
        if (!err && autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), delayUnsend * 1000);
        }
      },
      messageID
    );

  // Download image and execute callback
  request(images[0]).pipe(fs.createWriteStream(__dirname + "/cache/helpImage.jpg")).on("close", callback);
};
