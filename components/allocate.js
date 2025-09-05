import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Paper, 
  Title, 
  Text, 
  TextInput, 
  NumberInput, 
  Button, 
  Group, 
  Stack, 
  Table, 
  ActionIcon, 
  Card, 
  Badge, 
  Modal, 
  Anchor, 
  Divider,
  Container,
  Grid,
  Alert,

  Center
} from "@mantine/core";
import { IconPlus, IconMinus, IconCheck, IconExternalLink, IconWallet, IconUsers, IconCoin } from "@tabler/icons-react";
import { useWriteContracts } from "wagmi/experimental"
import { contracts, hyperfundAbi, hypercertMinterAbi } from "./data";
import {useWriteContract, usePublicClient, useAccount } from "wagmi";
import {getContract} from "viem"
import { getTransactionExplorerUrl } from "@/explorer";
import { formatAllocationNumber } from "@/lib/formatters";

function AllocateForm({
  hyperfund,
}) {
    const [addresses, setAddresses] = useState([]);
    const [inputs, setInputs] = useState({}); // State to hold input values
    const allocateForm = useForm();
    const allocateSingle = useWriteContract();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [txHash, setTxHash] = useState("");
    const account  = useAccount()
    // Add new state for approval status
    const [isApproved, setIsApproved] = useState(false);
    const [allocationHistory, setAllocationHistory] = useState([]);

    const publicClient = usePublicClient({
      chainId: account.chainId,
    });

    // Add useEffect to check approval status on load
    useEffect(() => {
        const checkInitialApproval = async () => {
            const approved = await checkApproved();
            setIsApproved(approved);
        };
        
        if (account.chainId && hyperfund) {
            checkInitialApproval();
        }
    }, [account.chainId, hyperfund]);

    // Add useEffect to fetch allocation data
    useEffect(() => {
        const fetchAllocations = async () => {
            if (!hyperfund) return;
            
            try {
                const response = await fetch("/api/getNonFinancialContributions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        hyperfund: hyperfund
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch non-financial contributions");
                }

                const data = await response.json();
              
                const contributions = data.contributions;
                const fractionRedeemeds = data.fractionRedeemeds;
                if (contributions) {
                    // Get unique addresses
                    const uniqueAddresses = [...new Set(
                        contributions.map(item => item.address)
                    )];
                    setAddresses(uniqueAddresses);

                    // Process allocation history
                    const history = contributions.map(contribution => {
                        const totalAllocated = contribution ? parseInt(contribution.units) : 0;
                        const totalRedeemed = fractionRedeemeds.find(redeemed => redeemed.address === contribution.address && redeemed.amount == contribution.units)?.amount || 0;
                        
                        return {
                            address: contribution.address,
                            allocated: (totalAllocated).toString(),
                            redeemed: (totalRedeemed).toString()
                        };
                    });
                    setAllocationHistory(history);
                }
            } catch (error) {
                console.error("Error fetching allocations:", error);
            }
        };

        fetchAllocations();
    }, [hyperfund, showSuccessModal]);

    const handleInputChange = (address, value) => {
        setInputs(prev => ({ ...prev, [address]: value }));
    };

    const handleIncrease = (address) => {
        setInputs(prev => ({ ...prev, [address]: (parseFloat(prev[address] || 0) + 1).toString() }));
    };

    const handleDecrease = (address) => {
        setInputs(prev => ({ ...prev, [address]: (Math.max(0, parseFloat(prev[address] || 0) - 1)).toString() }));
    };

    const handleAddAddress = () => {
      const newAddress = allocateForm.getValues("address"); // Get the address from the form
      const amount = allocateForm.getValues("amount");
      if (newAddress && !addresses.includes(newAddress)) { // Check if address is valid and not a duplicate
          setAddresses(prev => [...prev, newAddress]); // Add new address to the list
          setInputs(prev => ({ ...prev, [newAddress]: amount })); // Set input value of new address
          allocateForm.reset(); // Clear the input field in the form
      }
    };

    const handleApprove = async () => {
        try {
            await allocateSingle.writeContractAsync({
                address: contracts[account.chainId].hypercertMinterContract,
                abi: hypercertMinterAbi,
                functionName: "setApprovalForAll",
                args: [hyperfund, true],
            });
            setIsApproved(true);
        } catch (e) {
            console.error("Approval failed: ", e);
        }
    };

    const handleAllocate = async () => {
        if (!hyperfund) {
            throw new Error("unable to fetch contract")
        }

        try {
            // Filter addresses with positive allocations
            const validAllocations = addresses.filter(a => parseInt(inputs[a]) > 0);
            const units = validAllocations.map(a => parseInt(inputs[a]));

            const tx = await allocateSingle.writeContractAsync({
                address: hyperfund,
                abi: hyperfundAbi,
                functionName: "nonFinancialContributions",
                args: [validAllocations, units]
            });

            if (tx) {
                allocateForm.reset();
                setInputs({})
                setTxHash(tx);
                setShowSuccessModal(true);
            }
        } catch (e) {
            console.error("Transaction failed: ", e);
        }
    }

    const checkApproved = async () => {
      if (account.chainId) {
        const hyperMinterContract = getContract({
          address: contracts[account.chainId].hypercertMinterContract,
          abi: hypercertMinterAbi,
          client: {
            public: publicClient,
          },
        });

        const isApproved = await hyperMinterContract.read.isApprovedForAll([
          account.address,
          hyperfund,
        ]);

        return isApproved;
      }
    };

    // Calculate totals
    const totals = allocationHistory.reduce((acc, curr) => {
        return {
            allocated: acc.allocated + parseFloat(curr.allocated),
            redeemed: acc.redeemed + parseFloat(curr.redeemed)
        };
    }, { allocated: 0, redeemed: 0 });


    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Paper p="lg" radius="md" withBorder>
                    <Group gap="sm" mb="md">
                        <IconUsers size={24} />
                        <Title order={2}>Fund Allocation</Title>
                    </Group>
                    <Text c="dimmed" size="sm">
                        Allocate Hypercert fractions to contributors and track distribution history
                    </Text>
                </Paper>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        {/* Add Contributor Section */}
                        <Card p="lg" radius="md" withBorder>
                            <Group gap="sm" mb="md">
                                <IconCoin size={20} />
                                <Title order={3}>Add Contributor</Title>
                            </Group>
                            
                            <Stack gap="md">
                                <TextInput
                                    label="Wallet Address"
                                    placeholder="0x..."
                                    {...allocateForm.register("address", { required: true })}
                                    leftSection={<IconWallet size={16} />}
                                />
                                
                                <NumberInput
                                    label="Allocation Amount"
                                    description={`Equivalent to ${(allocateForm.watch("amount") || 0) * 0.000001} USD`}
                                    placeholder="0"
                                    min={0}
                                    {...allocateForm.register("amount", { required: true })}
                                    leftSection={<IconCoin size={16} />}
                                />
                                
                                <Button 
                                    onClick={handleAddAddress} 
                                    leftSection={<IconPlus size={16} />}
                                    variant="light"
                                    fullWidth
                                >
                                    Add Contributor
                                </Button>
                            </Stack>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        {/* Current Allocations */}
                        {addresses.length > 0 && (
                            <Card p="lg" radius="md" withBorder>
                                <Title order={3} mb="md">Current Allocations</Title>
                                <Stack gap="sm">
                                    {addresses.map(address => (
                                        <Paper key={address} p="md" withBorder radius="sm">
                                            <Group justify="space-between" align="center">
                                                <Stack gap={4}>
                                                    <Text fw={500} size="sm">
                                                        {address.slice(0, 6)}...{address.slice(-4)}
                                                    </Text>
                                                    <Badge size="sm" variant="light">
                                                        {(parseFloat(inputs[address] || 0) * 0.000001).toFixed(6)} USD
                                                    </Badge>
                                                </Stack>
                                                
                                                <Group gap="xs">
                                                    <ActionIcon 
                                                        variant="light" 
                                                        size="sm"
                                                        onClick={() => handleDecrease(address)}
                                                    >
                                                        <IconMinus size={14} />
                                                    </ActionIcon>
                                                    
                                                    <NumberInput
                                                        value={inputs[address] || "0"}
                                                        onChange={(value) => handleInputChange(address, value)}
                                                        size="sm"
                                                        w={80}
                                                        min={0}
                                                    />
                                                    
                                                    <ActionIcon 
                                                        variant="light" 
                                                        size="sm"
                                                        onClick={() => handleIncrease(address)}
                                                    >
                                                        <IconPlus size={14} />
                                                    </ActionIcon>
                                                </Group>
                                            </Group>
                                        </Paper>
                                    ))}
                                    
                                    <Button 
                                        onClick={isApproved ? handleAllocate : handleApprove}
                                        leftSection={<IconCheck size={16} />}
                                        size="md"
                                        fullWidth
                                        mt="md"
                                    >
                                        {isApproved ? "Execute Allocation" : "Approve Contract"}
                                    </Button>
                                </Stack>
                            </Card>
                        )}
                        
                        {addresses.length === 0 && (
                            <Card p="lg" radius="md" withBorder>
                                <Center py="xl">
                                    <Stack align="center" gap="sm">
                                        <IconUsers size={48} color="var(--mantine-color-dimmed)" />
                                        <Text c="dimmed" ta="center">
                                            No contributors added yet
                                        </Text>
                                    </Stack>
                                </Center>
                            </Card>
                        )}
                    </Grid.Col>
                </Grid>

                {/* Allocation History */}
                <Paper p="lg" radius="md" withBorder>
                    <Title order={3} mb="md">Allocation History</Title>
                    
                    {allocationHistory.length > 0 ? (
                        <>
                            <Table.ScrollContainer minWidth={600}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Address</Table.Th>
                                            <Table.Th ta="right">Allocated</Table.Th>
                                            <Table.Th ta="right">Redeemed</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {allocationHistory.map((item, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td>
                                                    <Group gap="sm">
                                                        <Text fw={500} size="sm">
                                                            {item.address.slice(0, 6)}...{item.address.slice(-4)}
                                                        </Text>
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Badge variant="light" color="blue">
                                                        {formatAllocationNumber(item.allocated)}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Badge variant="light" color="green">
                                                        {formatAllocationNumber(item.redeemed)}
                                                    </Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                            
                            <Divider my="md" />
                            
                            {/* Summary */}
                            <Group justify="space-between">
                                <Group gap="xl">
                                    <Stack gap={4}>
                                        <Text size="sm" c="dimmed">Total Allocated</Text>
                                        <Text fw={600}>{formatAllocationNumber(totals.allocated)}</Text>
                                    </Stack>
                                    <Stack gap={4}>
                                        <Text size="sm" c="dimmed">Total Redeemed</Text>
                                        <Text fw={600}>{formatAllocationNumber(totals.redeemed)}</Text>
                                    </Stack>
                                </Group>
                                
                                <Paper p="md" withBorder radius="md" bg="var(--mantine-color-primary-light)">
                                    <Stack gap={4}>
                                        <Text size="sm" c="dimmed">Available to Redeem</Text>
                                        <Text fw={700} size="lg">
                                            {formatAllocationNumber(totals.allocated - totals.redeemed)}
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Group>
                        </>
                    ) : (
                        <Center py="xl">
                            <Stack align="center" gap="sm">
                                <Text c="dimmed" ta="center">
                                    No allocation history available
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Paper>
            </Stack>

            {/* Success Modal */}
            <Modal 
                opened={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)}
                title={
                    <Group gap="sm">
                        <IconCheck size={20} color="var(--mantine-color-green-6)" />
                        <Text fw={600}>Transaction Successful</Text>
                    </Group>
                }
                centered
            >
                <Stack gap="md">
                    <Alert color="green" variant="light">
                        Your allocation transaction has been successfully submitted to the blockchain.
                    </Alert>
                    
                    <Stack gap="xs">
                        <Text size="sm" c="dimmed">Transaction Hash:</Text>
                        <Anchor 
                            href={getTransactionExplorerUrl(account.chainId, txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                        >
                            <Group gap="xs">
                                <Text style={{ wordBreak: "break-all" }}>{txHash}</Text>
                                <IconExternalLink size={14} />
                            </Group>
                        </Anchor>
                    </Stack>
                    
                    <Group justify="flex-end" mt="md">
                        <Button 
                            onClick={() => setShowSuccessModal(false)}
                            variant="light"
                        >
                            Close
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}

export default AllocateForm;
