'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface Stock {
  symbol: string;
  description: string;
}

const stockList: Stock[] = [
  { symbol: 'AAPL', description: 'Apple Inc.' },
  { symbol: 'MSFT', description: 'Microsoft Corp.' },
  { symbol: 'GOOGL', description: 'Alphabet Inc.' },
  { symbol: 'AMZN', description: 'Amazon.com Inc.' },
  { symbol: 'TSLA', description: 'Tesla Inc.' },
];

const StockViewPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>(stockList);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  useEffect(() => {
    const filtered = stockList.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchQuery]);

  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=YOUR_API_KEY`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStockData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol: string) => {
    setSearchQuery('');
    setIsSearchBarFocused(false);
    setSelectedStock(symbol);
    fetchStockData(symbol);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const searchBarVariants = {
    expanded: { width: '300px', opacity: 1, x: 0 },
    collapsed: { width: '50px', opacity: 0.6, x: -250 },
  };

  const stockDetailsVariants = {
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hidden: { opacity: 0, x: '-100%' },
  };

  return (
    <motion.div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
      <motion.div
        className="fixed top-4 left-4 bg-white rounded-full shadow-md flex items-center overflow-hidden"
        variants={searchBarVariants}
        animate={selectedStock ? "collapsed" : "expanded"}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ width: isSearchBarFocused || !selectedStock ? '300px' : '50px' }}
      >
        <motion.input
          type="text"
          placeholder="Search stock..."
          value={searchQuery}
          onFocus={() => setIsSearchBarFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchBarFocused(false), 100)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 outline-none text-gray-700"
          style={{ width: '200px' }}
        />
        {searchQuery && (
          <motion.button
            className="pr-4 cursor-pointer"
            onClick={handleClearSearch}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="text-gray-500" size={20} />
          </motion.button>
        )}
        <motion.div className="px-4">
          <Search className="text-gray-500" size={20} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {searchQuery && isSearchBarFocused && (
          <motion.ul
            className="absolute top-20 left-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredStocks.map((stock) => (
              <motion.li
                key={stock.symbol}
                className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleStockSelect(stock.symbol)}
                whileHover={{ backgroundColor: '#E2E8F0' }}
                transition={{ duration: 0.1 }}
              >
                {stock.symbol} - {stock.description}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-24 p-8 bg-white rounded-lg shadow-md w-3/4"
        variants={stockDetailsVariants}
        initial="hidden"
        animate={selectedStock ? "visible" : "hidden"}
      >
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {stockData && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{stockData.symbol}</h2>
            <p className="text-gray-600">Price: {stockData.close}</p>
            <p className="text-gray-600">Change: {stockData.change}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StockViewPage;
