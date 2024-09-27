import { readFile } from 'fs/promises';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import { createPool } from './pool';
import { deposit } from './deposit';
import { swapBaseOut } from './swap';

const mints = [
  '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
  '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
  '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
  'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
  '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
];

const pools = [
  {
    tokens: [mints[0], mints[1]],
    key: '6YxadC27FBT2fbRfQBxDvUFzewdiosLJufRqeRRYhwQZ',
  },
  {
    key: '6aSLCTGSJLvJBNVx5hAEpxCp7RLN8TQGhARKGUJhu2SV',
    tokens: [mints[0], mints[2]],
  },
  {
    key: 'B32twZ4GzQu5zUMenr33BJLzq6zLPdzTFx2S8iaK4oNH',
    tokens: [mints[0], mints[3]],
  },
  {
    key: '2JT21yJ2LseZaWWMwxr2FXuKjNLo72ajvASUt2c9yh7U',
    tokens: [mints[0], mints[4]],
  },
  {
    key: 'CSe83eWr37QY5bjvUCUjYLyABpNpCfomsZMJ6SDM94JN',
    tokens: [mints[1], mints[2]],
  },
  {
    key: 'G2nhrgy9YS5ryRRuk2gSNrCmSSJ8Hyjth5QQ2ZXnYe9u',
    tokens: [mints[1], mints[3]],
  },
  {
    key: '7sTmLc79yqi6aPu3EG9FwKZrKjMStjFEPiu1XNRrEfzx',
    tokens: [mints[1], mints[4]],
  },
  {
    key: '6KroX5E4kGKQc2otNPUiqkwYYstKFb6yeaNZCz2ojnMS',
    tokens: [mints[2], mints[3]],
  },
  {
    key: 'B9R3vmYoeRViVe7nWEU8D46tHBj4xSbSmFC8B4qpsBTs',
    tokens: [mints[2], mints[4]],
  },
  {
    key: 'FLC99i7uRrevpbigYWCDdb5FfjFSQaaC8bqfTzRnYZtw',
    tokens: [mints[3], mints[4]],
  },
];

(async () => {
  const owner = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        await readFile('/Users/zacharyroberts/wallets/poker-dev.json', 'utf-8')
      )
    )
  );
  const connection = new Connection(
    'https://devnet.helius-rpc.com/?api-key=db35e690-4c77-45d5-8dbf-776893e28551'
  );
  //   const decimals = 9;
  //   const mints: PublicKey[] = [];
  //   for (let i = 0; i < 5; i++) {
  //     console.log('Creating mint', i);
  //     mints.push(
  //       await createMint(connection, owner, owner.publicKey, null, decimals)
  //     );
  //   }
  //   console.log(mints);

  //   for (let i = 0; i < 5; i++) {
  //     const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
  //       connection,
  //       owner,
  //       new PublicKey(mints[i]),
  //       owner.publicKey,
  //       true
  //     );
  //     console.log('Minting to', ownerTokenAccount.address.toBase58());
  //     await mintTo(
  //       connection,
  //       owner,
  //       new PublicKey(mints[i]),
  //       ownerTokenAccount.address,
  //       owner,
  //       100_000_000_000_000
  //     );
  //     console.log('Minted to', ownerTokenAccount.address.toBase58());
  //   }

  // for (let i = 0; i < mints.length; i++) {
  //   for (let j = 1; j < mints.length; j++) {
  const mint1 = new PublicKey(mints[3]);
  const mint2 = new PublicKey(mints[4]);
  // const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   owner,
  //   new PublicKey(mint1),
  //   owner.publicKey,
  //   true
  // );
  // console.log('Minting to', ownerTokenAccount.address.toBase58());
  // await mintTo(
  //   connection,
  //   owner,
  //   new PublicKey(mint1),
  //   ownerTokenAccount.address,
  //   owner,
  //   100_000_000_000_000_000_000
  // );
  const poolId = await createPool(owner, connection, mint1, mint2);

  console.log(
    'Created',
    poolId,
    'between',
    mint1.toString(),
    'and',
    mint2.toString()
  );

  await deposit(
    owner,
    connection,
    'GfxHgi63Vs4vT2qVtr1FoP4TL1HL5utStmDdgSPaxgZi',
    '100'
  );
  // }
  // }

  // for (let i = 0; i < 5; i++) {
  //   const tokenAccount = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     owner,
  //     new PublicKey(mints[i]),
  //     owner.publicKey,
  //     true
  //   );
  //   console.log(tokenAccount.amount);
  // }
  // await swapBaseOut(
  //   owner,
  //   connection,
  //   pools[0].key,
  //   new PublicKey(pools[0].tokens[0]),
  //   1 * 10 ** 9
  // );
})();
