import { useState, useEffect } from 'react';
import './App.css';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'KRW', name: 'Korean Won', flag: '🇰🇷' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'TWD', name: 'Taiwan Dollar', flag: '🇹🇼' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
];

function App() {
  const [amount, setAmount] = useState('10000');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showNumpad, setShowNumpad] = useState(false);
  const [showCurrencySelection, setShowCurrencySelection] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState(
    CURRENCIES.map(c => c.code)
  );

  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY' );
      const data = await response.json();
      setRates(data.rates);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rates:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSelect = (value) => {
    setAmount(value);
  };

  const handleNumpadClick = (value) => {
    if (value === 'C') {
      setAmount('0');
    } else if (value === '←') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setAmount(prev => {
        const newAmount = prev === '0' ? value : prev + value;
        return newAmount.length <= 10 ? newAmount : prev;
      });
    }
  };

  const toggleCurrency = (code) => {
    setSelectedCurrencies(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  return (
    <div className="app">
      <div className="watermark">
        <img src={`${import.meta.env.BASE_URL}kappodo-logo.png`} alt="Kappodo" />
      </div>

      <div className="container">
        <header>
          <h1>Today's Exchange Rates in Japan</h1>
          <div className="date">{formatDate()}</div>
          {lastUpdate && (
            <div className="last-update">
              Last updated: {formatTime(lastUpdate)}
            </div>
          )}
        </header>

        <button 
          className="toggle-selection-btn"
          onClick={() => setShowCurrencySelection(!showCurrencySelection)}
        >
          {showCurrencySelection ? '✕ Hide Currency Selection' : '⚙️ Select Currencies'}
        </button>

        {showCurrencySelection && (
          <div className="currency-selection">
            <h3>Select Currencies to Display</h3>
            <div className="currency-checkboxes">
              {CURRENCIES.map(currency => (
                <label key={currency.code} className="currency-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCurrencies.includes(currency.code)}
                    onChange={() => toggleCurrency(currency.code)}
                  />
                  <span className="checkbox-flag">{currency.flag}</span>
                  <span className="checkbox-label">{currency.code}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="input-section">
          <div 
            className={`amount-display ${!showNumpad ? 'clickable' : ''}`}
            onClick={() => !showNumpad && setShowNumpad(true)}
          >
            <span className="currency-symbol">¥</span>
            <span className="amount">{parseInt(amount).toLocaleString()}</span>
          </div>

          <div className="quick-buttons">
            <button
              className={`quick-btn ${amount === '10000' ? 'active' : ''}`}
              onClick={() => handleQuickSelect('10000')}
            >
              ¥10,000
            </button>
            <button
              className={`quick-btn ${amount === '20000' ? 'active' : ''}`}
              onClick={() => handleQuickSelect('20000')}
            >
              ¥20,000
            </button>
            <button
              className={`quick-btn ${amount === '30000' ? 'active' : ''}`}
              onClick={() => handleQuickSelect('30000')}
            >
              ¥30,000
            </button>
          </div>

          {showNumpad && (
            <>
              <button 
                className="hide-numpad-btn"
                onClick={() => setShowNumpad(false)}
              >
                ✕ Hide Number Pad
              </button>
              <div className="numpad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((btn) => (
                  <button
                    key={btn}
                    className="numpad-btn"
                    onClick={() => handleNumpadClick(btn)}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rates-section">
          {loading ? (
            <div className="loading">Loading exchange rates...</div>
          ) : (
            <div className="rates-grid">
              {CURRENCIES.filter(currency => selectedCurrencies.includes(currency.code)).map((currency) => {
                const rate = rates[currency.code] || 0;
                const converted = (numericAmount * rate).toFixed(2);
                return (
                  <div key={currency.code} className="rate-card">
                    <div className="rate-header">
                      <span className="flag">{currency.flag}</span>
                      <span className="code">{currency.code}</span>
                    </div>
                    <div className="rate-value">{parseFloat(converted).toLocaleString()}</div>
                    <div className="rate-name">{currency.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
