"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Color palette for holdings
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F9F', '#4EA8DE', '#98D8AA'];

const BillionairePortfolio = () => {
  interface Holding {
    name: string;
    value: number;
    color: string;
  }

  interface PortfolioData {
    [key: string]: Holding[];
  }

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBillionaire, setSelectedBillionaire] = useState(null);

  // List of billionaires to track (with their CIK numbers)
  const BILLIONAIRES = {
    'Warren Buffett': '0001067983',
    'Bill Gates': '0001166559',
    'Jeff Bezos': '0001043298'
  };

  const fetchHoldings = async (cik: string | number) => {
    try {
      if (typeof cik !== 'string') {
        cik = cik.toString();
      }
      const response = await fetch(`/api/holdings/${cik}`);
      if (response.status === 404) {
        throw new Error('Holdings data not found');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching holdings:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allData = {};
        for (const [name, cik] of Object.entries(BILLIONAIRES)) {
          const holdings = await fetchHoldings(cik);

          // Process and format the holdings data
          const formattedHoldings = holdings.map((holding, index) => ({
              name: holding.company,
              value: parseFloat(holding.percentage.toFixed(2)),
              color: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);

          // Group smaller holdings into "Others"
          const significantHoldings = formattedHoldings.slice(0, 4);
          const othersValue = formattedHoldings
            .slice(4)
            .reduce((sum, holding) => sum + holding.value, 0);

          if (othersValue > 0) {
            significantHoldings.push({
              name: 'Others',
              value: parseFloat(othersValue.toFixed(2)),
              color: COLORS[4]
            });
          }

          allData[name] = significantHoldings;
        }
        setPortfolioData(allData);
        if (!selectedBillionaire) {
          setSelectedBillionaire(Object.keys(allData)[0]);
        }
      } catch (err) {
        setError('Failed to fetch portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAllData, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatTooltip = (value, name) => {
    return [`${value}%`, name];
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Billionaire Portfolio Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedBillionaire && (
            <Tabs
              value={selectedBillionaire}
              onValueChange={setSelectedBillionaire}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                {Object.keys(portfolioData).map((billionaire) => (
                  <TabsTrigger
                    key={billionaire}
                    value={billionaire}
                    className="px-4 py-2"
                  >
                    {billionaire}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(portfolioData).map(([billionaire, holdings]) => (
                <TabsContent
                  key={billionaire}
                  value={billionaire}
                  className="mt-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={holdings}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={140}
                            label={(entry) => `${entry.name} (${entry.value}%)`}
                          >
                            {holdings.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={formatTooltip} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Holdings Breakdown</h3>
                      <div className="space-y-2">
                        {holdings.map((holding) => (
                          <div
                            key={holding.name}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: holding.color }}
                              />
                              <span>{holding.name}</span>
                            </div>
                            <span className="font-semibold">{holding.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillionairePortfolio;
