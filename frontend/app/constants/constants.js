export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// export const contractAddress = "0x39c133Ee8f5AbC16e8b5fDC13Ace902d30627867"; Sepolia
// export const deployBlockNumber = 5311608n; Sepolia
export const deployBlockNumber = 0n;
export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DonationReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "FundsGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum NatureDAO.Phase",
        name: "current",
        type: "uint8",
      },
    ],
    name: "NewPhase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "ProjectCurated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "comment",
        type: "string",
      },
    ],
    name: "ProperFundsUsageCertified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "donator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votedProjectId",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_desc",
        type: "string",
      },
      {
        internalType: "address",
        name: "_projAddress",
        type: "address",
      },
    ],
    name: "addCuratedProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_comment",
        type: "string",
      },
    ],
    name: "certifyFundsUsage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "endVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getDonator",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalDonated",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasVoted",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "votedProjectId",
            type: "uint256",
          },
        ],
        internalType: "struct NatureDAO.Donator",
        name: "donator",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getProject",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "desc",
            type: "string",
          },
          {
            internalType: "address",
            name: "projAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fundsReceived",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "usageCertified",
            type: "bool",
          },
        ],
        internalType: "struct NatureDAO.Project",
        name: "project",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjects",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "desc",
            type: "string",
          },
          {
            internalType: "address",
            name: "projAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fundsReceived",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "usageCertified",
            type: "bool",
          },
        ],
        internalType: "struct NatureDAO.Project[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "phase",
    outputs: [
      {
        internalType: "enum NatureDAO.Phase",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sendFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "submitVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
