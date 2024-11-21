# NatureDAO

This DAO project is made in the context of Alyra School and the obtention of a blockchain developer certification.

## Useful links:

[Deployment on Vercel](https://NatureDAOdao.vercel.app/)

[Demo video](https://www.loom.com/share/4bcb50aeee0b4705af85245e03062b60)

## Getting started

To run the project locally, here are the steps:

#### Before deploying on Sepolia

You need to add the given [variables](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) to the hardhat configuration:

- `SEPOLIA_RPC_URL` : the url to access to sepolia network, for example via Alchemy. The command to set the variable is `yarn hardhat vars set SEPOLIA_RPC_URL`.
- `SEPOLIA_WALLET_PK`: The private key of your wallet that will be used to deploy. The command to set the variable is `yarn hardhat vars set SEPOLIA_WALLET_PK`.

#### Deploy commands

```sh
  # Deploy the contract - in natureDAO/backend
  yarn hardhat run scripts/deploy.js --network sepolia

  # Copy the contract's address displayed in console
  # Paste its value in the file natureDAO/frontend/constants/constants.js.

  # Run the DApp - in natureDAO/frontend
  yarn dev
```

## Back-end

Stack used:

- Solidity 0.8.23
- Ownable.sol, ReentrancyGuard.sol from OpenZeppelin
- JavaScript for scripts and tests
- Comments written following Natspec

#### Documentation

OpenZeppelin's document generator is available in the project : solidity-docgen. Running the command `yarn hardhat docgen` creates a folder 'docs' containing the documentation files in markdown format.

#### Scripts

2 scripts are available:

- deploy.js, to deploy the smart contract
- addProjects.js, to add 2 predetermined projects

#### Smart contract

NatureDAO.sol simple smart contract allowing the Owner to organize a fund raising and select a list of projects among which donators will be able to vote for. Once voting is finished, the funds are split and sent proportionally to elected projects. The Owner may later come back and attest declaratively of the proper use of funds.

## Front-end

Stack used:

- React with NextJS
- Chakra.ui
- Rainbowkit
- Wagmi

#### Video

#### Roles

Each role has a different display and available functions :

- Owner : If your wallet address is the same as the contract owner, you'll be able to add curated projects, change phases, then send funds and attest of their proper use.
- Donator : If your wallet address made at least one donation, you'll be able to vote for a project. The Owner can also be a Donator.
- Visitor : If your wallet address did not make a donation yet, you can make one, or have access to NatureDAO's data.

#### Usability

Connected wallets can only access functionnalities corresponding to their roles and the current phase.

#### Readability

We chose to stick with a simple design and high contrast betwen the rich background, the texts, and the CTAs.  
The role of the connected address is always displayed.  
On the left-hand side, data regarding current phase, projects list and donations is always available. As well as the KPIs on the upper right-hand side corner.

#### How to use the app

Use the connect button on the upper right-hand corner of the page.
Once connected, the header will show the wallet address you're connected with, & your wallet balance. If you're connected as the Owner, a dropdown menu will appear, with your possible actions, disabled or not depending on the phase.

Depending on your role, and the current phase, you can:

- Add curated projects
- Donate
- Vote
- Send funds
- Certify proper usage of funds
- Go to the next phase
