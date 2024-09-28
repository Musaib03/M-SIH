import React, { useState } from 'react';
import axios from 'axios';

import './Settings.css';
import Header from "../components/common/Header";
import Scrapper from './Scrapper';

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
      if (response.data) {
        setResults(response.data);
      } else {
        setError('No data found. Please try again with different inputs.');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please check your inputs.');
    }
  };

  return (
    <>
      <div className='flex-1 overflow-auto relative z-10'>
        <Header title='Investigate' />
        <div className='App'>
          <div className='sett'>
            <form onSubmit={handleSubmit}>
              <div>
                <input type="text" value={txid} onChange={(e) => setTxid(e.target.value)} required placeholder='Transaction ID:' />
              </div>
              <div>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className='sett1' required>
                  <option value="btc">BTC</option>
                  <option value="ltc">LTC</option>
                </select>
              </div>
              <div>
                <input type="text" value={clusterDb} onChange={(e) => setClusterDb(e.target.value)} placeholder='Cluster DB' required />
              </div>
              <div>
                <input type="text" value={mixer} onChange={(e) => setMixer(e.target.value)} placeholder='Mixer' required />
              </div>
              <div>
                <input type="text" value={searchType} onChange={(e) => setSearchType(e.target.value)} placeholder='Search Type (in/out/all)' required />
              </div>
              <button type="submit" className='btne'>Search</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results && results.incoming && results.outgoing && results.real_receiver && (
              <div>
                <h2>Search Results</h2>
                
                <ul>
                  {results.incoming.map((item, index) => (
                    <div className='li'>
                      <h3>Incoming Transactions</h3>
                    <li key={index}>
                            Address: {item.address}, Amount: {item.amount}
                    </li>
                    </div>
                  ))}
                </ul>

               
                <ul>
                  {results.outgoing.map((item, index) => (
                    <div className='lii'>
                       <h3>Outgoing Transactions</h3>
                    <li key={index}>
                      Address: {item.address}, Amount: {item.amount}
                    </li>
                    </div>
                  ))}
                </ul>

                <div className='liii'>
                <h3>Real Receiver</h3>
                <p>Address: {results.real_receiver.address}, Amount: {results.real_receiver.amount}</p>
                  </div>
              </div>
            )}

            {/* Only render Scrapper if incoming transactions exist */}
            {results && results.incoming && <Scrapper incomingAddresses={results.incoming.map(item => item.address)} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
