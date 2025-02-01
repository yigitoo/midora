"use client";
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { founders } from "../page";

const inter = Inter({ subsets: ["latin"] });

const AboutPage: React.FC = () => {
  const founder = founders[0];
  return (
    <div className={`container mx-auto py-10 about-page ${inter.className}`}>
      <Card className="bg-card text-card-foreground">
        <CardHeader className="text-center">
          <CardTitle style={{fontSize: '2rem'}}>{founder.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex align-center about-page ${inter.className}`}>
            <div className="flex justify-center mr-10">
              <Image className="founder-image"
                style={{
                  border: "1px solid transparent",
                  borderRadius: "20%",
                }}
                src={founder.image}
                alt={founder.name}
                width={300}
                height={300}
              />
            </div>
            <div style={{textAlign: 'justify', width: '30vw', fontSize: '1.2rem'}} className="pt-5">
              {founder.name}, {founder.education} mezunudur.
                BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA  BLA
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
