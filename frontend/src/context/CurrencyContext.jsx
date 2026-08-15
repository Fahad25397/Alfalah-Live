import React, { createContext, useContext, useState } from 'react';

export const DEFAULT_CURRENCIES = {
  PKR: { label: 'PKR (₨)', symbol: '₨ ', rate: 1 },
  AED: { label: 'AED', symbol: 'AED ', rate: 0.013 },
  SAR: { label: 'SAR', symbol: 'SAR ', rate: 0.0135 },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('PKR');
  
  const [currencies, setCurrencies] = useState(() => {
    const savedRates = localStorage.getItem('admin_currency_rates');
    return savedRates ? JSON.parse(savedRates) : DEFAULT_CURRENCIES;
  });

  const updateCurrencyRates = (newRates) => {
    setCurrencies(newRates);
    localStorage.setItem('admin_currency_rates', JSON.stringify(newRates));
  };

  const formatPrice = (priceInPKR) => {
    const currency = currencies[currentCurrency] || currencies.PKR;
    const numericPrice = Number(priceInPKR || 0);
    const converted = numericPrice * (currency.rate || 1);

    const formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    // Returns a structured element to prevent browser direction flipping
    return (
      <span style={{ unicodeBidi: 'plaintext', display: 'inline-block' }}>
        <span style={{ marginRight: '4px' }}>{currency.symbol}</span>
        <span>{formattedNumber}</span>
      </span>
    );
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrentCurrency, formatPrice, currencies, updateCurrencyRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);