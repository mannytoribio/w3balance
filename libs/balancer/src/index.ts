import { PROJECT_ID } from '@libs/environment';
import { CloudTasksClient } from '@google-cloud/tasks';
import { Timestamp } from 'firebase-admin/firestore';
import { getPortfolioCol } from '@libs/data';
import { addDays, addHours, addMonths, addYears } from 'date-fns';

export const scheduleBalanceJob = async (
  portfolioAccount: string,
  force = false
) => {
  const client = new CloudTasksClient();
  const url = 'https://balancer-1037883282783.us-east4.run.app';
  const parent = client.queuePath(PROJECT_ID, 'us-east4', 'balancer');
  const col = await getPortfolioCol();
  const portfolio = await col.findOne({ accountKey: portfolioAccount });
  let scheduleTime = new Date();
  switch (portfolio?.rebalanceFrequency) {
    case 0:
      scheduleTime = addHours(scheduleTime, 1);
      break;
    case 1:
      scheduleTime = addDays(scheduleTime, 1);
      break;
    case 2:
      scheduleTime = addMonths(scheduleTime, 1);
      break;
    case 3:
      scheduleTime = addYears(scheduleTime, 1);
      break;
    default:
      scheduleTime = addDays(scheduleTime, 1);
      break;
  }
  await client.createTask({
    parent,
    task: {
      name: client.taskPath(
        PROJECT_ID,
        'us-east4',
        'balancer',
        `balance-${portfolioAccount}-${Date.now()}`
      ),
      httpRequest: {
        httpMethod: 'POST',
        url: `${url}/balance/${portfolioAccount}`,
        // oidcToken: {
        //   serviceAccountEmail: `${PROJECT_ID}@appspot.gserviceaccount.com`,
        // },
      },
      ...(force ? {} : { scheduleTime: Timestamp.fromDate(scheduleTime) }),
    },
  });
};
