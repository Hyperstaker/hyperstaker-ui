import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../public/img/benefit-one.png";
import benefitTwoImg from "../public/img/benefit-two.png";

const benefitOne = {
  title: "What's in it for you?",
  desc: "Predict which public goods projects should be funded. Fund them, and be rewarded for their success.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Prospectively fund projects",
      desc: "Get projects moving forward, and receive a hypercert",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Signal with your hypercerts which projects should be funded",
      desc: "The higher your conviction, the more benefit you receive.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Hypercert stakers are rewarded upon Retro payout",
      desc: "If and when someone pays for the work the project has done, you get paid.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Offer more benefits here",
  desc: "You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile Responsive Template",
      desc: "Nextly is designed as a mobile first responsive template.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Powered by Next.js & TailwindCSS",
      desc: "This template is powered by latest technologies and tools.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Dark & Light Mode",
      desc: "Nextly comes with a zero-config light & dark mode. ",
      icon: <SunIcon />,
    },
  ],
};

const alloRegistryAbi = [{
  inputs: [
    { internalType: "uint256", name: "_nonce", type: "uint256" },
    { internalType: "string", name: "_name", type: "string" },
    {
      components: [
        { internalType: "uint256", name: "protocol", type: "uint256" },
        { internalType: "string", name: "pointer", type: "string" },
      ],
      internalType: "struct Metadata",
      name: "_metadata",
      type: "tuple",
    },
    { internalType: "address", name: "_owner", type: "address" },
    { internalType: "address[]", name: "_members", type: "address[]" },
  ],
  name: "createProfile",
  outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  stateMutability: "nonpayable",
  type: "function",
}]

const alloAbi = [
  {
    inputs: [
      { internalType: "bytes32", name: "_profileId", type: "bytes32" },
      { internalType: "address", name: "_strategy", type: "address" },
      { internalType: "bytes", name: "_initStrategyData", type: "bytes" },
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      {
        components: [
          { internalType: "uint256", name: "protocol", type: "uint256" },
          { internalType: "string", name: "pointer", type: "string" },
        ],
        internalType: "struct Metadata",
        name: "_metadata",
        type: "tuple",
      },
      { internalType: "address[]", name: "_managers", type: "address[]" },
    ],
    name: "createPool",
    outputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_profileId", type: "bytes32" },
      { internalType: "address", name: "_strategy", type: "address" },
      { internalType: "bytes", name: "_initStrategyData", type: "bytes" },
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      {
        components: [
          { internalType: "uint256", name: "protocol", type: "uint256" },
          { internalType: "string", name: "pointer", type: "string" },
        ],
        internalType: "struct Metadata",
        name: "_metadata",
        type: "tuple",
      },
      { internalType: "address[]", name: "_managers", type: "address[]" },
    ],
    name: "createPoolWithCustomStrategy",
    outputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "getPool",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "profileId", type: "bytes32" },
          {
            internalType: "contract IStrategy",
            name: "strategy",
            type: "address",
          },
          { internalType: "address", name: "token", type: "address" },
          {
            components: [
              { internalType: "uint256", name: "protocol", type: "uint256" },
              { internalType: "string", name: "pointer", type: "string" },
            ],
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
          { internalType: "bytes32", name: "managerRole", type: "bytes32" },
          { internalType: "bytes32", name: "adminRole", type: "bytes32" },
        ],
        internalType: "struct IAllo.Pool",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "fundPool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getStrategy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"allocate","outputs":[],"stateMutability":"payable","type":"function"}
];

const hyperfundFactoryAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "hypercertId", type: "uint256" },
      { internalType: "address", name: "manager", type: "address" },
    ],
    name: "createHyperfund",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "hypercertId", type: "uint256" },
      { internalType: "address", name: "manager", type: "address" },
    ],
    name: "createHyperstaker",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const hyperfundAbi = [{
  type: "function",
  name: "allowlistToken",
  inputs: [
    { name: "_token", type: "address", internalType: "address" },
    { name: "_multiplier", type: "int256", internalType: "int256" },
  ],
  outputs: [],
  stateMutability: "nonpayable",
},
{
  type: "function",
  name: "donate",
  inputs: [
    { name: "_token", type: "address", internalType: "address" },
    { name: "_amount", type: "uint256", internalType: "uint256" },
  ],
  outputs: [],
  stateMutability: "payable",
}, {
  type: "function",
  name: "nonfinancialContribution",
  inputs: [
    { name: "_contributor", type: "address", internalType: "address" },
    { name: "_units", type: "uint256", internalType: "uint256" },
  ],
  outputs: [],
  stateMutability: "nonpayable",
}, {
  type: "function",
  name: "redeem",
  inputs: [
    { name: "_fractionId", type: "uint256", internalType: "uint256" },
    { name: "_token", type: "address", internalType: "address" },
  ],
  outputs: [],
  stateMutability: "nonpayable",
}, {
  type: "function",
  name: "nonfinancialContributions",
  inputs: [{ name: "contributor", type: "address", internalType: "address" }],
  outputs: [{ name: "units", type: "uint256", internalType: "uint256" }],
  stateMutability: "view",
}]

const hyperstakerAbi = [
  {
    type: "function",
    name: "setReward",
    inputs: [
      { name: "_rewardToken", type: "address", internalType: "address" },
      { name: "_rewardAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "stake",
    inputs: [
      { name: "_hypercertId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [
      { name: "_hypercertId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
]

const hypercertMinterAbi = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const erc20ContractABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const hyperStrategyAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_allo",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ALLOCATION_ACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ALLOCATION_NOT_ACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ALLOCATION_NOT_ENDED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ALREADY_INITIALIZED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AMOUNT_MISMATCH",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ANCHOR_ERROR",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ARRAY_MISMATCH",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "INVALID",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "INVALID_ADDRESS",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "INVALID_FEE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "INVALID_METADATA",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "INVALID_REGISTRATION",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "IS_APPROVED_STRATEGY",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MISMATCH",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NONCE_NOT_AVAILABLE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NON_ZERO_VALUE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOOP",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOT_APPROVED_STRATEGY",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOT_ENOUGH_FUNDS",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOT_IMPLEMENTED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOT_INITIALIZED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NOT_PENDING_OWNER",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "POOL_ACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "POOL_INACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RECIPIENT_ALREADY_ACCEPTED",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipientId",
        "type": "address"
      }
    ],
    "name": "RECIPIENT_ERROR",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RECIPIENT_NOT_ACCEPTED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "REGISTRATION_ACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "REGISTRATION_NOT_ACTIVE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UNAUTHORIZED",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZERO_ADDRESS",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipientId",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Allocated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipientId",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipientAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Distributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "name": "PoolActive",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipientId",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Registered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MANAGER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NATIVE",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "allocate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_recipientIds",
        "type": "address[]"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "distribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllo",
    "outputs": [
      {
        "internalType": "contract IAllo",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_recipientIds",
        "type": "address[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_data",
        "type": "bytes[]"
      }
    ],
    "name": "getPayouts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipientAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IStrategy.PayoutSummary[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipientId",
        "type": "address"
      }
    ],
    "name": "getRecipientStatus",
    "outputs": [
      {
        "internalType": "enum IStrategy.Status",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStrategyId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "increasePoolAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPoolActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_allocator",
        "type": "address"
      }
    ],
    "name": "isValidAllocator",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "registerRecipient",
    "outputs": [
      {
        "internalType": "address",
        "name": "recipientId",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

const hyperstrategyFactoryAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_hypercertMinter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createHyperstrategy",
    "inputs": [
      {
        "name": "_allo",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "HyperstrategyCreated",
    "inputs": [
      {
        "name": "hyperstrategyAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "allo",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
]

const hyperStrategyBytecode = "0x60806040526004361061014f5760003560e01c806391d14854116100b6578063df868ed31161006f578063df868ed3146103f5578063eb11af931461040a578063ec87621c14610437578063edd146cc1461046b578063ef2920fc1461048b578063f5b0dfb71461049e57600080fd5b806391d148541461032b578063a0cf0aea1461034b578063a217fddf14610373578063b2b878d014610388578063c3097f69146103b5578063d547741f146103d557600080fd5b80632f2ff15d116101085780632f2ff15d1461026e57806336568abe1461028e57806338fff2d0146102ae57806342fda9c7146102c35780634ab4ba42146102f65780634d31d0871461030b57600080fd5b806301ffc9a71461015b5780630a6f0ee914610190578063124a46cf146101b257806315cc481e146101ea578063248a9ca31461021d5780632bbe0cae1461025b57600080fd5b3661015657005b600080fd5b34801561016757600080fd5b5061017b610176366004611326565b6104be565b60405190151581526020015b60405180910390f35b34801561019c57600080fd5b506101b06101ab366004611504565b6104f5565b005b3480156101be57600080fd5b506005546101d2906001600160a01b031681565b6040516001600160a01b039091168152602001610187565b3480156101f657600080fd5b507f0000000000000000000000001133ea7af70876e64665ecd07c0a0476d09465a16101d2565b34801561022957600080fd5b5061024d61023836600461157b565b60009081526020819052604090206001015490565b604051908152602001610187565b6101d2610269366004611594565b610515565b34801561027a57600080fd5b506101b06102893660046115e5565b610531565b34801561029a57600080fd5b506101b06102a93660046115e5565b610556565b3480156102ba57600080fd5b5060025461024d565b3480156102cf57600080fd5b507fe6a5afc72366df977af3096d01104a780a8ac680f7874734f3290acf561eed1f61024d565b34801561030257600080fd5b5060035461024d565b34801561031757600080fd5b5061017b61032636600461160a565b6105d9565b34801561033757600080fd5b5061017b6103463660046115e5565b6105e1565b34801561035757600080fd5b506101d273eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee81565b34801561037f57600080fd5b5061024d600081565b34801561039457600080fd5b506103a86103a3366004611627565b61060a565b60405161018791906116fb565b3480156103c157600080fd5b506004546101d2906001600160a01b031681565b3480156103e157600080fd5b506101b06103f03660046115e5565b610708565b34801561040157600080fd5b5061017b61072d565b34801561041657600080fd5b5061042a61042536600461160a565b610740565b6040516101879190611753565b34801561044357600080fd5b5061024d7f241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b0881565b34801561047757600080fd5b506101b061048636600461177b565b61074b565b6101b0610499366004611594565b61087e565b3480156104aa57600080fd5b506101b06104b936600461157b565b610898565b60006001600160e01b03198216637965db0b60e01b14806104ef57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6104fd6108c4565b61050561090f565b610510838383610932565b505050565b600061051f6108c4565b61052761090f565b60005b9392505050565b60008281526020819052604090206001015461054c8161094b565b6105108383610955565b6001600160a01b03811633146105cb5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105d582826109d9565b5050565b6000806104ef565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b8151815160609190811461063157604051633da4c02b60e11b815260040160405180910390fd5b6000816001600160401b0381111561064b5761064b611350565b60405190808252806020026020018201604052801561069057816020015b60408051808201909152600080825260208201528152602001906001900390816106695790505b50905060005b828110156106ff576106da8682815181106106b3576106b36117c1565b60200260200101518683815181106106cd576106cd6117c1565b6020026020010151610a3e565b8282815181106106ec576106ec6117c1565b6020908102919091010152600101610696565b50949350505050565b6000828152602081905260409020600101546107238161094b565b61051083836109d9565b600061073b60015460ff1690565b905090565b60006104ef82610a57565b6000808280602001905181019061076291906117d7565b600480546001600160a01b0319166001600160a01b03831690811782556040805163124a46cf60e01b815290519496509294509263124a46cf9280830192602092918290030181865afa1580156107bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107e19190611806565b600580546001600160a01b0319166001600160a01b039290921691909117905561080c600033610955565b6108367f241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b0883610955565b61083f84610a72565b7f91efa3d50feccde0d0d202f8ae5c41ca0b2be614cebcb2bd2f4b019396e6568a8484604051610870929190611873565b60405180910390a150505050565b6108866108c4565b61088e61090f565b6105d58282610ac1565b6108a06108c4565b80600360008282546108b291906118aa565b909155506108c1905081610c99565b50565b336001600160a01b037f0000000000000000000000001133ea7af70876e64665ecd07c0a0476d09465a1161461090d5760405163075fd2b160e01b815260040160405180910390fd5b565b60025460000361090d57604051630f68fe6360e21b815260040160405180910390fd5b6040516302ad284d60e31b815260040160405180910390fd5b6108c18133610f3f565b61095f82826105e1565b6105d5576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556109953390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6109e382826105e1565b156105d5576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60408051808201909152600080825260208201526104ef565b60006040516302ad284d60e31b815260040160405180910390fd5b610a7a6108c4565b60025415610a9b5760405163439a74c960e01b815260040160405180910390fd5b80600003610abc57604051637fcce2a960e01b815260040160405180910390fd5b600255565b7f241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08610aeb8161094b565b60008084806020019051810190610b029190611918565b915091508051825114610b2857604051633da4c02b60e11b815260040160405180910390fd5b60025460405163068bcd8d60e01b81526000916001600160a01b037f0000000000000000000000001133ea7af70876e64665ecd07c0a0476d09465a1169163068bcd8d91610b7c9160040190815260200190565b600060405180830381865afa158015610b99573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bc191908101906119d2565b905060005b8351811015610c90576000838281518110610be357610be36117c1565b602002602001015190506000858381518110610c0157610c016117c1565b60200260200101519050610c1a84604001518284610f98565b806001600160a01b03167f463ffc2cf8b1596445c417388ed30e53eb67cf6668cb2be7f0addf8a78c8441b8386604001518b604051610c75939291909283526001600160a01b03918216602084015216604082015260600190565b60405180910390a2505080610c8990611af3565b9050610bc6565b50505050505050565b60025460405163068bcd8d60e01b81526000916001600160a01b037f0000000000000000000000001133ea7af70876e64665ecd07c0a0476d09465a1169163068bcd8d91610ced9160040190815260200190565b600060405180830381865afa158015610d0a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610d3291908101906119d2565b90506000600460009054906101000a90046001600160a01b03166001600160a01b0316637d3eda626040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dad9190611b0c565b60048054604085810151905163c77957ed60e01b81526001600160a01b0391821693810193909352929350600092169063c77957ed90602401602060405180830381865afa158015610e03573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e279190611b0c565b9050600080821315610e4457610e3d8286611b25565b9050610e5a565b610e4d82611b3c565b610e579086611b58565b90505b6005546040516399f771a760e01b8152600481018590526000916001600160a01b0316906399f771a790602401602060405180830381865afa158015610ea4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ec89190611b0c565b905081811015610ed757600080fd5b610ee2328386610fd2565b60408086015181513281526001600160a01b039091166020820152908101879052606081018390527f36b870f0c3cb6f05066b6f781515ba9db45bc71bccd57db679aee4d33549c3fc9060800160405180910390a1505050505050565b610f4982826105e1565b6105d557610f5681611117565b610f61836020611129565b604051602001610f72929190611b7a565b60408051601f198184030181529082905262461bcd60e51b82526105c291600401611bef565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03841601610fc75761051082826112c4565b6105108383836112e0565b604080516002808252606082018352600092602083019080368337019050506005546040516399f771a760e01b81526004810185905291925084916001600160a01b03909116906399f771a790602401602060405180830381865afa15801561103f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110639190611b0c565b61106d9190611c02565b81600081518110611080576110806117c1565b60200260200101818152505082816001815181106110a0576110a06117c1565b6020908102919091010152600554604051636ebd893f60e01b81526001600160a01b0390911690636ebd893f906110df90879086908690600401611c15565b600060405180830381600087803b1580156110f957600080fd5b505af115801561110d573d6000803e3d6000fd5b5050505050505050565b60606104ef6001600160a01b03831660145b60606000611138836002611b25565b6111439060026118aa565b6001600160401b0381111561115a5761115a611350565b6040519080825280601f01601f191660200182016040528015611184576020820181803683370190505b509050600360fc1b8160008151811061119f5761119f6117c1565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106111ce576111ce6117c1565b60200101906001600160f81b031916908160001a90535060006111f2846002611b25565b6111fd9060016118aa565b90505b6001811115611275576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611231576112316117c1565b1a60f81b828281518110611247576112476117c1565b60200101906001600160f81b031916908160001a90535060049490941c9361126e81611c72565b9050611200565b50831561052a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105c2565b60008060008084865af16105d55763b12d13eb6000526004601cfd5b816014528060345263a9059cbb60601b60005260206000604460106000875af13d15600160005114171661131c576390b8ec186000526004601cfd5b6000603452505050565b60006020828403121561133857600080fd5b81356001600160e01b03198116811461052a57600080fd5b634e487b7160e01b600052604160045260246000fd5b60405160c081016001600160401b038111828210171561138857611388611350565b60405290565b604080519081016001600160401b038111828210171561138857611388611350565b604051601f8201601f191681016001600160401b03811182821017156113d8576113d8611350565b604052919050565b60006001600160401b038211156113f9576113f9611350565b5060051b60200190565b6001600160a01b03811681146108c157600080fd5b600082601f83011261142957600080fd5b8135602061143e611439836113e0565b6113b0565b82815260059290921b8401810191818101908684111561145d57600080fd5b8286015b8481101561148157803561147481611403565b8352918301918301611461565b509695505050505050565b60006001600160401b038211156114a5576114a5611350565b50601f01601f191660200190565b600082601f8301126114c457600080fd5b81356114d26114398261148c565b8181528460208386010111156114e757600080fd5b816020850160208301376000918101602001919091529392505050565b60008060006060848603121561151957600080fd5b83356001600160401b038082111561153057600080fd5b61153c87838801611418565b9450602086013591508082111561155257600080fd5b5061155f868287016114b3565b925050604084013561157081611403565b809150509250925092565b60006020828403121561158d57600080fd5b5035919050565b600080604083850312156115a757600080fd5b82356001600160401b038111156115bd57600080fd5b6115c9858286016114b3565b92505060208301356115da81611403565b809150509250929050565b600080604083850312156115f857600080fd5b8235915060208301356115da81611403565b60006020828403121561161c57600080fd5b813561052a81611403565b6000806040838503121561163a57600080fd5b82356001600160401b038082111561165157600080fd5b61165d86838701611418565b935060209150818501358181111561167457600080fd5b8501601f8101871361168557600080fd5b8035611693611439826113e0565b81815260059190911b820184019084810190898311156116b257600080fd5b8584015b838110156116ea578035868111156116ce5760008081fd5b6116dc8c89838901016114b3565b8452509186019186016116b6565b508096505050505050509250929050565b602080825282518282018190526000919060409081850190868401855b8281101561174657815180516001600160a01b03168552860151868501529284019290850190600101611718565b5091979650505050505050565b602081016007831061177557634e487b7160e01b600052602160045260246000fd5b91905290565b6000806040838503121561178e57600080fd5b8235915060208301356001600160401b038111156117ab57600080fd5b6117b7858286016114b3565b9150509250929050565b634e487b7160e01b600052603260045260246000fd5b600080604083850312156117ea57600080fd5b82516117f581611403565b60208401519092506115da81611403565b60006020828403121561181857600080fd5b815161052a81611403565b60005b8381101561183e578181015183820152602001611826565b50506000910152565b6000815180845261185f816020860160208601611823565b601f01601f19169290920160200192915050565b82815260406020820152600061188c6040830184611847565b949350505050565b634e487b7160e01b600052601160045260246000fd5b808201808211156104ef576104ef611894565b600082601f8301126118ce57600080fd5b815160206118de611439836113e0565b82815260059290921b840181019181810190868411156118fd57600080fd5b8286015b848110156114815780518352918301918301611901565b6000806040838503121561192b57600080fd5b82516001600160401b038082111561194257600080fd5b818501915085601f83011261195657600080fd5b81516020611966611439836113e0565b82815260059290921b8401810191818101908984111561198557600080fd5b948201945b838610156119ac57855161199d81611403565b8252948201949082019061198a565b918801519196509093505050808211156119c557600080fd5b506117b7858286016118bd565b600060208083850312156119e557600080fd5b82516001600160401b03808211156119fc57600080fd5b9084019060c08287031215611a1057600080fd5b611a18611366565b8251815283830151611a2981611403565b818501526040830151611a3b81611403565b6040820152606083015182811115611a5257600080fd5b830160408189031215611a6457600080fd5b611a6c61138e565b815181528582015184811115611a8157600080fd5b82019350601f84018913611a9457600080fd5b83519150611aa46114398361148c565b8281528987848701011115611ab857600080fd5b611ac783888301898801611823565b95810195909552506060810193909352506080818101519083015260a090810151908201529392505050565b600060018201611b0557611b05611894565b5060010190565b600060208284031215611b1e57600080fd5b5051919050565b80820281158282048414176104ef576104ef611894565b6000600160ff1b8201611b5157611b51611894565b5060000390565b600082611b7557634e487b7160e01b600052601260045260246000fd5b500490565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611bb2816017850160208801611823565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611be3816028840160208801611823565b01602801949350505050565b60208152600061052a6020830184611847565b818103818111156104ef576104ef611894565b6001600160a01b038416815260208082018490526060604083018190528351908301819052600091848101916080850190845b81811015611c6457845183529383019391830191600101611c48565b509098975050505050505050565b600081611c8157611c81611894565b50600019019056fea26469706673582212202e47eba18dcec8338ca9be17d62de724a11a09108b5579a035188473ddb3b82d64736f6c63430008130033"

const contracts = {
  [11155111]: {
    hypercertMinterContract: "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
    hyperstakerFactoryContract: "0xFa9525E19196285Dc69D178C9Fc9F210F9e7F718",
    hyperstrategyFactory: "0x48880b8a4Fcb2deE00Ede91F837835135B794c13",
    alloContract: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
    directGrantsSimpleStrategy: "0x8564d522b19836b7F5B4324E7Ee8Cb41810E9F9e",
    hyperStrategy: "0x1be52A8f4c05379cb6516Cc403e08DF7AdE47bC1",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    alloRegistry: "0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3"
  }
}

export { benefitOne, benefitTwo, alloRegistryAbi, alloAbi, hyperfundFactoryAbi, hyperfundAbi, hypercertMinterAbi, hyperstakerAbi, erc20ContractABI, hyperStrategyAbi, hyperStrategyBytecode, hyperstrategyFactoryAbi, contracts };
