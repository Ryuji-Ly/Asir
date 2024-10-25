const { ShardingManager, WebhookClient, EmbedBuilder } = require("discord.js");
var colors = require("colors");
colors.enable();
require("dotenv").config();

const manager = new ShardingManager("./src/index.js", {
    token: process.env.token,
    respawn: true,
    timeout: -1,
    totalShards: "auto",
});
const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
const embed = new EmbedBuilder().setAuthor({ name: `[SHARDING MANAGER]` });

manager.on("shardCreate", (shard) => {
    shard.on("reconnecting", () => {
        let string = `\`\`\`ansi\n[0;33m[SHARDING MANAGER] Reconnecting Shard: [${shard.id}]\`\`\``;
        embed.setDescription(string).setColor("Yellow");
        // webhookClient
        //     .send({ embeds: [embed] })
        //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
        console.log(`[SHARDING MANAGER] Reconnecting Shard: [${shard.id}]`.yellow);
    });
    shard.on("spawn", () => {
        let string = `\`\`\`ansi\n[0;34m[SHARDING MANAGER] Launched Shard: [${shard.id}]\`\`\``;
        embed.setDescription(string).setColor("Blue");
        // webhookClient
        //     .send({ embeds: [embed] })
        //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
        console.log(`[SHARDING MANAGER] Launched Shard: [${shard.id}]`.cyan);
    });
    shard.on("ready", () => {
        let string = `\`\`\`ansi\n[0;32m[SHARDING MANAGER] Shard [${shard.id}] is ready\`\`\``;
        embed.setDescription(string).setColor("Green");
        // webhookClient
        //     .send({ embeds: [embed] })
        //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
        console.log(`[SHARDING MANAGER] Shard [${shard.id}] is ready`.green);
    });
    shard.on("death", () => {
        let string = `\`\`\`ansi\n[0;31m[SHARDING MANAGER] Shard died: [${shard.id}]\`\`\``;
        embed.setDescription(string).setColor("Red");
        // webhookClient
        //     .send({ embeds: [embed] })
        //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
        console.log(`[SHARDING MANAGER] Shard died: [${shard.id}]`.red);
    });
    shard.on("error", (err) => {
        let string = `\`\`\`ansi\n[0;31m[SHARDING MANAGER] Error in Shard [${shard.id}] with : ${err.stack}\`\`\``;
        embed.setDescription(string).setColor("Red");
        // webhookClient
        //     .send({ embeds: [embed] })
        //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
        console.log(`[SHARDING MANAGER] Error in Shard [${shard.id}] with : ${err.stack}`.red);
        shard.respawn();
    });
});

manager.spawn({ amount: "auto", delay: 5500, timeout: 30000 }).catch((e) => {
    let string = `\`\`\`ansi\n[0;31m[SHARDING MANAGER] Error spawning SHARDING MANAGER: ${e.stack}\`\`\``;
    embed.setDescription(string).setColor("Red");
    // webhookClient
    //     .send({ embeds: [embed] })
    //     .catch((e) => console.log(`[SHARDING MANAGER] Webhook failed to send`.red));
    console.log(`[SHARDING MANAGER] Error spawning SHARDING MANAGER: ${e.stack}`.red);
});
