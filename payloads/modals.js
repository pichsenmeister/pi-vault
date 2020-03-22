const utils = require("./utils");

module.exports = {
  // views
  addService: context => {
    return {
      callback_id: "service:add",
      type: "modal",
      title: {
        type: "plain_text",
        text: "Add Service",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true
      },
      blocks: [
        {
          block_id: "service",
          type: "input",
          element: {
            action_id: "data",
            type: "plain_text_input",
            placeholder: {
              type: "plain_text",
              text: "Enter Service ID",
              emoji: true
            }
          },
          label: {
            type: "plain_text",
            text: "Service ID",
            emoji: true
          }
        },
        {
          block_id: "email",
          type: "input",
          element: {
            action_id: "data",
            type: "external_select",
            placeholder: {
              type: "plain_text",
              text: "Start typing",
              emoji: true
            }
          },
          label: {
            type: "plain_text",
            text: "Email",
            emoji: true
          }
        },
        {
          block_id: "length",
          type: "input",
          element: {
            action_id: "data",
            type: "static_select",
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "10",
                  emoji: true
                },
                value: "10"
              },
              {
                text: {
                  type: "plain_text",
                  text: "15",
                  emoji: true
                },
                value: "15"
              },
              {
                text: {
                  type: "plain_text",
                  text: "20",
                  emoji: true
                },
                value: "20"
              },
              {
                text: {
                  type: "plain_text",
                  text: "25",
                  emoji: true
                },
                value: "25"
              }
            ],
            initial_option: {
              text: {
                type: "plain_text",
                text: "25",
                emoji: true
              },
              value: "25"
            }
          },
          label: {
            type: "plain_text",
            text: "Length",
            emoji: true
          }
        },
        {
          block_id: "version",
          type: "input",
          element: {
            action_id: "data",
            type: "plain_text_input",
            initial_value: "1"
          },
          label: {
            type: "plain_text",
            text: "Version",
            emoji: true
          }
        },
        {
          block_id: "config",
          type: "input",
          element: {
            action_id: "data",
            type: "checkboxes",
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Lower case only",
                  emoji: true
                },
                value: "lower_case"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Include numbers",
                  emoji: true
                },
                value: "alphanumeric"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Include special characters",
                  emoji: true
                },
                value: "special_chars"
              }
            ],
            initial_options: [
              {
                text: {
                  type: "plain_text",
                  text: "Include numbers",
                  emoji: true
                },
                value: "alphanumeric"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Include special characters",
                  emoji: true
                },
                value: "special_chars"
              }
            ]
          },
          label: {
            type: "plain_text",
            text: "Configuration",
            emoji: true
          },
          optional: true
        }
      ]
    };
  },
  unlockService: context => {
    return {
      callback_id: "service:unlock",
      type: "modal",
      title: {
        type: "plain_text",
        text: "Unlock service",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "Unlock",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true
      },
      blocks: [
        {
          block_id: "password",
          type: "input",
          element: {
            action_id: "data",
            type: "plain_text_input"
          },
          label: {
            type: "plain_text",
            text: "Password",
            emoji: true
          }
        }
      ],
      private_metadata: JSON.stringify(context.metadata)
    };
  },
  showService: context => {
    return {
      callback_id: "service:show",
      type: "modal",
      title: {
        type: "plain_text",
        text: "Service",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "Done",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true
      },
      blocks: [
        {
          type: "input",
          element: {
            type: "plain_text_input",
            initial_value: context.service
          },
          label: {
            type: "plain_text",
            text: "Service",
            emoji: true
          }
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            initial_value: context.email
          },
          label: {
            type: "plain_text",
            text: "Email",
            emoji: true
          }
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            initial_value: context.password
          },
          label: {
            type: "plain_text",
            text: "Password",
            emoji: true
          }
        }
      ]
    };
  }
};
