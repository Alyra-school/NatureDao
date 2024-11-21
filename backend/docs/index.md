# Solidity API

## NatureDAO

### Donator

```solidity
struct Donator {
  uint256 totalDonated;
  bool hasVoted;
  uint256 votedProjectId;
}
```

### Project

```solidity
struct Project {
  string name;
  string desc;
  address projAddress;
  uint256 voteCount;
  uint256 fundsReceived;
  bool usageCertified;
}
```

### Phase

```solidity
enum Phase {
  ProjectsCuration,
  VotesStarted,
  VotesEnded,
  FundsSent
}
```

### phase

```solidity
enum NatureDAO.Phase phase
```

### projects

```solidity
struct NatureDAO.Project[] projects
```

### donators

```solidity
mapping(address => struct NatureDAO.Donator) donators
```

### totalVotes

```solidity
uint256 totalVotes
```

### NewPhase

```solidity
event NewPhase(enum NatureDAO.Phase current)
```

Emitted when entering a new phase

#### Parameters

| Name    | Type                 | Description       |
| ------- | -------------------- | ----------------- |
| current | enum NatureDAO.Phase | The current phase |

### DonationReceived

```solidity
event DonationReceived(address donator, uint256 amount)
```

Emitted when a donation is received

#### Parameters

| Name    | Type    | Description            |
| ------- | ------- | ---------------------- |
| donator | address | Adress of the donator  |
| amount  | uint256 | Amount of the donation |

### ProjectCurated

```solidity
event ProjectCurated(uint256 projectId)
```

Emitted when a project has been added by owner

#### Parameters

| Name      | Type    | Description             |
| --------- | ------- | ----------------------- |
| projectId | uint256 | Id of the added project |

### Voted

```solidity
event Voted(address donator, uint256 votedProjectId)
```

Emitted when a donator has voted

#### Parameters

| Name           | Type    | Description                        |
| -------------- | ------- | ---------------------------------- |
| donator        | address | Adress of the donator who voted    |
| votedProjectId | uint256 | Id of the project he/she voted for |

### FundsGranted

```solidity
event FundsGranted(uint256 amount, uint256 projectId)
```

Emitted when funds are sent to an elected project

#### Parameters

| Name      | Type    | Description                        |
| --------- | ------- | ---------------------------------- |
| amount    | uint256 | Adress of the donator who voted    |
| projectId | uint256 | Id of the project he/she voted for |

### ProperFundsUsageCertified

```solidity
event ProperFundsUsageCertified(uint256 projectId, string comment)
```

Emitted when the owner attested of the propoer usage of funds by a project

#### Parameters

| Name      | Type    | Description                                                   |
| --------- | ------- | ------------------------------------------------------------- |
| projectId | uint256 | Id of the project                                             |
| comment   | string  | Comment written by owner expliciting how funds have been used |

### constructor

```solidity
constructor() public
```

Starts the Ownable pattern

### onlyDonators

```solidity
modifier onlyDonators()
```

Checks if the message sender is a Donator

### getDonator

```solidity
function getDonator(address _addr) external view returns (struct NatureDAO.Donator donator)
```

Get a donator based on an address.

#### Parameters

| Name   | Type    | Description             |
| ------ | ------- | ----------------------- |
| \_addr | address | The address to look for |

#### Return Values

| Name    | Type                     | Description                                    |
| ------- | ------------------------ | ---------------------------------------------- |
| donator | struct NatureDAO.Donator | The donator corresponding to the given address |

### getProject

```solidity
function getProject(uint256 _id) external view returns (struct NatureDAO.Project project)
```

Get a project based on an id.

#### Parameters

| Name | Type    | Description        |
| ---- | ------- | ------------------ |
| \_id | uint256 | The id to look for |

#### Return Values

| Name    | Type                     | Description                               |
| ------- | ------------------------ | ----------------------------------------- |
| project | struct NatureDAO.Project | The project corresponding to the given id |

### getProjects

```solidity
function getProjects() external view returns (struct NatureDAO.Project[])
```

Get all projects.

#### Return Values

| Name | Type                       | Description                           |
| ---- | -------------------------- | ------------------------------------- |
| [0]  | struct NatureDAO.Project[] | projects An array of all the projects |

### getContractBalance

```solidity
function getContractBalance() external view returns (uint256)
```

Get contract's balance.

#### Return Values

| Name | Type    | Description                 |
| ---- | ------- | --------------------------- |
| [0]  | uint256 | uint The contract's balance |

### donate

```solidity
function donate() external payable
```

Make a donation in ETH
Will trigger an error if msg.value is 0.

### sendFunds

```solidity
function sendFunds() external
```

Split and send funds to elected projects, proportionnally to their vote count.
Only the owner can call this method.
Will trigger an error if Voting phase is not ended or if contract's balance is 0.

_A manual guard prevents from reentrancy attack._

### certifyFundsUsage

```solidity
function certifyFundsUsage(uint256 _id, string _comment) external
```

Attest how funds have been used.
Only the owner can call this method.
Will trigger an error if Project did not receive funds.

#### Parameters

| Name      | Type    | Description                                  |
| --------- | ------- | -------------------------------------------- |
| \_id      | uint256 | Id of the project.                           |
| \_comment | string  | Description of how the funds have been used. |

### addCuratedProject

```solidity
function addCuratedProject(string _name, string _desc, address _projAddress) external
```

Add a project.
Only the owner can call this method.
Will trigger an error if any arg is missing or if project curation phase is over.

#### Parameters

| Name          | Type    | Description                                            |
| ------------- | ------- | ------------------------------------------------------ |
| \_name        | string  | Name of the project.                                   |
| \_desc        | string  | Description of how project's need.                     |
| \_projAddress | address | Address where to send the funds if project is elected. |

### startVotes

```solidity
function startVotes() external
```

Start voting phase.
Only the owner can call this method.
Will trigger an error if no projects have been added yet or if project curation phase is over.

### submitVote

```solidity
function submitVote(uint256 _id) external
```

Vote for a project.
Only a donator can call this method.
Will trigger an error if not the right phase, if donator already voted or if given project id is unknown.

#### Parameters

| Name | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| \_id | uint256 | Id of the project to vote for. |

### endVotes

```solidity
function endVotes() external
```

End voting phase.
Only the owner can call this method.
Will trigger an error if votes did not start or if nobody voted yet.
