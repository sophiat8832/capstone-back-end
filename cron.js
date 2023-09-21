import cron from 'cron';
import https from 'https';

const backendURL = 'https://restaurant-rec-api-back-end.onrender.com/record';
const job = new cron.CronJob('*/14 * * * *', function () {
    console.log("Restarting server");

    https
        .get(backendURL, (res) => {
            if (res.statusCode === 200) {
                console.log('Server restarted');
            } else {
                console.error(
                    `failed to restart server with status code: ${res.statusCode}`
                );
            }
        })
        .on('error', (err) => {
            console.error('Error during Restart: ', err.message);
        });
});

export { job };
