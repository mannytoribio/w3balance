// import express from 'express';
// import { getPortfolioCol, getTokenAllocationCol } from '@libs/data';
// import { fetchTokenPrices, supportTokens } from '@libs/program';

import { executeSwaps } from './service';

// const app = express();
// app.use(express.json());
// app.post('/balance/:portfolioAccount', async (req, res) => {
//   const { portfolioAccount } = req.params;
//   const { data } = req.body;
//   res.send('OK');
// });

// app.listen(8080, () => {
//   console.log('listening on 8080');
// });

(async () => {
  const profileAccount = 'KoAhgm1wcmHJsc8h3hxj3j8R2raaB5khsSxhfLZZ1qb';
  await executeSwaps(profileAccount);
})();
