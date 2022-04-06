const logger = require('./logger')
const CronJob = require('cron').CronJob;

let client;
let db;
const startNamJob = async (c, database) => {
    client = c
    db = database

    const job = new CronJob('00 00 06 * * *', function () {
        logger.log("GFM VIETNAM");
        client.meEverywhere(db.getChannelNames(), "GOOD FUCKING MORNING VIETNAM NaM 🇻🇳 ")
    }, null, true, 'Asia/Pontianak');
    job.start();
    logger.log("started gfmvn job")
}

exports.startNamJob = startNamJob
