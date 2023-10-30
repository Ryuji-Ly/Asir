const { ShardingManager } = require("discord.js");
var colors = require("colors");
colors.enable();
require("dotenv").config();

const manager = new ShardingManager("./src/index.js", {
    token: process.env.token,
});

manager.on("shardCreate", (shard) => {
    console.log(`[SHARDING MANAGER] launched shard [${shard.id}]`.green);
});

manager.spawn();
