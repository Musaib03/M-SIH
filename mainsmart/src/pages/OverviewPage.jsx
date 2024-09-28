import React, { useEffect, useState } from 'react';
import './Home.css';
import Header from "../components/common/Header";
import StatCard from '../components/common/StatCard';
import {  DollarSign} from "lucide-react";
const Overview = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your Etherscan API key
  const apiKey = 'J1UURGZYD9UJZCISCDGVNKSY7FEAT96KCR';

  // Example Ethereum address (replace with actual address if needed)
  const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

  // Fetch live transactions from Etherscan API
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data.status === '1') {
        setTransactions(data.result); // Update state with the fetched transactions
        setLoading(false); // Stop loading once data is fetched
      } else {
        setError('Unable to fetch transactions');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Poll the data every 30 seconds for live updates
    const interval = setInterval(() => {
      fetchTransactions();
    },30000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title="Live Ethereum Transactions" />
      <div  className="o11">
		<StatCard name='Transaction(24H)' icon={DollarSign} value={115118} color='#EF4444' />
		</div>
      <div className='home'>
      
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Hash Id
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  From
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  To
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Value
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Gas Used
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {transactions.slice(0, 10).map((tx, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {tx.hash}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {tx.from}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {tx.to}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {parseFloat(tx.value / 10 ** 18).toFixed(5)} ETH
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {tx.gasUsed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
