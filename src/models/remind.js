const { model, Schema } = require("mongoose");

const reminderSchema = new Schema({
    userId: String,
    time: String,
    Remind: String,
});

module.exports = model("reminders", reminderSchema);
