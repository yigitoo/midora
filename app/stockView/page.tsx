import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const StockList = styled.ul`
  list-style: none;
  padding: 0;
  width: 300px;
`;

const StockItem = styled.li`
  background-color: #fff;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockName = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const StockPrice = styled.span`
  font-size: 1rem;
  color: #666;
`;

const StockSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState([
    { name: 'AAPL', price: 150 },
    { name: 'GOOGL', price: 2800 },
    { name: 'AMZN', price: 3400 },
  ]);

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>Stock Search</Title>
      <SearchBar
        type="text"
        placeholder="Search for a stock..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <StockList>
        {filteredStocks.map(stock => (
          <StockItem key={stock.name}>
            <StockName>{stock.name}</StockName>
            <StockPrice>${stock.price}</StockPrice>
          </StockItem>
        ))}
      </StockList>
    </Container>
  );
};

export default StockSearchPage;
