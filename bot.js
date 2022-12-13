// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { Configuration, OpenAIApi } = require("openai");

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            
            const configuration = new Configuration({
              apiKey: process.env.OPENAI_API_KEY,
            });

            const openai = new OpenAIApi(configuration);
            
             const prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n                Human: Hello, who are you?\n                AI: I am an AI created by @upster. How can I help you today?\n                Human:  ${context.activity.text}\n                AI:`;
            
            // Uncomment the following prompt to make the AI pretent that it is Mahatma Gandhi. Feel free to change the name to anyone you like.
            // const prompt = `The following is a conversation with an AI assistant. The assistant is Mahatma Gandhi.\nHuman: Hello, who are you?\nAI: I am an AI created by @upster. How can I help you today?\nHuman:  ${context.activity.text}\nAI:`;

            // Uncomment the following prompt to make the AI be sarcastic and rude. Feel free to change the name to anyone you like.
            // const prompt = `The following is a conversation with an AI assistant. The assistant is rude and sarcastic.\nHuman: Hello, who are you?\nAI: I am an AI created by @upster. What do you need, human??\nHuman:  ${context.activity.text}\nAI:`;


            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
                stop: [" Human:", " AI:"],
              });

            const replyText = response.data.choices[0].text.trim();

            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
