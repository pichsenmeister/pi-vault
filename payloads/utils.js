module.exports = {
  divider: () => {
    return { type: "divider" }
  },
  spacer: {
    type: "context",
    elements: [
      {
        type: "image",
        image_url:
          "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
        alt_text: "placeholder"
      }
    ]
  }
};
