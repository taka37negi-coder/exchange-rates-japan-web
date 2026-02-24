import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

// Currency configuration
const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'KRW', symbol: '₩', flag: '🇰🇷', name: 'Korean Won' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Chinese Yuan' },
  { code: 'TWD', symbol: 'NT$', flag: '🇹🇼', name: 'Taiwan Dollar' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'MYR', symbol: 'RM', flag: '🇲🇾', name: 'Malaysian Ringgit' },
];

const QUICK_AMOUNTS = [10000, 20000, 30000];

export default function App() {
  const [jpyAmount, setJpyAmount] = useState<string>('10000');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch exchange rates
  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/JPY'
      );
      setRates(response.data.rates);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAmount = (amount: number) => {
    setJpyAmount(amount.toString());
  };

  const handleNumberInput = (num: string) => {
    if (num === 'clear') {
      setJpyAmount('0');
    } else if (num === 'backspace') {
      setJpyAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else {
      setJpyAmount((prev) => {
        const newValue = prev === '0' ? num : prev + num;
        return newValue;
      });
    }
  };

  const convertAmount = (currencyCode: string): string => {
    const amount = parseFloat(jpyAmount) || 0;
    const rate = rates[currencyCode] || 0;
    const converted = amount * rate;
    
    if (currencyCode === 'KRW') {
      return Math.round(converted).toLocaleString();
    }
    return converted.toFixed(2);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Kappodo Logo Watermark */}
      <Image
        source={require('../assets/kappodo-logo.png')}
        style={styles.watermark}
        resizeMode="contain"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Today's Exchange Rates in Japan</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
          <Text style={styles.updateTime}>
            Last updated: {formatTime(lastUpdate)}
          </Text>
        </View>

        {/* JPY Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.jpyLabel}>Japanese Yen (¥)</Text>
          <Text style={styles.jpyAmount}>¥{parseFloat(jpyAmount || '0').toLocaleString()}</Text>
          
          {/* Quick Select Buttons */}
          <View style={styles.quickButtons}>
            {QUICK_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => handleQuickAmount(amount)}
              >
                <Text style={styles.quickButtonText}>
                  ¥{amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['clear', '0', 'backspace']].map(
            (row, rowIndex) => (
              <View key={rowIndex} style={styles.numberRow}>
                {row.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberButton}
                    onPress={() => handleNumberInput(num)}
                  >
                    <Text style={styles.numberButtonText}>
                      {num === 'clear' ? 'C' : num === 'backspace' ? '⌫' : num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>

        {/* Currency Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Converted Amounts</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading rates...</Text>
          ) : (
            <View style={styles.currencyGrid}>
              {CURRENCIES.map((currency) => (
                <View key={currency.code} style={styles.currencyCard}>
                  <Text style={styles.currencyFlag}>{currency.flag}</Text>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                  <Text style={styles.currencyAmount}>
                    {currency.symbol}{convertAmount(currency.code)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 400,
    height: 400,
    marginLeft: -200,
    marginTop: -200,
    opacity: 0.1,
    zIndex: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 8,
  },
  updateTime: {
    fontSize: 16,
    color: '#94a3b8',
  },
  inputSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  jpyLabel: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 8,
  },
  jpyAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 24,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 140,
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  numberPad: {
    marginBottom: 32,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  numberButton: {
    backgroundColor: '#e2e8f0',
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  resultsSection: {
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  currencyCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  currencyFlag: {
    fontSize: 48,
    marginBottom: 8,
  },
  currencyCode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  currencyAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d97706',
  },
});
