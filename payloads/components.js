module.exports = {
  service: context => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${context.service.service}*`,
          verbatim: true
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `✉️ ${context.service.email}`,
            verbatim: true
          },
          {
            type: "mrkdwn",
            text: `🏷️ v${context.service.version}.0`
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            action_id: "service:unlock",
            type: "button",
            text: {
              type: "plain_text",
              text: "Unlock"
            },
            value: JSON.stringify(context.service)
          },
          {
            action_id: "service:delete",
            type: "button",
            text: {
              type: "plain_text",
              text: "Delete"
            },
            value: JSON.stringify(context.service),
            style: "danger",
            confirm: {
              title: {
                type: "plain_text",
                text: "Are you sure?"
              },
              text: {
                type: "mrkdwn",
                text: "Yes, delete this service."
              },
              confirm: {
                type: "plain_text",
                text: "Delete"
              },
              deny: {
                type: "plain_text",
                text: "Nevermind"
              }
            }
          }
        ]
      }
    ];
  }
};
