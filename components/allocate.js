import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { TextField } from "./ui/TextField";
import { useWriteContracts } from "wagmi/experimental"
import { contracts, hyperfundAbi, hypercertMinterAbi } from "./data";
import { Modal } from "./ui/Modal";
import {useWriteContract, usePublicClient, useAccount } from "wagmi";
import {getContract} from "viem"
import { getTransactionExplorerUrl } from "@/explorer";
import { EnsName } from "./ens";

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

    const allocationhistoryComponent = allocationHistory.map((item, index) => (
      <tr key={index} className="border-b">
          <td className="px-4 py-2"><EnsName address={(item.address)}/></td>
          <td className="px-4 py-2 text-right">{String(item.allocated)}</td>
          <td className="px-4 py-2 text-right">{String(item.redeemed)}</td>
      </tr>
  ))
    return (
      <div>
        <form>
            <div className="space-y-4 space-x-4">
              <h3 className="text-xl font-semibold mb-4">Allocate funds to contributors</h3>
              
              {addresses.map(address => (
                  <div key={address} className="flex justify-between">
                      <label className="flex gap gap-x-5">
                        <EnsName address={address}/>
                        <div>({(parseFloat(inputs[address] || 0) * 0.000001).toFixed(6)} USD)</div>
                      </label>
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
              {addresses.length > 0 ? <div className="flex justify-center mt-5">
                  {!isApproved ? (
                      <Button type="button" onClick={handleApprove}>
                          Approve
                      </Button>
                  ) : (
                      <Button type="button" onClick={handleAllocate}>
                          Allocate
                      </Button>
                  )}
              </div> : null}
            </div>
        </form>
        <form>
          <div className="space-y-4 space-x-4">
            <h5>Add Contributor</h5>
            <TextField
                label="Address"
                margin="normal"
                {...allocateForm.register("address", {
                  required: true,
                })}
              />
              <TextField
                label={`Fraction Amount (Amount of Hypercert fraction to be allocated to contributor, equivalent to ${allocateForm.watch("amount") * 0.000001} USD)`}
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
        <h3 className="text-xl font-semibold mb-4">Allocation History</h3>
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
                        {allocationhistoryComponent}
                    </tbody>
                    <tfoot className="bg-gray-600">
                        <tr>
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2 text-right font-bold">{String(totals.allocated.toFixed(1))}</td>
                            <td className="px-4 py-2 text-right font-bold">{String(totals.redeemed.toFixed(1))}</td>
                        </tr>
                        <tr className="bg-gray-600">
                            <td colSpan="3" className="px-4 py-2 text-right font-bold">
                                Amount to redeem in Pool: {String((totals.allocated - totals.redeemed).toFixed(1))}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-green-500">
            Transaction Successful!
          </h3>
          <p className="text-gray-200 mb-4">Transaction Hash:</p>
          <a 
            href={`${getTransactionExplorerUrl(account.chainId, txHash)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm bg-gray-700 p-2 rounded text-blue-400 hover:text-blue-300 block mb-4"
          >
            {txHash}
          </a>
          <Button className="mt-4" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

        </div>
    );
}

export default AllocateForm;
