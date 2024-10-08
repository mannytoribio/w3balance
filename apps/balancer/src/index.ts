import express from 'express';

import { executeDemoSwaps } from './service';
import { scheduleBalanceJob } from '@libs/balancer';

const app = express();
app.use(express.json());
app.post('/balance/:portfolioAccount', async (req, res) => {
  const portfolioAccount = req.params.portfolioAccount;
  await executeDemoSwaps(portfolioAccount);
  await scheduleBalanceJob(portfolioAccount);
  res.send({});
});

app.listen(8080, () => {
  console.log('listening on 8080');
});
