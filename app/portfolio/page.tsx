"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  image: string;
  netWorth: string;
  mainInvestments: string[];
  topStocks: { name: string; percentage: number }[];
  lastUpdate: string;
  celebrityUrl?: string | null;
}

const celebrityPortfolios: Portfolio[] = [
  {
    id: "1",
    name: "Warren Buffett",
    image: "/images/portfolios/warren_buffet.jpg",
    netWorth: "$110.5B",
    mainInvestments: ["Berkshire Hathaway", "Apple", "Bank of America"],
    topStocks: [
      { name: "AAPL", percentage: 45 },
      { name: "BAC", percentage: 25 },
      { name: "KO", percentage: 15 },
    ],
    lastUpdate: "02.02.2025",
    celebrityUrl: "/portfolios/warren-buffett",
  },
  {
    id: "2",
    name: "Bill Gates",
    image: "/images/portfolios/bill_gates.jpg",
    netWorth: "$120.2B",
    mainInvestments: ["Microsoft", "Republic Services", "Canadian Railway"],
    topStocks: [
      { name: "MSFT", percentage: 40 },
      { name: "RSG", percentage: 20 },
      { name: "CNI", percentage: 15 },
    ],
    lastUpdate: "02.02.2025",
    celebrityUrl: "/portfolios/bill-gates",
  },
  // Add more celebrity portfolios...
];

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPortfolios = celebrityPortfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ünlü Yatırımcı Portföyleri
        </h1>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Yatırımcı Ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              onClick={
                () =>
                  window.alert(
                    "Ünlülerin detaylı portföylerinin bulunduğu sayfalar eklenecektir!!!"
                  ) /*() => window.open(portfolio.celebrityUrl)*/
              }
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="relative h-48 mb-4">
                  <img
                    src={portfolio.image}
                    alt={portfolio.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardTitle className="text-xl font-bold">
                  {portfolio.name}
                </CardTitle>
                <p className="text-2xl font-semibold text-primary">
                  {portfolio.netWorth}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Ana Yatırımlar</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.mainInvestments.map((investment, i) => (
                        <span
                          key={i}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {investment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Top Hisseler</h3>
                    <div className="space-y-2">
                      {portfolio.topStocks.map((stock, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium">
                            {stock.name}
                          </span>
                          <div className="w-2/3 bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${stock.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {stock.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground text-right">
                    Son Güncelleme: {portfolio.lastUpdate}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


/*
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  image: string;
  netWorth: string;
  mainInvestments: string[];
  topStocks: { name: string; percentage: number }[];
  lastUpdate: string;
  celebrityUrl?: string | null;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios");
      if (!response.ok) throw new Error("Failed to fetch portfolios");
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      setError("Portföy bilgileri yüklenirken hata oluştu");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = portfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <>
        <div
          style={{ fontSize: "3rem" }}
          className="text-center font-bold py-10"
        >
          Yükleniyor...
        </div>
        <Loader2 className="mx-auto w-24 h-24" />
      </>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ünlü Yatırımcı Portföyleri
        </h1>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Yatırımcı Ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolios.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              onClick={
                () =>
                  window.alert(
                    "Ünlülerin detaylı portföylerinin bulunduğu sayfalar eklenecektir!!!"
                  ) /*() => window.open(portfolio.celebrityUrl)*//*
              }
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="relative h-48 mb-4">
                  <img
                    src={portfolio.image}
                    alt={portfolio.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardTitle className="text-xl font-bold">
                  {portfolio.name}
                </CardTitle>
                <p className="text-2xl font-semibold text-primary">
                  {portfolio.netWorth}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Ana Yatırımlar</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.mainInvestments.map((investment, i) => (
                        <span
                          key={i}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {investment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Top Hisseler</h3>
                    <div className="space-y-2">
                      {portfolio.topStocks.map((stock, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium">
                            {stock.name}
                          </span>
                          <div className="w-2/3 bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${stock.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {stock.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground text-right">
                    Son Güncelleme: {portfolio.lastUpdate}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
*/
