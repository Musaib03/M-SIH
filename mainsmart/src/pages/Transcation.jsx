import React, { useState, useEffect } from "react";
import axios from "axios";
import OrdersTable from "../components/orders/OrdersTable";

const Transcation = ({ address1 }) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "J1UURGZYD9UJZCISCDGVNKSY7FEAT96KCR"; // Your Etherscan API key

  // Function to fetch balance
  const fetchBalance = async (ethAddress) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${ethAddress}&tag=latest&apikey=${apiKey}`
      );
      if (response.data.status === "1") {
        setBalance((response.data.result / 1e18).toFixed(5)); // Convert Wei to ETH
      } else {
        setError("Failed to fetch balance. Check if the address is valid.");
      }
    } catch (err) {
      setError(`Error fetching balance: ${err.message}`);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async (ethAddress) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${ethAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
      );
      if (response.data.status === "1") {
        setTransactions(response.data.result);
        console.log(response.data.result)
      } else {
        setError("Failed to fetch transactions. Check if the address is valid.");
      }
    } catch (err) {
      setError(`Error fetching transactions: ${err.message}`);
    }
    setLoading(false); // Set loading to false after fetching
  };

  // Fetch data when address1 changes
  useEffect(() => {
    if (address1) {
      const formattedAddress = address1.toLowerCase();
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear previous errors
      fetchBalance(formattedAddress);
      fetchTransactions(formattedAddress);
    }
  }, [address1]);

  // Display loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      
     
    <OrdersTable
     transactions={transactions}
     balance={balance}
     address1={address1}
    />
    </div>
  );
};

export default Transcation;
