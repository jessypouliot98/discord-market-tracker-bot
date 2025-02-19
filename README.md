# discord-market-tracket-bot

## Setup

1) [Create a discord bot](https://discord.com/developers/applications)
   - Configuration
     - Installation Contexts:
       - `Guild Install`
     - Install Settings:
       - Scopes:
         - `application.commands`
         - `bot`
       - Permissions
         - `Embed Links`
         - `Manage Channels`
         - `Send Messages`
2) Create your `.env`
   - Copy the env template as your `.env`
     - `cp .env.template .env`
   - Fill in the **DISCORD_*** variables
     - **DISCORD_ID**
       - `General Information` > `APPLICATION ID`
     - **DISCORD_TOKEN**
       - `Bot` > `TOKEN`
   - _Rest is optional or needs to be defined here 🤷‍♂️_
3) Database setup
   - Migrate the db
     - `bun db:push`
4) Running the application
   - `bun start`
