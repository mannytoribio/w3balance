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
      name: 'withdrawPortfolio';
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
          name: 'mint';
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
            defined: 'WithdrawPortfolioData';
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
      name: 'demoRebalancePortfolio';
      accounts: [
        {
          name: 'portfolioAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'delegatedTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'portfolioTokenAllocationAccount';
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
          name: 'payer';
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'amountIn';
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
      name: 'WithdrawPortfolioData';
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
      name: 'withdrawPortfolio',
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
          name: 'mint',
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
            defined: 'WithdrawPortfolioData',
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
      name: 'demoRebalancePortfolio',
      accounts: [
        {
          name: 'portfolioAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'delegatedTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'portfolioTokenAllocationAccount',
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
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'amountIn',
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
      name: 'WithdrawPortfolioData',
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
