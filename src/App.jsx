import { useState, useEffect } from 'react'
import './App.css'

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'KRW', symbol: '₩', flag: '🇰🇷', name: 'Korean Won' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Chinese Yuan' },
  { code: 'TWD', symbol: 'NT$', flag: '🇹🇼', name: 'Taiwan Dollar' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'MYR', symbol: 'RM', flag: '🇲🇾', name: 'Malaysian Ringgit' },
]

const QUICK_AMOUNTS = [10000, 20000, 30000]

function App() {
  const [amount, setAmount] = useState(10000)
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [customInput, setCustomInput] = useState('')

  const fetchRates = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY' )
      const data = await response.json()
      setRates(data.rates)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickAmount = (value) => {
    setAmount(value)
    setCustomInput('')
  }

  const handleCustomInput = (digit) => {
    const newInput = customInput + digit
    const numValue = parseInt(newInput, 10)
    if (numValue <= 999999) {
      setCustomInput(newInput)
      setAmount(numValue)
    }
  }

  const handleClear = () => {
    setCustomInput('')
    setAmount(0)
  }

  const handleBackspace = () => {
    const newInput = customInput.slice(0, -1)
    setCustomInput(newInput)
    setAmount(newInput ? parseInt(newInput, 10) : 0)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date) => {
    if (!date) return '--:--'
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="app">
      <div className="watermark">
        <img src="/kappodo-logo.png" alt="Kappodo" />
      </div>

      <div className="container">
        <header>
          <h1>Today's Exchange Rates in Japan</h1>
          <p className="date">{formatDate()}</p>
          <p className="last-update">Last Updated: {formatTime(lastUpdate)}</p>
        </header>

        <div className="input-section">
          <div className="amount-display">
            <span className="currency-symbol">¥</span>
            <span className="amount">{amount.toLocaleString()}</span>
          </div>

          <div className="quick-buttons">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                className={`quick-btn ${amount === value && !customInput ? 'active' : ''}`}
                onClick={() => handleQuickAmount(value)}
              >
                ¥{value.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button key={digit} className="numpad-btn" onClick={() => handleCustomInput(digit.toString())}>
                {digit}
              </button>
            ))}
            <button className="numpad-btn" onClick={handleClear}>
              C
            </button>
            <button className="numpad-btn" onClick={() => handleCustomInput('0')}>
              0
            </button>
            <button className="numpad-btn" onClick={handleBackspace}>
              ⌫
            </button>
          </div>
        </div>

        <div className="rates-section">
          {loading ? (
            <p className="loading">Loading exchange rates...</p>
          ) : (
            <div className="rates-grid">
              {CURRENCIES.map((currency) => {
                const rate = rates[currency.code]
                const converted = rate ? amount * rate : 0
                return (
                  <div key={currency.code} className="rate-card">
                    <div className="rate-header">
                      <span className="flag">{currency.flag}</span>
                      <span className="code">{currency.code}</span>
                    </div>
                    <div className="rate-value">
                      {currency.symbol} {formatNumber(converted)}
                    </div>
                    <div className="rate-name">{currency.name}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
