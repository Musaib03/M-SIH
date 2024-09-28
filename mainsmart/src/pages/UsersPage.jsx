import React, { useState } from "react";
import './User.css'
import Header from "../components/common/Header";
const UserPage = () => {
  const [address, setAddress] = useState(""); // State for the input address
  const [data, setData] = useState(null); // State for the fetched data
  const [error, setError] = useState(null); // State for handling errors
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [selectedCurrency, setSelectedCurrency] = useState("ethereum"); // State for selected currency
    const [useradd,setUseradd] =useState("")
  // Supported networks map
  const networkMapping = {
    ethereum: "ethereum",
    bsc: "bsc",
    polygon: "matic",
    avalanche: "avalanche",
    fantom: "fantom",
  };


  // Function to handle the API call
  const fetchData = async () => {
    const network = networkMapping[selectedCurrency]; // Map selected currency to valid network

    const query = `
    query ($address: String!, $network: EthereumNetwork!) {
      ethereum(network: $network) {
        addressStats(address: {is: $address}) {
          address {
            address {
              address
              annotation
            }
            sendAmount
            sendToCount
            sendTxCount
            sendToCurrencies
            receiveAmount
            receiveTxCount
            receiveFromCount
            receiveFromCurrencies
            feeAmount
            balance
            firstTxAt {
              time
            }
            firstTransferAt {
              time
            }
            lastTxAt {
              time
            }
            lastTransferAt {
              time
            }
            daysWithReceived
            daysWithSent
            daysWithTransfers
            daysWithTransactions
            callTxCount
            calledTxCount
            otherTxCount
          }
        }
      }
    }`;

    // Variables for the query
    const variables = {
      address: address,
      network: network, // Set network dynamically
    };

    // API key and headers
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": "BQY6JYVGt1vYuCbeBfHquPIZ3YywKiIH",
    };

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch("https://graphql.bitquery.io/", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setData(jsonResponse.data.ethereum.addressStats[0].address); // Set the data to the correct part of the response
      } else {
        setError(`Error: ${response.status}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`); // Fix the error handling
    } finally {
      setLoading(false);
    }
  };

  // Handler for the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUseradd(address)
    console.log(useradd)
    if (address.trim()) {
      fetchData(); // Trigger API call if an address is entered
    } else {
      setError("Please enter a valid address.");
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
      	<Header title='Wallet-Status' />

    <div className="cal1">
     
		
      {/* Form to input the address and select network */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Dropdown for selecting the cryptocurrency network */}
        <select value={selectedCurrency}  className="selects" onChange={(e) => setSelectedCurrency(e.target.value)}>
          <option value="ethereum">Ethereum</option>
          <option value="bsc">Binance Smart Chain</option>
          <option value="polygon">Polygon (Matic)</option>
          <option value="avalanche">Avalanche</option>
          <option value="fantom">Fantom</option>
          {/* Add more networks based on Bitquery support */}
        </select>

        <button className="btncal"   type="submit">Search</button>
      </form>

      {/* Display error if exists */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display loading indicator */}
      {loading && <p>Loading...</p>}

      
      {data && (
  <div className="calc5">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="cla6">Address</td>
          <td>{data.address.address}</td>
        </tr>
        <tr>
          <td className="cla6">Annotation</td>
          <td>{data.address.annotation}</td>
        </tr>
        <tr>
          <td className="cla6">Sent Amount</td>
          <td>{data.sendAmount}</td>
        </tr>
        <tr>
          <td className="cla6">Sent To Count</td>
          <td>{data.sendToCount}</td>
        </tr>
        <tr>
          <td className="cla6">Send Tx Count</td>
          <td>{data.sendTxCount}</td>
        </tr>
        <tr>
          <td className="cla6">Send To Currencies</td>
          <td>{data.sendToCurrencies}</td>
        </tr>
        <tr>
          <td className="cla6">Receive Amount</td>
          <td>{data.receiveAmount}</td>
        </tr>
        <tr>
          <td className="cla6">Receive Tx Count</td>
          <td>{data.receiveTxCount}</td>
        </tr>
        <tr>
          <td className="cla6">Receive To Count</td>
          <td>{data.receiveFromCount}</td>
        </tr>
        <tr>
          <td className="cla6" >Balance</td>
          <td>{data.balance}</td>
        </tr>
      
      
      
      </tbody>
    </table>
   
  </div>
)}


    </div>
    </div>
  );
};

export default UserPage;
