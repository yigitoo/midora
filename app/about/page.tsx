"use client";
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const inter = Inter({ subsets: ["latin"] });

const founders = [
  {
    name: "Kurucu 1",
    image: "/path/to/image1.jpg",
  },
  {
    name: "Kurucu 2",
    image: "/path/to/image2.jpg",
  },
  // Add more founders as needed
];

const FoundersSection: React.FC = () => {
  return (
    <div className="founders-section">
      {founders.map((founder, index) => (
        <div key={index} className="founder-card">
          <Image
            src={founder.image}
            alt={founder.name}
            width={150}
            height={150}
            className="founder-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/path/to/default-image.jpg";
            }}
          />
          <p>{founder.name}</p>
        </div>
      ))}
    </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <div className={`container mx-auto py-10 about-page ${inter.className}`}>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Hakkımızda</CardTitle>
          <CardDescription style={{ paddingTop: "10px", fontSize: "15px" }}>
            GÖLTÜRK Holding'e hoş geldiniz. Sektörümüzde lider bir şirketiz ve
            müşterilerimize en kaliteli hizmet ve ürünleri sunmaya kararlıyız.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`about-page ${inter.className}`}>
            <h1>GÖLTÜRK Holding Hakkında</h1>
            <p>
              GÖLTÜRK Holding'e hoş geldiniz. Sektörümüzde lider bir şirketiz ve
              müşterilerimize en kaliteli hizmet ve ürünleri sunmaya kararlıyız.
            </p>

            <div className="text-center">
              <h2>Kurucularımız</h2>
              <FoundersSection />
            </div>
            <h2>Misyonumuz</h2>
            <p>
              Misyonumuz, yenilikçi çözümler, yüksek kaliteli ürünler ve
              mükemmel müşteri hizmetleri ile müşterilerimize olağanüstü değer
              sunmaktır.
            </p>
            <h2>Vizyonumuz</h2>
            <p>
              Vizyonumuz, mükemmellik, sürdürülebilirlik ve sosyal sorumluluk
              konusundaki taahhüdümüzle tanınan, sektörümüzde küresel bir lider
              olmaktır.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
