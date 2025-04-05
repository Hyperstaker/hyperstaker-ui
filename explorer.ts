export function getTransactionExplorerUrl(
  chainId: number | undefined,
  transactionId: string
): string | null {
  const networkMap: { [key: number]: string } = {
    1: "https://etherscan.io/tx/", // Ethereum Mainnet
    3: "https://ropsten.etherscan.io/tx/", // Ropsten Testnet
    4: "https://rinkeby.etherscan.io/tx/", // Rinkeby Testnet
    5: "https://goerli.etherscan.io/tx/", // Goerli Testnet
    42: "https://kovan.etherscan.io/tx/", // Kovan Testnet
    11155111: "https://sepolia.etherscan.io/tx/", // Sepolia Testnet
  };

  if (chainId && networkMap[chainId]) {
    return `${networkMap[chainId]}${transactionId}`;
  } else {
    console.error("Unsupported chain ID or chain ID is undefined.");
    return null;
  }
}
