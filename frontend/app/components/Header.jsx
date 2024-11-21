"use client";

import { anton } from "../layout";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  UnlockIcon,
  LockIcon,
  AtSignIcon,
  TriangleDownIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useUserContext } from "../contexts/userContext";
import { useContractContext } from "../contexts/contractContext";

import AddProjectModal from "./forms/AddProjectFormModal";
import CertifyModal from "./forms/CertifyFormModal";

const Header = () => {
  const { isConnected } = useAccount();
  const { isOwner } = useUserContext();
  const {
    phase,
    projects,
    NatureDAOBalance,
    totalVotes,
    startVotes,
    endVotes,
    sendFunds,
  } = useContractContext();
  const {
    isOpen: isAddProjectModalOpen,
    onOpen: onAddProjectModalOpen,
    onClose: onAddProjectModalClose,
  } = useDisclosure();
  const {
    isOpen: isCertifyModalOpen,
    onOpen: onCertifyModalOpen,
    onClose: onCertifyModalClose,
  } = useDisclosure();

  return (
    <>
      <Flex
        px="2rem"
        py={isConnected ? "0" : "0.75rem"}
        justifyContent={isConnected ? "space-between" : "flex-end"}
        alignItems="center"
        width="100%"
        pos="fixed"
        top="0"
        zIndex={2}
      >
        {isConnected && (
          <Text fontSize={40} className={anton.className}>
            NatureDAO
          </Text>
        )}
        <Flex>
          {isConnected && isOwner && (
            <Menu>
              <MenuButton fontWeight="600" mr="2rem ">
                Owner actions
                <TriangleDownIcon boxSize="0.5em" ml="0.25rem" />
              </MenuButton>
              <MenuList color="green.700">
                <MenuItem
                  icon={<AddIcon />}
                  onClick={onAddProjectModalOpen}
                  isDisabled={phase != 0}
                >
                  Add a project
                </MenuItem>
                <MenuItem
                  icon={<UnlockIcon />}
                  onClick={startVotes}
                  isDisabled={phase != 0 || projects.length === 0}
                >
                  Open Votes
                </MenuItem>
                <MenuItem
                  icon={<LockIcon />}
                  onClick={endVotes}
                  isDisabled={totalVotes === 0 || phase != 1}
                >
                  Close Votes
                </MenuItem>
                <MenuItem
                  icon={<AtSignIcon />}
                  onClick={sendFunds}
                  isDisabled={NatureDAOBalance === 0 || phase != 2}
                >
                  Send Funds
                </MenuItem>
                <MenuItem
                  icon={<CheckCircleIcon />}
                  onClick={onCertifyModalOpen}
                  isDisabled={phase != 3}
                >
                  Certify funds usage
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <ConnectButton />
        </Flex>
      </Flex>
      <AddProjectModal
        {...{
          isAddProjectModalOpen,
          onAddProjectModalClose,
        }}
      />
      <CertifyModal {...{ isCertifyModalOpen, onCertifyModalClose }} />
    </>
  );
};

export default Header;
