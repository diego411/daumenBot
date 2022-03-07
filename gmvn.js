const CronJob = require('cron').CronJob;

const startNamJob = () => {
    const job = new CronJob('00 00 00 * * *', function () {
        const d = new Date();
        console.log('Midnight:', d);
    }, null, true, 'America/Los_Angeles');
    console.log('After job instantiation');
    job.start();
}

exports.startNamJob = startNamJob