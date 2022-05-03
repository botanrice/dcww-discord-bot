import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
  TEST_COMMAND,
  EMBED_COMMAND,
  HasGuildCommands,
} from './commands.js';

// Create an express app
const app = express();
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


app.get('/', async function (req, res) {
  return res.send("Hello, World!");
});

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  console.log("Hitting /interactions...");

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'testONG... ' + getRandomEmoji(),
        },
      });
    }

    // "embed" guild command
    if (name === 'embed') {
      console.log("Beginning to build embed");

      // Begin building an embed
      const userId = req.body.member.user.id;

      return res.send({
        type: InteractionResponseType.APPLICATION_MODAL,
        data: {
          custom_id: 'artist_info_modal',
          title: 'Artist Info',
          components: [
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'artist_name',
                  style: 1,
                  label: 'Artist Name',
                  placeholder: '',
                },
              ],
            },
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'artist_music_link',
                  style: 1,
                  label: 'Music Link (Must be a valid URL!)',
                  placeholder: 'https://soundcloud.com/stoicdamc',
                },
              ],
            },
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'artist_social_link',
                  style: 1,
                  label: 'Socials Link (Must be a valid URL!)',
                  placeholder: 'https://instagram.com/stoicdapoet',
                },
              ],
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'artist_image',
                  // Bigger text box for input
                  style: 1,
                  label: 'Artist Image (Must be a valid URL!)',
                  placeholder: 'https://i1.sndcdn.com/avatars-GWFjMNpylpmNqjzz-c0aEgQ-t500x500.jpg',
                },
              ],
            },
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'artist_genres',
                  style: 1,
                  label: 'What genre do you make?',
                  placeholder: 'boom bap, funk',
                },
              ],
            },
          ],
        },
      });

      // return res.send({
      //   type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //   data: {
      //     // Fetches a random emoji to send from a helper function
      //     content: `Beginning embed builder for <@${userId}>`,
      //     components: [
      //       {
      //         type: MessageComponentTypes.ACTION_ROW,
      //         components: [
      //           {
      //             type: MessageComponentTypes.BUTTON,
      //             // Append the game ID to use later on
      //             custom_id: `accept_button_${req.body.id}`,
      //             label: 'Begin',
      //             style: ButtonStyleTypes.PRIMARY,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // });
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) { 
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    if (componentId.startsWith('accept_button_')) {
      console.log("Beginning to build embed");
      // get the associated game ID
      const embedId = componentId.replace('accept_button_', '');
      // Delete message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      try {
        return res.send({
          type: InteractionResponseType.APPLICATION_MODAL,
          data: {
            custom_id: 'artist_info_modal',
            title: 'Artist Info',
            components: [
              {
                // Text inputs must be inside of an action component
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                    type: MessageComponentTypes.INPUT_TEXT,
                    custom_id: 'artist_name',
                    style: 1,
                    label: 'Artist Name',
                    placeholder: '',
                  },
                ],
              },
              {
                // Text inputs must be inside of an action component
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.INPUT_TEXT,
                    custom_id: 'artist_music_link',
                    style: 1,
                    label: 'Music Link (Must be a valid URL!)',
                    placeholder: 'https://soundcloud.com/stoicdamc',
                  },
                ],
              },
              {
                // Text inputs must be inside of an action component
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.INPUT_TEXT,
                    custom_id: 'artist_social_link',
                    style: 1,
                    label: 'Socials Link (Must be a valid URL!)',
                    placeholder: 'https://instagram.com/stoicdapoet',
                  },
                ],
              },
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.INPUT_TEXT,
                    custom_id: 'artist_image',
                    // Bigger text box for input
                    style: 1,
                    label: 'Artist Image (Must be a valid URL!)',
                    placeholder: 'https://i1.sndcdn.com/avatars-GWFjMNpylpmNqjzz-c0aEgQ-t500x500.jpg',
                  },
                ],
              },
              {
                // Text inputs must be inside of an action component
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.INPUT_TEXT,
                    custom_id: 'artist_genres',
                    style: 1,
                    label: 'What genre do you make?',
                    placeholder: 'boom bap, funk',
                  },
                ],
              },
            ],
          },
        });
        // Delete previous message
        // await DiscordRequest(endpoint, { method: 'DELETE' });
      } catch (err) {
        console.error('Error sending message:', err);
      }
    } else if (componentId.startsWith('select_choice_')) { 
      console.log("hey, this isn't ready yet"); 
    }
    else { 
      console.log("welp... this is awkward"); 
    }
  }

  /**
   * Handle modal submissions
   */
   if (type === InteractionType.APPLICATION_MODAL_SUBMIT) {
    // custom_id of modal
    const modalId = data.custom_id;
    // user ID of member who filled out modal
    const userId = req.body.member.user.id;

    // Get Channel to post embed to: https://discord.com/developers/docs/resources/channel#get-channel
    const channelEndpoint = `channels/${process.env.EMBED_CHANNEL_ID}`;

    if (modalId === 'artist_info_modal') {
      // As the modal is hardcoded, the values will always be in this order:
      // [0]artist_name, [1]music_link, [2]social_link, [3]image_link, [4]genre
      let artistValues = [ ];
      // Get value of text inputs
      for (let action of data.components) {
        let inputComponent = action.components[0];
        artistValues.push(inputComponent.value);
      }

      // TODO: Sanitize inputs, regex for URL inputs
      const urlExpression2 = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/g;
      var regex = new RegExp(urlExpression2);
      if (!artistValues[1].trim().match(regex) || !artistValues[2].trim().match(regex) || !artistValues[3].trim().match(regex)) {
        console.log("Invalid URL");
        return res.status(500).send({
          type: InteractionResponseType.PONG,
        });
      }

      const messageContent = {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: `NEW ARTIST | DROP COLUMN UNDERGROUND`,
        tts: false,
        allowed_mentions: {
          replied_user: false,
          parse: [
            "users"
          ]
        },
        embeds: [
          {
            type: "rich",
            title: `Artist`,
            description: `Meet ${artistValues[0]}`,
            color: 0x9000ff,
            fields: [
              {
                name: `Artist Name`,
                value: `${artistValues[0]}`
              },
              {
                name: `Music Link`,
                value: `${artistValues[1]}`
              },
              {
                name: `Social Link`,
                value: `${artistValues[2]}`
              },
              {
                name: `Genre(s)`,
                value: `${artistValues[4]}`
              },
            ],
            image: {
              url: `${artistValues[3]}`,
              height: null,
              width: null
            }
          }
        ]
      }

      // Post a message to the embed channel
      const createEmbedEndpoint = `/channels/${process.env.EMBED_CHANNEL_ID}/messages`;
      try {
        // Send HTTP request with bot token
        const res = await DiscordRequest(createEmbedEndpoint, {
          method: 'POST',
          body: messageContent,
        });
        // console.log(await res.json());
      } catch (err) {
        console.error('Error installing commands: ', err);
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Hey, <@${userId}>, check the #test channel!`,
        },
      });
    }
  }
});

// Heroku must listen on specific port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log('Listening on port 3000');

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    EMBED_COMMAND,
  ]);
});
