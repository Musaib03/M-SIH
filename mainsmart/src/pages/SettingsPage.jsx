import React, { useState } from 'react';
import axios from 'axios';
import { Settings } from 'lucide-react';
import './Settings.css'
import Header from "../components/common/Header";
function SettingsPage() {
  const [txid, setTxid] = useState('');
  const [currency, setCurrency] = useState('btc');
  const [clusterDb, setClusterDb] = useState('we');
  const [mixer, setMixer] = useState('bestmixer');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);

    const requestBody = {
      txid: txid,
      currency: currency,
      cluster_db: clusterDb,
      mixer: mixer,
      search_type: searchType
    };

    try {
      const response = await axios.post('http://localhost:8000/api/find_matching_transactions/', requestBody);
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please check your inputs.');
    }
  };

  return (
    <main className='App'>
		<div className='flex-1 overflow-auto relative z-10'>
		      <Header title='Investigate' />
          <div >
      <h1>Find Matching Transactions</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Transaction ID:</label>
          <input type="text" value={txid} onChange={(e) => setTxid(e.target.value)} required />
        </div>
        <div>
          <label>Currency (btc/ltc):</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} required>
            <option value="btc">BTC</option>
            <option value="ltc">LTC</option>
          </select>
        </div>
        <div>
          <label>Cluster DB:</label>
          <input type="text" value={clusterDb} onChange={(e) => setClusterDb(e.target.value)} required />
        </div>
        <div>
          <label>Mixer:</label>
          <input type="text" value={mixer} onChange={(e) => setMixer(e.target.value)} required />
        </div>
        <div>
          <label>Search Type (in/out/all):</label>
          <input type="text" value={searchType} onChange={(e) => setSearchType(e.target.value)} required />
        </div>
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div>
          <h2>Search Results</h2>
          <h3>Incoming Transactions</h3>
          <ul>
            {results.incoming.map((item, index) => (
              <li key={index}>
                Address: {item.address}, Amount: {item.amount}
              </li>
            ))}
          </ul>

          <h3>Outgoing Transactions</h3>
          <ul>
            {results.outgoing.map((item, index) => (
              <li key={index}>
                Address: {item.address}, Amount: {item.amount}
              </li>
            ))}
          </ul>

          <h3>Real Receiver</h3>
          <p>Address: {results.real_receiver.address}, Amount: {results.real_receiver.amount}</p>
        </div>
      )}
    </div>
    </div>
	</main>
  );
}

export default SettingsPage;
