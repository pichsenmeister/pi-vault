const utils = require("./utils");

module.exports = {
  home: context => {
    return {
      type: "home",
      blocks: [
        {
          type: "actions",
          elements: [
            {
              action_id: "service:add",
              type: "button",
              text: {
                type: "plain_text",
                text: "Add Service",
                emoji: true
              },
              value: "create"
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Search for a service"
          },
          accessory: {
            action_id: 'service:search',
            type: "external_select",
            placeholder: {
              type: "plain_text",
              text: "Start typing",
              emoji: true
            }
          }
        }
      ]
    };
  }
};
