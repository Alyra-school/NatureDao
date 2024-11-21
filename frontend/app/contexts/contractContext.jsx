import { createContext, useContext, useState, useEffect } from "react";
import {
  contractAddress,
  abi,
  deployBlockNumber,
} from "../constants/constants";
import useToast from "../hooks/useToast";
import { useAccount } from "wagmi";
import {
  readContract,
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  getPublicClient,
} from "@wagmi/core";
import { parseEther, formatEther, parseAbiItem } from "viem";
import { useUserContext } from "./userContext";

const ContractContext = createContext();

export const ContractContextProvider = ({ children }) => {
  const [phase, setPhase] = useState(0);
  const [projects, setProjects] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [NatureDAOBalance, setNatureDAOBalance] = useState(0);
  const [donationEvents, setDonationEvents] = useState([]);
  const [fundsGrantedEvents, setFundsGrantedEvents] = useState([]);
  const [certifEvents, setCertifEvents] = useState([]);
  const { setHasVoted, setVotedProjectId, checkDonator } = useUserContext();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const client = getPublicClient();

  // *********************************** GETTERS ***********************************

  const checkPhase = async () => {
    try {
      const phase = await readContract({
        address: contractAddress,
        abi: abi,
        functionName: "phase",
      });
      setPhase(phase);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getProjects = async () => {
    try {
      const projects = await readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getProjects",
      });
      setProjects(projects);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getTotalVotes = async () => {
    try {
      const votes = await readContract({
        address: contractAddress,
        abi: abi,
        functionName: "totalVotes",
      });
      setTotalVotes(votes);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getNatureDAOBalance = async () => {
    try {
      const balance = await readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getContractBalance",
      });
      setNatureDAOBalance(formatEther(balance));
    } catch (e) {
      console.log(e.message);
    }
  };

  //  *********************************** PROJECTS ************************************

  const addCuratedProject = async (project) => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "addCuratedProject",
        args: [project.name, project.desc, project.address],
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await getProjects();
      toast.showSuccess("The new project has been added, thank you.");
    } catch (e) {
      toast.showError(e.message);
    }
  };

  //  *********************************** FUNDS ************************************

  const donate = async (amount) => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "donate",
        value: parseEther(amount),
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await getNatureDAOBalance();
      await getDonationEvents();
      await checkDonator();
      toast.showSuccess(
        "Thank you for your donation! We're looking forward to your vote to help a project fighting for wildlife protection :)"
      );
    } catch (e) {
      toast.showError(e.message);
    }
  };

  const sendFunds = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "sendFunds",
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await getFundsGrantedEvents();
      toast.showSuccess("All funds have been sent to grantees!");
      await checkPhase();
      await getProjects();
    } catch (e) {
      toast.showError(e.message);
    }
  };

  const certifyFundsUsage = async (id, comment) => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "certifyFundsUsage",
        args: [id, comment],
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await getCertifEvents();
      toast.showSuccess(
        "Certification has been taken into account, thank you!"
      );
    } catch (e) {
      toast.showError(e.message);
    }
  };

  //  *********************************** VOTES ************************************

  const startVotes = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "startVotes",
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await checkPhase();
      toast.showSuccess(
        "You started voting session, and won't be able to add new projects from now on."
      );
    } catch (e) {
      toast.showError(e.message);
    }
  };

  const submitVote = async (id) => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "submitVote",
        args: [id],
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      toast.showSuccess("Thank you! Your vote has been received.");
      setHasVoted(true);
      setVotedProjectId(id);
      await getTotalVotes();
    } catch (e) {
      toast.showError(e.message);
      setHasVoted(false);
      setVotedProjectId("");
    }
  };

  const endVotes = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "endVotes",
        account: address,
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      await checkPhase();
      toast.showSuccess(
        "Voting session ended, you may now send funds to elected projects."
      );
    } catch (e) {
      toast.showError(e.message);
    }
  };

  //  *********************************** EVENTS ************************************

  const getDonationEvents = async () => {
    const donationLogs = await client.getLogs({
      event: parseAbiItem(
        "event DonationReceived(address account, uint amount)"
      ),
      fromBlock: deployBlockNumber,
      toBlock: "latest",
    });
    setDonationEvents(
      donationLogs.map((log) => ({
        address: log.args.account,
        amount: log.args.amount,
      }))
    );
  };

  const getFundsGrantedEvents = async () => {
    const fundsGrantedLogs = await client.getLogs({
      event: parseAbiItem("event FundsGranted(uint amount, uint projectId)"),
      fromBlock: deployBlockNumber,
      toBlock: "latest",
    });
    setFundsGrantedEvents(
      fundsGrantedLogs.map((log) => ({
        amount: log.args.amount,
        projectId: log.args.projectId,
      }))
    );
  };

  const getCertifEvents = async () => {
    const certifLogs = await client.getLogs({
      event: parseAbiItem(
        "event ProperFundsUsageCertified(uint id, string comment)"
      ),
      fromBlock: deployBlockNumber,
      toBlock: "latest",
    });
    setCertifEvents(
      certifLogs.map((log) => ({
        id: log.args.id,
        comment: log.args.comment,
      }))
    );
  };

  const getAllEvents = async () => {
    await getDonationEvents();
    await getFundsGrantedEvents();
    await getCertifEvents();
  };

  useEffect(() => {
    if (isConnected) {
      checkPhase();
      getProjects();
      getNatureDAOBalance();
      getTotalVotes();
      getAllEvents();
    }
  }, [address]);

  return (
    <ContractContext.Provider
      value={{
        phase,
        projects,
        totalVotes,
        NatureDAOBalance,
        donationEvents,
        fundsGrantedEvents,
        certifEvents,
        addCuratedProject,
        donate,
        sendFunds,
        startVotes,
        submitVote,
        endVotes,
        certifyFundsUsage,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => useContext(ContractContext);
