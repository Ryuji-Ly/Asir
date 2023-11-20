const { ShardingManager } = require("discord.js");
var colors = require("colors");
colors.enable();
require("dotenv").config();

const manager = new ShardingManager("./src/index.js", {
    token: process.env.token,
    respawn: true,
    timeout: -1,
    totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
    shard.on("reconnecting", () => {
        console.log(`[SHARDING MANAGER] Reconnecting Shard: [${shard.id}]`.yellow);
    });
    shard.on("spawn", () => {
        console.log(`[SHARDING MANAGER] Launched Shard: [${shard.id}]`.cyan);
    });
    shard.on("ready", () => {
        console.log(`[SHARDING MANAGER] Shard [${shard.id}] is ready`.green);
    });
    shard.on("death", () => {
        console.log(`[SHARDING MANAGER] Shard died: [${shard.id}]`.red);
    });
    shard.on("error", (err) => {
        console.log(`[SHARDING MANAGER] Error in Shard [${shard.id}] with : ${err}`.red);
        shard.respawn();
    });
});

manager
    .spawn({ amount: "auto", delay: 5500, timeout: 30000 })
    .catch((e) => console.log(`[SHARDING MANAGER] Error spawning SHARDING MANAGER: ${e}`.red));
