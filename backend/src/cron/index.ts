import cron from 'node-cron';
import resetExpired from './ResetExpiredHandler.ts';
import addRandomEvent from './AddRandomEventHandler.ts';

export default function registerCronJobs() {
  cron.schedule('*/1 * * * *', resetExpired);
  cron.schedule('*/1 * * * *', addRandomEvent);
}
