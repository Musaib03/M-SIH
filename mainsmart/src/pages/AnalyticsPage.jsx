import React, { useState } from 'react';
import './AnalytinPage.css';
import Header from '../components/common/Header';

function AnalyticPage() {
  const [walletAddresses, setWalletAddresses] = useState('');
  const [platform, setPlatform] = useState('telegram'); // Default platform is telegram
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/scrape/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_addresses: walletAddresses.split(',').map(addr => addr.trim()),
        platform: platform,  // Send the selected platform
      }),
    });

    const data = await response.json();
    setResults(data.results);
  };

  return (
	<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Scrapper' />
    <div className="App">
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="search-input"
          placeholder="Enter wallet addresses"
          value={walletAddresses}
          onChange={(e) => setWalletAddresses(e.target.value)}
        />

        <select
          className="platform-select"
          value={platform}
		  
          onChange={(e) => setPlatform(e.target.value)}
		  
        >
          <option value="telegram">Telegram</option>
          <option value="reddit">Reddit</option>
        </select>

        <button type="submit" className="submit-button">Search</button>
      </form>

      <h2>Results</h2>
      {results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Dialog Name / Username</th>
              <th>Message / Content Type</th>
              <th>Sender / Contact Info</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.dialog_name || result.username}</td>
                <td>{result.message || result.content_type}</td>
                <td>{result.sender || `${result.contact_number} / ${result.email_address}`}</td>
                <td><a href={result.url} target="_blank" rel="noopener noreferrer">View Post</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found</p>
      )}
    </div>
    </div>
  );
}

export default AnalyticPage;
