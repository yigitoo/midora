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
    github: 'https://github.com/yigitoo',
    linkedin: 'https://www.linkedin.com/in/%C3%A7a%C4%9Fan-d%C3%B6nmez-4b7830347/',
    job: 'Engineer - Midora CEO',
    technicalSkills: ['Satış ve Pazarlama', 'Sosyal Medya', 'Reklamcılık'],
    experiences: ['Takım Liderliği', 'Midora CEO\'su'],
    interests: ['Yapay Zeka ve Makine Öğrenmesi', 'Borsa ve Para Piyasaları', 'Finans ve Yatırım']
  },
  {
    name: "Yiğit GÜMÜŞ",
    image: "/images/yigit_gumus.jpg",
    education: "Nazilli Fen Lisesi'25",
    foundersPage: "/about/yigit",
    github: 'https://github.com/yigitoo',
    linkedin: 'https://www.linkedin.com/in/-yigitgumus/',
    job: 'Economist - Midora CTO',
    technicalSkills: ['Programlama', 'Yatırım', 'Finans', 'Derin Öğrenme ve Doğal Dil İşleme Modelleri'],
    experiences: ['Mevcut iş tecrübesi', 'Midora CTO\'su', 'Programlama Uzmanlığı'],
    interests: ['Yapay Zeka ve Makine Öğrenmesi', 'Finans ve Yatırım', 'Programlama']
  }
]

export { founders };

const inter = Inter({ subsets: ["latin"] });

const FoundersSection: React.FC = () => {
  return (
    <div className="founders-section flex justify-center p-10">
      {founders.map((founder, index) => (
        <div key={index} style={{
          backgroundColor: '#0d0d0d',
          cursor: 'pointer',
        }} className="founder-card"
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
            <p className="pt-5 text-white">{founder.name}</p>
            <p className="pt-5 text-white">{founder.education}</p>
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
