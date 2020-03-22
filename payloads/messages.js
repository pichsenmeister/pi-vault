const utils = require("./utils");

module.exports = {
  hello: context => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:sparkles: Hello <@${context.user}>!`
        }
      }
    ];
  }
};
