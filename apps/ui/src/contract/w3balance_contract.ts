export type W3balanceContract = {
  "version": "0.1.0",
  "name": "w3balance_contract",
  "instructions": [
    {
      "name": "createPortfolio",
      "accounts": [
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "CreatePortfolioData"
          }
        }
      ]
    },
    {
      "name": "addPortfolioTokenAllocation",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "AddPortfolioTokenAllocationData"
          }
        }
      ]
    },
    {
      "name": "depositPortfolio",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "DepositPortfolioData"
          }
        }
      ]
    },
    {
      "name": "withdrawalPortfolio",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "WithdrawalPortfolioData"
          }
        }
      ]
    },
    {
      "name": "rebalancePortfolio",
      "accounts": [
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "portfolioTokenAllocation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "portfolio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "uniqueName",
            "type": "string"
          },
          {
            "name": "totalPercentage",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddPortfolioTokenAllocationData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CreatePortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uniqueName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "DepositPortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawalPortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PercentageMoreThan100",
      "msg": "Portfolio token allocation exceeds 100 percent"
    }
  ]
};

export const IDL: W3balanceContract = {
  "version": "0.1.0",
  "name": "w3balance_contract",
  "instructions": [
    {
      "name": "createPortfolio",
      "accounts": [
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "CreatePortfolioData"
          }
        }
      ]
    },
    {
      "name": "addPortfolioTokenAllocation",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "AddPortfolioTokenAllocationData"
          }
        }
      ]
    },
    {
      "name": "depositPortfolio",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "DepositPortfolioData"
          }
        }
      ]
    },
    {
      "name": "withdrawalPortfolio",
      "accounts": [
        {
          "name": "portfolioTokenAllocationAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "portfolioTokenAllocationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "WithdrawalPortfolioData"
          }
        }
      ]
    },
    {
      "name": "rebalancePortfolio",
      "accounts": [
        {
          "name": "portfolioAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "portfolioTokenAllocation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "portfolio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "uniqueName",
            "type": "string"
          },
          {
            "name": "totalPercentage",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddPortfolioTokenAllocationData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CreatePortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uniqueName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "DepositPortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawalPortfolioData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PercentageMoreThan100",
      "msg": "Portfolio token allocation exceeds 100 percent"
    }
  ]
};
