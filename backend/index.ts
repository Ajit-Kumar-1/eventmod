import createApp from './src/app.ts';
import registerCronJobs from './src/cron/index.ts';

const app = createApp();
const port = 3000;

registerCronJobs();

app.listen(port, () => console.log(`Backend listening on port ${port}`));
