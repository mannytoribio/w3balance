export type W3balanceContract = {
  version: '0.1.0';
  name: 'w3balance_contract';
  instructions: [
    {
      name: 'createPortfolio';
      accounts: [
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'delegatedRebalanceAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'data';
          type: {
            defined: 'CreatePortfolioData';
          };
        }
      ];
    },
    {
      name: 'addPortfolioTokenAllocation';
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioTokenAllocationTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mintAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'data';
          type: {
            defined: 'AddPortfolioTokenAllocationData';
          };
        }
      ];
    },
    {
      name: 'depositPortfolio';
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioTokenAllocationTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'data';
          type: {
            defined: 'DepositPortfolioData';
          };
        }
      ];
    },
    {
      name: 'withdrawalPortfolio';
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioTokenAllocationTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'data';
          type: {
            defined: 'WithdrawalPortfolioData';
          };
        }
      ];
    },
    {
      name: 'rebalancePortfolio';
      accounts: [
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'cpSwapProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'ammConfig';
          isMut: false;
          isSigner: false;
          docs: ['The factory state to read protocol fees'];
        },
        {
          name: 'poolState';
          isMut: true;
          isSigner: false;
          docs: [
            'The program account of the pool in which the swap will be performed'
          ];
        },
        {
          name: 'inputTokenAccount';
          isMut: true;
          isSigner: false;
          docs: ['The user token account for input token'];
        },
        {
          name: 'outputTokenAccount';
          isMut: true;
          isSigner: false;
          docs: ['The user token account for output token'];
        },
        {
          name: 'inputVault';
          isMut: true;
          isSigner: false;
          docs: ['The vault token account for input token'];
        },
        {
          name: 'outputVault';
          isMut: true;
          isSigner: false;
          docs: ['The vault token account for output token'];
        },
        {
          name: 'inputTokenProgram';
          isMut: false;
          isSigner: false;
          docs: ['SPL program for input token transfers'];
        },
        {
          name: 'outputTokenProgram';
          isMut: false;
          isSigner: false;
          docs: ['SPL program for output token transfers'];
        },
        {
          name: 'inputTokenMint';
          isMut: false;
          isSigner: false;
          docs: ['The mint of input token'];
        },
        {
          name: 'outputTokenMint';
          isMut: false;
          isSigner: false;
          docs: ['The mint of output token'];
        },
        {
          name: 'observationState';
          isMut: true;
          isSigner: false;
          docs: ['The program account for the most recent oracle observation'];
        }
      ];
      args: [
        {
          name: 'amountIn';
          type: 'u64';
        },
        {
          name: 'minimumAmountOut';
          type: 'u64';
        }
      ];
    },
    {
      name: 'proxyInitialize';
      accounts: [
        {
          name: 'cpSwapProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
          docs: ['Address paying to create the pool. Can be anyone'];
        },
        {
          name: 'ammConfig';
          isMut: false;
          isSigner: false;
          docs: ['Which config the pool belongs to.'];
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'poolState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'token0Mint';
          isMut: false;
          isSigner: false;
          docs: ['Token_0 mint, the key must smaller then token_1 mint.'];
        },
        {
          name: 'token1Mint';
          isMut: false;
          isSigner: false;
          docs: ['Token_1 mint, the key must grater then token_0 mint.'];
        },
        {
          name: 'lpMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'creatorToken0';
          isMut: true;
          isSigner: false;
          docs: ['payer token0 account'];
        },
        {
          name: 'creatorToken1';
          isMut: true;
          isSigner: false;
          docs: ['creator token1 account'];
        },
        {
          name: 'creatorLpToken';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'token0Vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'token1Vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'createPoolFee';
          isMut: true;
          isSigner: false;
          docs: ['create pool fee account'];
        },
        {
          name: 'observationState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
          docs: ['Program to create mint account and mint tokens'];
        },
        {
          name: 'token0Program';
          isMut: false;
          isSigner: false;
          docs: ['Spl token program or token program 2022'];
        },
        {
          name: 'token1Program';
          isMut: false;
          isSigner: false;
          docs: ['Spl token program or token program 2022'];
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
          docs: ['Program to create an ATA for receiving position NFT'];
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
          docs: ['To create a new program account'];
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
          docs: ['Sysvar for program account'];
        }
      ];
      args: [
        {
          name: 'initAmount0';
          type: 'u64';
        },
        {
          name: 'initAmount1';
          type: 'u64';
        },
        {
          name: 'openTime';
          type: 'u64';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'portfolioTokenAllocation';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'percentage';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'portfolio';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'uniqueName';
            type: 'string';
          },
          {
            name: 'totalPercentage';
            type: 'u8';
          },
          {
            name: 'delegatedRebalanceAddress';
            type: 'publicKey';
          },
          {
            name: 'updateFrequency';
            type: 'u8';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'AddPortfolioTokenAllocationData';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'percentage';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'CreatePortfolioData';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'uniqueName';
            type: 'string';
          },
          {
            name: 'delegatedRebalanceAddress';
            type: 'publicKey';
          },
          {
            name: 'updateFrequency';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'DepositPortfolioData';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'amount';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'WithdrawalPortfolioData';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'amount';
            type: 'u64';
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'PercentageMoreThan100';
      msg: 'Portfolio token allocation exceeds 100 percent';
    }
  ];
};

export const IDL: W3balanceContract = {
  version: '0.1.0',
  name: 'w3balance_contract',
  instructions: [
    {
      name: 'createPortfolio',
      accounts: [
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'delegatedRebalanceAddress',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'CreatePortfolioData',
          },
        },
      ],
    },
    {
      name: 'addPortfolioTokenAllocation',
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioTokenAllocationTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mintAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'AddPortfolioTokenAllocationData',
          },
        },
      ],
    },
    {
      name: 'depositPortfolio',
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioTokenAllocationTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'DepositPortfolioData',
          },
        },
      ],
    },
    {
      name: 'withdrawalPortfolio',
      accounts: [
        {
          name: 'portfolioTokenAllocationAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioTokenAllocationTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'WithdrawalPortfolioData',
          },
        },
      ],
    },
    {
      name: 'rebalancePortfolio',
      accounts: [
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'cpSwapProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'ammConfig',
          isMut: false,
          isSigner: false,
          docs: ['The factory state to read protocol fees'],
        },
        {
          name: 'poolState',
          isMut: true,
          isSigner: false,
          docs: [
            'The program account of the pool in which the swap will be performed',
          ],
        },
        {
          name: 'inputTokenAccount',
          isMut: true,
          isSigner: false,
          docs: ['The user token account for input token'],
        },
        {
          name: 'outputTokenAccount',
          isMut: true,
          isSigner: false,
          docs: ['The user token account for output token'],
        },
        {
          name: 'inputVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for input token'],
        },
        {
          name: 'outputVault',
          isMut: true,
          isSigner: false,
          docs: ['The vault token account for output token'],
        },
        {
          name: 'inputTokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['SPL program for input token transfers'],
        },
        {
          name: 'outputTokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['SPL program for output token transfers'],
        },
        {
          name: 'inputTokenMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of input token'],
        },
        {
          name: 'outputTokenMint',
          isMut: false,
          isSigner: false,
          docs: ['The mint of output token'],
        },
        {
          name: 'observationState',
          isMut: true,
          isSigner: false,
          docs: ['The program account for the most recent oracle observation'],
        },
      ],
      args: [
        {
          name: 'amountIn',
          type: 'u64',
        },
        {
          name: 'minimumAmountOut',
          type: 'u64',
        },
      ],
    },
    {
      name: 'proxyInitialize',
      accounts: [
        {
          name: 'cpSwapProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: true,
          docs: ['Address paying to create the pool. Can be anyone'],
        },
        {
          name: 'ammConfig',
          isMut: false,
          isSigner: false,
          docs: ['Which config the pool belongs to.'],
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'poolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'token0Mint',
          isMut: false,
          isSigner: false,
          docs: ['Token_0 mint, the key must smaller then token_1 mint.'],
        },
        {
          name: 'token1Mint',
          isMut: false,
          isSigner: false,
          docs: ['Token_1 mint, the key must grater then token_0 mint.'],
        },
        {
          name: 'lpMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'creatorToken0',
          isMut: true,
          isSigner: false,
          docs: ['payer token0 account'],
        },
        {
          name: 'creatorToken1',
          isMut: true,
          isSigner: false,
          docs: ['creator token1 account'],
        },
        {
          name: 'creatorLpToken',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'token0Vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'token1Vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'createPoolFee',
          isMut: true,
          isSigner: false,
          docs: ['create pool fee account'],
        },
        {
          name: 'observationState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Program to create mint account and mint tokens'],
        },
        {
          name: 'token0Program',
          isMut: false,
          isSigner: false,
          docs: ['Spl token program or token program 2022'],
        },
        {
          name: 'token1Program',
          isMut: false,
          isSigner: false,
          docs: ['Spl token program or token program 2022'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Program to create an ATA for receiving position NFT'],
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
          docs: ['To create a new program account'],
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
          docs: ['Sysvar for program account'],
        },
      ],
      args: [
        {
          name: 'initAmount0',
          type: 'u64',
        },
        {
          name: 'initAmount1',
          type: 'u64',
        },
        {
          name: 'openTime',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'portfolioTokenAllocation',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            type: 'publicKey',
          },
          {
            name: 'percentage',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'portfolio',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'uniqueName',
            type: 'string',
          },
          {
            name: 'totalPercentage',
            type: 'u8',
          },
          {
            name: 'delegatedRebalanceAddress',
            type: 'publicKey',
          },
          {
            name: 'updateFrequency',
            type: 'u8',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'AddPortfolioTokenAllocationData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            type: 'publicKey',
          },
          {
            name: 'percentage',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'CreatePortfolioData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'uniqueName',
            type: 'string',
          },
          {
            name: 'delegatedRebalanceAddress',
            type: 'publicKey',
          },
          {
            name: 'updateFrequency',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'DepositPortfolioData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'WithdrawalPortfolioData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'PercentageMoreThan100',
      msg: 'Portfolio token allocation exceeds 100 percent',
    },
  ],
};
