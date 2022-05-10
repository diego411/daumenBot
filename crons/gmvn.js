const logger = require('../utils/logger')
const CronJob = require('cron').CronJob;

let client = require('../client');
let db = require('../database');
exports.startNamJob = async () => {
    const job = new CronJob('00 00 06 * * *', async function () {
        logger.log("GFM VIETNAM");
        client.meEverywhere(await db.getChannelNames(), "GOOD FUCKING MORNING VIETNAM NaM 🇻🇳 ")
    }, null, true, 'Asia/Pontianak');
    job.start();
    logger.log("started gfmvn job")
}