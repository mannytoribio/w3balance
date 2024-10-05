import express from 'express';
import { getPortfolioCol, getTokenAllocationCol } from '@libs/data';
import { fetchTokenPrices, supportTokens } from '@libs/program';

const app = express();
app.use(express.json());
app.post('/balance/:portfolioAccount', async (req, res) => {
  const { portfolioAccount } = req.params;
  const { data } = req.body;

  const col = await getPortfolioCol();
  const tokenAllocationCol = await getTokenAllocationCol();
  const portfolio = (await col.findOne({ accountKey: portfolioAccount }))!;
  const allocations = await tokenAllocationCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  // we need to figure out how to match the allocation distribution defined in the portfolio;
  const tokenPrices = await fetchTokenPrices(
    supportTokens.filter((t) => t.name !== 'USDC').map((t) => t.mainnetAddress),
    supportTokens.find((t) => t.name === 'USDC')!.mainnetAddress
  );

  res.send('OK');
});

app.listen(8080, () => {
  console.log('listening on 8080');
});
