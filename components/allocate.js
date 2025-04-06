import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { TextField } from "./ui/TextField";
import { useWriteContracts } from "wagmi/experimental"
import { contracts, hyperfundAbi, hypercertMinterAbi } from "./data";
import { Modal } from "./ui/Modal";
import {useWriteContract, usePublicClient, useAccount } from "wagmi";
import {getContract} from "viem"

function AllocateForm({
  hyperfund,
}) {
    const [addresses, setAddresses] = useState([]);
    const [inputs, setInputs] = useState({}); // State to hold input values
    const allocateForm = useForm();
    const allocate = useWriteContracts()
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
                const response = await fetch(process.env.NEXT_PUBLIC_HYPERINDEXER_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        query: `
                            query GetAllocations($hyperfund: String!) {
                                nonfinancialContributions(where: {hyperfund: $hyperfund}) {
                                    items {
                                        address
                                        units
                                    }
                                }
                            }
                        `,
                        variables: {
                            hyperfund: hyperfund.toLowerCase()
                        }
                    })
                });

                const data = await response.json();
                if (data.data?.nonfinancialContributions?.items) {
                    // Get unique addresses
                    const uniqueAddresses = [...new Set(
                        data.data.nonfinancialContributions.items.map(item => item.address)
                    )];
                    setAddresses(uniqueAddresses);

                    // Process allocation history
                    const history = uniqueAddresses.map(address => {
                        const contributions = data.data.nonfinancialContributions.items
                            .filter(item => item.address === address);
                        const totalAllocated = contributions
                            .reduce((sum, item) => sum + parseInt(item.units), 0);
                        
                        return {
                            address,
                            allocated: (totalAllocated).toString(),
                            redeemed: "0.0"
                        };
                    });
                    setAllocationHistory(history);
                }
            } catch (error) {
                console.error("Error fetching allocations:", error);
            }
        };

        fetchAllocations();
    }, [hyperfund]);

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
            const contracts = []
            addresses.map((a) => {
                if (parseInt(inputs[a]) > 0) {
                    contracts.push({
                        address: hyperfund,
                        abi: hyperfundAbi,
                        functionName: "nonfinancialContribution",
                        args: [
                            a,
                            parseInt(inputs[a])
                        ]
                    })
                }
            });

            const tx = await allocate.writeContractsAsync({
                contracts
            })

            allocateForm.reset();
            setInputs({})
            setTxHash(tx);
            setShowSuccessModal(true);
        } catch {
            try {
                addresses.map(async (a) => {
                    if (parseInt(inputs[a]) > 0) {
                        allocateSingle.writeContractAsync({
                            address: hyperfund,
                            abi: hyperfundAbi,
                            functionName: "nonfinancialContribution",
                            args: [
                                a,
                                parseInt(inputs[a])
                            ]
                        })
                    }
                });

                allocateForm.reset();
                setInputs({})
                setShowSuccessModal(true);
            } catch (e) {
                console.error("Transaction failed: ", e);
            }
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
      <div>
        <form>
            <div className="space-y-4 space-x-4">
              <h4>Allocate funds to contributors</h4>
              {addresses.map(address => (
                  <div key={address} className="flex justify-between">
                      <label>{address}</label>
                      <div className="flex items-center">
                          <button type="button" onClick={() => handleDecrease(address)}>←</button>
                          <input
                              type="number"
                              value={inputs[address] || "0"}
                              onChange={(e) => handleInputChange(address, e.target.value)}
                              className="flex justify-center"
                          />
                          <button type="button" onClick={() => handleIncrease(address)}>→</button>
                      </div>
                  </div>
              ))}
              <div className="flex justify-center mt-5">
                  {!isApproved ? (
                      <Button type="button" onClick={handleApprove}>
                          Approve
                      </Button>
                  ) : (
                      <Button type="button" onClick={handleAllocate}>
                          Allocate
                      </Button>
                  )}
              </div>
            </div>
        </form>
        <form>
          <div className="space-y-4 space-x-4">
            <h4>Add Contributor</h4>
            <TextField
                label="Address"
                fullWidth
                margin="normal"
                {...allocateForm.register("address", {
                  required: true,
                })}
              />
              <TextField
                label="Amount"
                fullWidth
                margin="normal"
                {...allocateForm.register("amount", {
                  required: true,
                })}
              />
              <div className="flex justify-center mt-5">
              <Button type="button" onClick={handleAddAddress}>
                Add
              </Button>
              </div>
              
          </div>
        </form>
        <div className="mt-8">
            <h4>Allocation History</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto mt-4">
                    <thead>
                        <tr className="bg-gray-600">
                            <th className="px-4 py-2 text-left">ETH Address</th>
                            <th className="px-4 py-2 text-right">Amount Allocated</th>
                            <th className="px-4 py-2 text-right">Amount Redeemed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocationHistory.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{item.address}</td>
                                <td className="px-4 py-2 text-right">{item.allocated}</td>
                                <td className="px-4 py-2 text-right">{item.redeemed}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-600">
                        <tr>
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2 text-right font-bold">{totals.allocated.toFixed(1)}</td>
                            <td className="px-4 py-2 text-right font-bold">{totals.redeemed.toFixed(1)}</td>
                        </tr>
                        <tr className="bg-gray-600">
                            <td colSpan="3" className="px-4 py-2 text-right font-bold">
                                Amount to redeem in Pool: {(totals.allocated - totals.redeemed).toFixed(1)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-6">
          <h3 className="text-black text-lg font-medium mb-4">
            Transaction Successful!
          </h3>
          <p className="text-gray-600 mb-4">Transaction Hash:</p>
          <p className="break-all text-sm bg-gray-100 p-2 rounded">{txHash}</p>
          <Button className="mt-4" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

        </div>
    );
}

export default AllocateForm;
