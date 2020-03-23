require("dotenv").config();
const { App, ExpressReceiver } = require("@slack/bolt");
const crypt = require("./crypt");
const oauth = require("./oauth");
const payloads = require("./payloads");
const store = require("./store");

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const app = new App({
  authorize: oauth.authorize,
  receiver: expressReceiver,
  logLevel: "DEBUG"
});

const express = expressReceiver.app;

// ping function to keep glitch alive
express.get("/ping", (req, res) => {
  console.log("<3");
  return res.send("pong:pi-vault");
});
// oauth urls
express.get("/install", oauth.install);
express.get("/redirect", oauth.redirect);

app.shortcut(/w*/, async ({ ack, context, body }) => {
  ack();

  console.log(body);
});

/**
app home opened listener to 
- render CTAs and sticker sets in home tab
- send a welcome message in messages tab if applicable
**/
app.event("app_home_opened", async ({ event, body, context }) => {
  if (event.tab === "home") {
    const user = await getUser(event.user, body.team_id);
    await publishHomeView(event.user, user, context);
  }
});

app.action("service:add", async ({ ack, action, body, context }) => {
  ack();

  await app.client.views.open({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: payloads.modals.addService()
  });
});

app.action("service:unlock", async ({ ack, action, body, context }) => {
  ack();

  await app.client.views.open({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: payloads.modals.unlockService({
      metadata: JSON.parse(action.value)
    })
  });
});

app.action("service:delete", async ({ ack, action, context, body }) => {
  ack();

  const user = await getUser(body.user.id, body.team.id);

  const value = JSON.parse(action.value);

  user.services = user.services.filter(service => {
    return !(
      service.service === value.service &&
      service.email === value.email &&
      service.version === value.version
    );
  });

  await store.saveUser(body.user.id, user);
  await publishHomeView(body.user.id, user, context);
});

app.action("service:search", async ({ ack, action, context, body }) => {
  ack();

  const user = await getUser(body.user.id, body.team.id);
  const value = action.selected_option.value.split("|");

  const services = user.services.filter(service => {
    return (
      value[0] === service.service &&
      value[1] === service.email &&
      value[2] === service.version
    );
  });

  await app.client.views.open({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: payloads.modals.unlockService({
      metadata: services[0]
    })
  });
});

app.options("service:search", async ({ options, ack, context, body }) => {
  const user = await getUser(body.user.id, body.team.id);
  const results = (user.services || []).filter(
    value => value.service.indexOf(options.value) >= 0
  );

  if (results.length) {
    const options = results.map(value => {
      return {
        text: {
          type: "plain_text",
          text: `${value.service} (${value.email})`
        },
        value: `${value.service}|${value.email}|${value.version}`
      };
    });

    ack({
      options: options
    });
  } else {
    ack();
  }
});

app.options(
  { block_id: "email", action_id: "data" },
  async ({ options, ack, context, body }) => {
    const user = await getUser(body.user.id, body.team.id);
    const results = (user.emails || []).filter(
      value => value.indexOf(options.value) === 0
    );

    if (results.length) {
      const options = results.map(value => {
        return {
          text: {
            type: "plain_text",
            text: value
          },
          value: value
        };
      });

      ack({
        options: options
      });
    } else {
      ack({
        options: [
          {
            text: {
              type: "plain_text",
              text: options.value
            },
            value: options.value
          }
        ]
      });
    }
  }
);

app.view("service:add", async ({ ack, context, view, body }) => {
  ack();

  const user = await getUser(body.user.id, body.team.id);
  const values = view.state.values;

  const config = {};
  values.config.data.selected_options &&
    values.config.data.selected_options.forEach(option => {
      config[option.value] = true;
    });
  config.length = parseInt(values.length.data.selected_option.value);

  const service = {
    service: values.service.data.value,
    email: values.email.data.selected_option.value,
    version: values.version.data.value,
    config,
    lastUsed: new Date()
  };

  if (!user.services) user.services = [];
  if (!user.emails) user.emails = [];
  if (user.emails.indexOf(service.email) < 0) user.emails.push(service.email);
  user.services.push(service);

  await store.saveUser(body.user.id, user);
  await publishHomeView(body.user.id, user, context);
});

app.view("service:unlock", async ({ ack, context, view, body }) => {
  const metadata = JSON.parse(view.private_metadata);
  const password = view.state.values.password.data.value;

  // generate password
  const gen =
    metadata.version === "0"
      ? crypt.cryptDeprecated(metadata, password)
      : crypt.crypt(metadata, password);

  // update last used to be pushed to top in home tab
  const user = await getUser(body.user.id, body.team.id);
  user.services = user.services.map(service => {
    if (
      metadata.service === service.service &&
      metadata.email === service.email &&
      metadata.version === service.version
    ) {
      service.lastUsed = new Date();
    }
    return service;
  });
  await store.saveUser(body.user.id, user);

  ack({
    response_action: "update",
    view: payloads.modals.showService({
      service: metadata.service,
      email: metadata.email,
      password: gen
    })
  });
});

app.view("service:show", async ({ ack, context, view, body }) => {
  ack();

  const user = await getUser(body.user.id, body.team.id);
  await publishHomeView(body.user.id, user, context);
});

const publishHomeView = (userId, user, context) => {
  let services = user.services
    ? user.services.sort((a, b) => {
        return b.lastUsed.seconds - a.lastUsed.seconds;
      })
    : [];

  services = services.length > 30 ? services.slice(0, 30) : services;

  const view = payloads.home.home();
  services.forEach(service => {
    view.blocks = view.blocks.concat(payloads.components.service({ service }));
  });

  return app.client.views.publish({
    token: context.botToken,
    user_id: userId,
    view
  });
};

/**
get user from store
if user doesn't exist in store, save user to store and return
**/
const getUser = async (userId, teamId) => {
  let user = await store.findUser(userId);
  if (!user) {
    user = await store.saveUser(userId, {
      team_id: teamId
    });
  }
  return user;
};

app.error(error => {
  console.error(error);
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
