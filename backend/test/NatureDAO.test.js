const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

async function deployNatureDAO() {
  [owner, addr1, addr2] = await ethers.getSigners();
  const contract = await ethers.getContractFactory("NatureDAO");
  NatureDAO = await contract.deploy();

  return { NatureDAO, owner, addr1, addr2 };
}

describe("NatureDAO Tests", function () {
  describe("Deployment", function () {
    it("should deploy the smart contract with right owner", async function () {
      let { NatureDAO, owner } = await loadFixture(deployNatureDAO);

      expect(await NatureDAO.owner()).to.equal(owner.address);
    });
  });

  describe("Only Donators", function () {
    it("should prevent a non-donator from interacting", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();

      await expect(NatureDAO.connect(addr1).submitVote(0)).to.be.revertedWith(
        "Not donator"
      );
    });
  });

  // GETTERS

  describe("getDonator", function () {
    it("should allow anyone to see a donator", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });

      await expect(NatureDAO.connect(addr1).getDonator(addr2.address)).to.not.be
        .reverted;
    });
  });

  describe("getProject", function () {
    it("should allow any address to see a project", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      const project = await NatureDAO.getProject(0);

      assert.equal(project.name, "name1");
    });
  });

  describe("getProjects", function () {
    it("should allow any address to see all projects", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.addCuratedProject("name2", "desc2", addr2.address);
      const projects = await NatureDAO.getProjects();

      assert.equal(projects.length, 2);
    });
  });

  describe("getContractBalance", function () {
    it("should allow any address to see balance of the smart contract", async function () {
      let { NatureDAO } = await loadFixture(deployNatureDAO);
      await NatureDAO.donate({ value: ethers.parseEther("1") });

      const balance1 = await NatureDAO.getContractBalance();
      const balance2 = await ethers.provider.getBalance(NatureDAO.target);

      assert.equal(balance1, balance2);
    });
  });

  // FUNDS

  describe("donate", function () {
    it("should revert if no funds deposited", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.connect(addr1).donate({ value: ethers.parseEther("0") })
      ).to.be.revertedWith("Not enough funds deposited");
    });

    it("should create donator if new and update totalDonated for donator", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await NatureDAO.connect(addr1).donate({ value: ethers.parseEther("1") });
      const donator = await NatureDAO.connect(addr1).getDonator(addr1.address);

      assert.equal(donator.totalDonated, ethers.parseEther("1"));
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.connect(addr1).donate({ value: ethers.parseEther("1") })
      )
        .to.emit(NatureDAO, "DonationReceived")
        .withArgs(addr1.address, ethers.parseEther("1"));
    });
  });

  describe("sendFunds", function () {
    it("should revert if sender is not the Owner", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.connect(addr1).sendFunds())
        .to.be.revertedWithCustomError(NatureDAO, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("should revert if votes have not ended", async function () {
      let { NatureDAO } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.sendFunds()).to.be.revertedWith("Votes not ended");
    });

    it("should revert if NatureDAO's balance is empty", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();
      await NatureDAO.sendFunds();

      await expect(NatureDAO.sendFunds()).to.be.revertedWith("Empty balance");
    });

    it("should update fundsReceived value", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();
      await NatureDAO.sendFunds();

      const project = await NatureDAO.getProject(0);

      assert.equal(project.fundsReceived, ethers.parseEther("1"));
    });

    it("should not update fundsReceived value if projects has no votes", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.addCuratedProject("name2", "desc2", addr2.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();
      await NatureDAO.sendFunds();

      const project = await NatureDAO.getProject(1);

      assert.equal(project.fundsReceived, 0);
    });

    it("should emit an event for payment", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();

      await expect(NatureDAO.sendFunds())
        .to.emit(NatureDAO, "FundsGranted")
        .withArgs(ethers.parseEther("1"), 0);
    });

    it("should emit an event for phase change", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();

      await expect(NatureDAO.sendFunds())
        .to.emit(NatureDAO, "NewPhase")
        .withArgs(3);
    });
  });

  describe("certifyFundsUsage", function () {
    it("should revert if sender is not the Owner", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.connect(addr1).certifyFundsUsage(1, "comment1"))
        .to.be.revertedWithCustomError(NatureDAO, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("should set usageCertified to true", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();
      await NatureDAO.sendFunds();
      await NatureDAO.certifyFundsUsage(0, "ok");

      const project = await NatureDAO.getProject(0);

      assert.equal(project.usageCertified, true);
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();
      await NatureDAO.sendFunds();

      await expect(NatureDAO.certifyFundsUsage(0, "ok"))
        .to.emit(NatureDAO, "ProperFundsUsageCertified")
        .withArgs(0, "ok");
    });
  });

  // Projects

  describe("addCuratedProject", function () {
    it("should revert if sender is not the owner", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.connect(addr1).addCuratedProject(
          "name1",
          "desc1",
          addr1.address
        )
      )
        .to.be.revertedWithCustomError(NatureDAO, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("should revert if not the right time to add a curated project", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.startVotes();

      await expect(
        NatureDAO.addCuratedProject("name2", "desc2", addr1.address)
      ).to.be.revertedWith("Project curation is over");
    });

    it("should revert if no project name is given", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.addCuratedProject("", "desc1", addr1.address)
      ).to.be.revertedWith("No name");
    });

    it("should revert if no project description is given", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.addCuratedProject("name1", "", addr1.address)
      ).to.be.revertedWith("No description");
    });

    it("should revert if no project address is given", async function () {
      let { NatureDAO } = await loadFixture(deployNatureDAO);

      await expect(
        NatureDAO.addCuratedProject(
          "name1",
          "desc1",
          "0x0000000000000000000000000000000000000000"
        )
      ).to.be.revertedWith("No address");
    });

    it("should be able to add a project", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      const project = await NatureDAO.getProject(0);

      assert.equal(project.name, "name1");
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.addCuratedProject("name1", "desc1", addr1.address))
        .to.emit(NatureDAO, "ProjectCurated")
        .withArgs(0);
    });
  });

  // VOTES

  describe("startVotes", function () {
    it("should revert if sender is not the owner", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.connect(addr1).startVotes())
        .to.be.revertedWithCustomError(NatureDAO, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("should revert if not the right time to start votes", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.startVotes();

      await expect(NatureDAO.startVotes()).to.be.revertedWith(
        "Cannot start votes now"
      );
    });

    it("should revert if no projects have been curated", async function () {
      let { NatureDAO } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.startVotes()).to.be.revertedWith(
        "No projects to vote for"
      );
    });

    it("should go to phase 1", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.startVotes();

      const phase = await NatureDAO.phase();

      assert.equal(phase, 1);
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);

      await expect(NatureDAO.startVotes())
        .to.emit(NatureDAO, "NewPhase")
        .withArgs(1);
    });
  });

  describe("submitVote", function () {
    it("should prevent a non-donator from voting", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.startVotes();

      await expect(NatureDAO.connect(addr2).submitVote(0)).to.be.revertedWith(
        "Not donator"
      );
    });

    it("should revert if not the right time to vote", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });

      await expect(NatureDAO.connect(addr2).submitVote(0)).to.be.revertedWith(
        "Cannot vote now"
      );
    });

    it("should revert if voter has already voted", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);

      await expect(NatureDAO.connect(addr2).submitVote(0)).to.be.revertedWith(
        "You already voted"
      );
    });

    it("should revert if project doesn't exist", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();

      await expect(NatureDAO.connect(addr2).submitVote(1)).to.be.revertedWith(
        "Unknown project"
      );
    });

    it("should take into account the vote on the voter's side", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.addCuratedProject("name2", "desc2", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(1);

      const donator = await NatureDAO.connect(addr2).getDonator(addr2.address);

      assert.equal(donator.votedProjectId, 1);
      assert.equal(donator.hasVoted, true);
    });

    it("should take into account the vote on the project's side", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      const project = await NatureDAO.getProject(0);
      const initialVoteCount = project.voteCount;

      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);

      const proj = await NatureDAO.getProject(0);
      const newVoteCount = proj.voteCount;

      assert.equal(newVoteCount, initialVoteCount + BigInt(1));
    });

    it("should increment totalVotes", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);

      const totalVotes = await NatureDAO.totalVotes();

      assert.equal(totalVotes, 1);
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();

      await expect(NatureDAO.connect(addr2).submitVote(0))
        .to.emit(NatureDAO, "Voted")
        .withArgs(addr2.address, 0);
    });
  });

  describe("endVotes", function () {
    it("should revert if sender is not the owner", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.connect(addr1).endVotes())
        .to.be.revertedWithCustomError(NatureDAO, "OwnableUnauthorizedAccount")
        .withArgs(addr1.address);
    });

    it("should revert if not the right time to end votes", async function () {
      let { NatureDAO } = await loadFixture(deployNatureDAO);

      await expect(NatureDAO.endVotes()).to.be.revertedWith(
        "Cannot end votes now"
      );
    });

    it("should revert if no votes have been submitted", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.startVotes();

      await expect(NatureDAO.endVotes()).to.be.revertedWith(
        "No votes submitted yet"
      );
    });

    it("should go to phase 2", async function () {
      let { NatureDAO, addr1, addr2 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);
      await NatureDAO.endVotes();

      const phase = await NatureDAO.phase();

      assert.equal(phase, 2);
    });

    it("should emit an event", async function () {
      let { NatureDAO, addr1 } = await loadFixture(deployNatureDAO);
      await NatureDAO.addCuratedProject("name1", "desc1", addr1.address);
      await NatureDAO.connect(addr2).donate({ value: ethers.parseEther("1") });
      await NatureDAO.startVotes();
      await NatureDAO.connect(addr2).submitVote(0);

      await expect(NatureDAO.endVotes())
        .to.emit(NatureDAO, "NewPhase")
        .withArgs(2);
    });
  });
});
