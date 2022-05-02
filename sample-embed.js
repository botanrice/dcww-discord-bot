const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.3.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": `DROP COLUMN UNDERGROUND`,
  "tts": false,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "custom_id": `row_0_select_0`,
          "placeholder": `Interact with this artist`,
          "options": [
            {
              "label": `Say whaddup!`,
              "value": `whaddup`,
              "description": `Send a message saying yo!`,
              "emoji": {
                "id": null,
                "name": `👋`
              },
              "default": false
            },
            {
              "label": `Give Kudos`,
              "value": `kudos`,
              "description": `Tell this person you like their music`,
              "emoji": {
                "id": null,
                "name": `💪`
              },
              "default": false
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    }
  ],
  "allowed_mentions": {
    "replied_user": false,
    "parse": [
      "users"
    ]
  },
  "embeds": [
    {
      "type": "rich",
      "title": `Artist`,
      "description": `Artist card`,
      "color": 0x9000ff,
      "fields": [
        {
          "name": `Artist Name`,
          "value": `stoic da poet`
        },
        {
          "name": `Discord Name`,
          "value": `stoic da muhfucka`
        },
        {
          "name": `Soundcloud`,
          "value": `https://soundcloud.com/stoicdamc`
        },
        {
          "name": `Social`,
          "value": `https://instagram.com/stoicdapoet`
        },
        {
          "name": `Artist Type`,
          "value": `rapper`
        },
        {
          "name": `Genre(s)`,
          "value": `boom bap, experimental`
        }
      ],
      "image": {
        "url": `https://i1.sndcdn.com/avatars-GWFjMNpylpmNqjzz-c0aEgQ-t500x500.jpg`,
        "height": null,
        "width": null
      }
    }
  ]
});