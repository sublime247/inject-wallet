// src/components/Wallet.jsx
import { useState } from "react";
import { useWalletConn } from "../hooks/useWallet";
import { useBalance } from "../hooks/useAccount";

const Wallet = () => {
  const [inputAddress, setInputAddress] = useState(""); //input 
  const [balanceForInput, setBalanceForInput] = useState(null); 


  const { account, chainId, isConnected, errorMessage, getAccount, disconnectAccount } = useWalletConn();
  
 
  const { balance: connectedAccountBalance, fetchBalance } = useBalance(window.ethereum, account, chainId);

  
  const handleGetBalanceForInput = async () => {
    if (inputAddress) {
      const provider = window.ethereum;
      try {
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [inputAddress, "latest"],
        });
        
        const balanceInEther = Number(balanceHex) / 1e18; 
        setBalanceForInput(balanceInEther);
      } catch (error) {
        console.error("Error fetching balance for input address:", error);
        setBalanceForInput(null);
      }
    } else {
      console.error("No address entered.");
    }
  };

  return (
<div className="w-full max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
  {/* Address Input Section */}
  <div className="mb-8">
    <input
      type="text"
      placeholder="Enter address"
      value={inputAddress}
      onChange={(e) => setInputAddress(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
    />
    <button
      onClick={handleGetBalanceForInput}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
    >
      Get Balance for Address
    </button>

    <h3 className="mt-4 text-xl font-semibold text-gray-800">
      Balance for {inputAddress}:{" "}
      <span className="font-medium text-blue-600">
        {balanceForInput !== null ? `${balanceForInput} ETH` : "Enter a valid address"}
      </span>
    </h3>
  </div>

  {/* Ethereum Account Section */}
  <div className="p-6 bg-white rounded-lg shadow-md">
    {!isConnected ? (
      <button
        onClick={getAccount}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
      >
        Enable Ethereum
      </button>
    ) : (
      <>
        <h2 className="text-xl font-semibold text-gray-700">
          Connected Account:{" "}
          <span className="font-medium text-green-600">{account || errorMessage}</span>
        </h2>
        {chainId && (
          <h3 className="mt-2 text-lg font-medium text-gray-800">
            Connected to Chain ID: <span className="font-semibold text-purple-600">{chainId}</span>
          </h3>
        )}
        <button
          onClick={disconnectAccount}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Disconnect
        </button>

        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          Balance for Connected Account:{" "}
          <span className="font-medium text-blue-600">
            {connectedAccountBalance !== null ? `${connectedAccountBalance} ETH` : "Fetching balance..."}
          </span>
        </h3>
      </>
    )}
    {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
  </div>
</div>

  );
};

export default Wallet;