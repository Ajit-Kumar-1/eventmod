import cron from 'node-cron';
import resetExpired from './ResetExpiredHandler.ts';

export default function registerCronJobs() {
  cron.schedule('*/1 * * * *', resetExpired);
}
