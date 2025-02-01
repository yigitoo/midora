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

const founders = [
  {
    name: "Çağan Dönmez",
    image: "/images/cagan_donmez.jpg",
    education: "Nazilli Fen Lisesi'25",
    foundersPage: "/about/cagan",
  },
  {
    name: "Yiğit GÜMÜŞ",
    image: "/images/yigit_gumus.jpg",
    education: "Nazilli Fen Lisesi'25",
    foundersPage: "/about/yigit",
  }
]

export { founders };

const inter = Inter({ subsets: ["latin"] });

const FoundersSection: React.FC = () => {
  return (
    <div className="founders-section flex justify-center p-10">
      {founders.map((founder, index) => (
        <div key={index} className="founder-card"
        style={{cursor: 'pointer'}}
        onClick={() => {
          window.location.href = founder.foundersPage;
        }}>
          <Image
              src={founder.image}
              alt={founder.name}
              style={{cursor: 'pointer'}}
              width={300}
              height={300}
              className="founder-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/";
              }}
            />
            <p className="pt-5 text-black">{founder.name}</p>
            <p className="pt-5" style={{color: 'grey'}}>{founder.education}</p>
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

            <div className="text-center font-bold">
              <h2 className="pt-10">Kurucularımız</h2>
              <FoundersSection />
            </div>
            <div className="p-5">
              <h2 className="text-center font-bold p-5">Misyonumuz</h2>
              <Label className="text-center">
                Misyonumuz, yenilikçi çözümler, yüksek kaliteli ürünler ve
                mükemmel müşteri hizmetleri ile müşterilerimize olağanüstü değer
                sunmaktır.
              </Label>
            </div>
            <div className="p-5">
              <h2 className="text-center font-bold p-5">Vizyonumuz</h2>
              <Label className="text-center">
                Vizyonumuz, mükemmellik, sürdürülebilirlik ve sosyal sorumluluk
                konusundaki taahhüdümüzle tanınan, sektörümüzde küresel bir
                lider olmaktır.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
