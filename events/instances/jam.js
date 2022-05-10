const RESPONSE_TYPE = require('../../client').RESPONSE_TYPE
const jam = ['lebronJAM aye', 'TriKool aye', 'TriKool🔥', '🔥THIS SOME🔥lebronJAM🔥ABSOLUTE FIRE🔥', 'lebronJAM 🔥', '🔥TriDance🔥', 'TriDance 🔥', 'TriDance', 'TriDance aye', 'TriKool'];

module.exports = {
    name: "jam",
    code: () => jam[Math.floor(Math.random() * jam.length)],
    trigger: (msg) => msg.messageText.includes('lebronJAM'),
    response_callback: RESPONSE_TYPE.ME
}