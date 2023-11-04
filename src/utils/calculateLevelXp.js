module.exports = (level) => {
    if (level >= 50) {
        return 100 * 10 * level;
    } else {
        return 100 * level;
    }
};
