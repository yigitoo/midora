"use client";
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin } from "lucide-react";
import { IMAGE_URL, URL_MAP } from "@/lib/urls";

const founders = [
  {
    name: "Çağan Dönmez",
    image: IMAGE_URL.caganUrl,
    education: "Nazilli Fen Lisesi'25",
    foundersPage: URL_MAP.founderCaganPage,
    hasGithub: false,
    linkedin:
      "https://www.linkedin.com/in/%C3%A7a%C4%9Fan-d%C3%B6nmez-4b7830347/",
    job: "Engineer - Midora CEO",
    technicalSkills: ["Satış ve Pazarlama", "Sosyal Medya", "Reklamcılık"],
    experiences: ["Takım Liderliği", "Midora CEO'su"],
    interests: [
      "Yapay Zeka ve Makine Öğrenmesi",
      "Borsa ve Para Piyasaları",
      "Finans ve Yatırım",
    ],
  },
  {
    name: "Yiğit GÜMÜŞ",
    image: IMAGE_URL.yigitUrl,
    education: "Nazilli Fen Lisesi'25",
    foundersPage: URL_MAP.founderYigitPage,
    hasGithub: true,
    github: "https://github.com/yigitoo",
    linkedin: "https://www.linkedin.com/in/-yigitgumus/",
    job: "Economist - Midora CTO",
    technicalSkills: [
      "Yatırım Departmanı",
      "Finansal Yönetim ve Risk Analizi",
    ],
    experiences: [
      "Mevcut iş tecrübesi",
      "Midora CTO'su",
      "Programlama Uzmanlığı",
    ],
    interests: [
      "Yapay Zeka ve Makine Öğrenmesi",
      "Finans ve Yatırım",
      "Programlama",
    ],
  },
];

export { founders };

const inter = Inter({ subsets: ["latin"] });

const FoundersSection: React.FC = () => {
  return (
    <div className="founders-section flex justify-center p-10">
      {founders.map((founder, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#0d0d0d",
            cursor: "pointer",
          }}
          className="founder-card"
          onClick={() => {
            window.location.href = founder.foundersPage;
          }}
        >
          <Image
            src={founder.image}
            alt={founder.name}
            style={{ cursor: "pointer" }}
            width={300}
            height={300}
            className="founder-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = URL_MAP.homePage;
            }}
          />
          <p className="pt-5 text-white">{founder.name}</p>
          <p className="pt-5 text-white">{founder.education}</p>
        </div>
      ))}
    </div>
  );
};

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const midoraX = "https://x.com/MidoraInvest";
  const midoraInstagram = "https://www.instagram.com/midoratr";
  const midoraYoutube = "https://www.youtube.com/midoratr";


  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={fadeIn.transition}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Midora Hakkında</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Finansal özgürlüğünüzü kazanmanıza yardımcı olmak için buradayız
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Misyonumuz</h2>
              <p className="text-muted-foreground">
                Kullanıcılarımıza finansal özgürlük yolunda rehberlik etmek ve
                yatırım konusunda bilinçli kararlar almalarına yardımcı olmak.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Vizyonumuz</h2>
              <p className="text-muted-foreground">
                Türkiye'nin en güvenilir ve kapsamlı yatırım platformu olarak
                kullanıcılarımızın finansal hedeflerine ulaşmalarını sağlamak.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Neler Sunuyoruz?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Portföy Yönetimi</h3>
              <p className="text-muted-foreground">
                Yatırımlarınızı tek bir yerden takip edin ve analiz edin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Forum Topluluğu</h3>
              <p className="text-muted-foreground">
                Deneyimli yatırımcılarla bilgi ve deneyim paylaşın.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Piyasa Analizi</h3>
              <p className="text-muted-foreground">
                Güncel piyasa verilerini ve analizleri inceleyin.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Founders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Kurucularımız</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((founder, index) => (
            <motion.div
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "inherit",
                borderRadius: "16px",
                backgroundColor: "linear-gradient(180deg,rgb(0, 89, 255) 5%, rgba(0, 0, 0, 0) 100%)",
                boxShadow: "10px 4px 30px rgba(0, 0, 0, 0.1)",
              }}
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="object-cover w-full h-[800px]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                    <p className="text-muted-foreground mb-4">{founder.job}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {founder.education}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Teknik Yetenekler
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {founder.technicalSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Deneyimler</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {founder.experiences.map((exp, i) => (
                            <li key={i}>{exp}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">İlgi Alanları</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {founder.interests.map((interest, i) => (
                            <li key={i}>{interest}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <a
                          style={founder.hasGithub ? {} : { display: "none" }}
                          href={founder.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <header>
          <h2 className="text-3xl font-bold mb-8">İletişime Geçin</h2>
        </header>
        <div className="flex justify-center space-x-4">
          <Button style={{background: '#fff'}} variant="outline" size="icon">
            <Mail
              style={{ color: "#000", background: "#fff" }}
              className="h-4 w-4"
            />
          </Button>
          <Button onClick={() => window.open(midoraX)} style={{
            backgroundColor: "#fff",
          }} variant="outline" size="icon">
            <svg
              className="h-4 w-4"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>X</title>
              <image href="/images/x.svg" width="24" height="24" />
            </svg>
          </Button>
          <Button onClick={() => window.open(midoraInstagram)} style={{background: '#fff'}} variant="outline" size="icon">
            <svg
              className="h-4 w-4"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Instagram</title>

              <image href="/images/instagram.svg" width="24" height="24" />
            </svg>
          </Button>
          <Button variant="outline" style={{ background: "#fff" }} size="icon">

            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
