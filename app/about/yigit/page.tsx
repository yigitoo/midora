"use client";
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { founders } from "../page";

const inter = Inter({ subsets: ["latin"] });

const AboutPage: React.FC = () => {
  const founder = founders[1];
  return (
    <div className={`container mx-auto py-10 about-page ${inter.className}`}>
      <Card className="bg-card text-card-foreground">
        <CardHeader className="text-center">
          <CardTitle style={{ fontSize: "2rem" }}>{founder.name}</CardTitle>
        </CardHeader>
        <CardContent className="ml-10">
          <div className={`flex align-center about-page ${inter.className}`}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
              alignItems: 'center',
              width: '30vw',
              fontSize: '1.2rem',
            }}>
              <Image
                className="founder-image"
                style={{
                  border: "1px solid transparent",
                  borderRadius: "20%",
                }}
                src={founder.image}
                alt={founder.name}
                width={300}
                height={300}
              />
              <div style={{
                textAlign: 'justify',
                width: '25vw',
                fontSize: '1rem',
                paddingRight: '0rem',
                marginTop: '4rem',
              }}>
                Finans ve ekonomiye küçüklükten gelen
              hevesim ile birlikte ortağım ve okul arkadaşım Çağan Dönmez ile daha önce
              hiç deneyimlemediğimiz bu yola atılmak için kolları sıvadık.
              Bu süreçte, birçok farklı alanda bilgi birikimi
              edinme fırsatı buldum. Özellikle, finansal okuryazarlık ve yatırım
              konularında kendimi geliştirmek için çaba harcadım. Bu süreçte,
              kripto paralar, hisse senetleri ve yatırım fonları gibi farklı
              yatırım araçları hakkında bilgi sahibi oldum. Ayrıca, finansal
              okuryazarlık konusunda farkındalık yaratmak ve gençlerin,
              yaşlıların kısacası 7'den 70'e bu sektördeki herkesin bir şeyler
              öğrenmesine katkıda bulunmak ve forumlar üzerinde ekonomi, finans ve gündem üzerine münakaşa ederek
              istişare kültürünü geliştirmek istedik. Aynı zamanda üyelerimize
              finansal analiz noktasında hizmetler vererek yatırımlarını daha bilinç
              ve daha kazançlı nasıl yapabileceklerini göstermek istedik.
              Bu doğrultuda, ortağım ve ben "Midora" adlı bu platformu kurduk.
              Umarım beğenirsiniz :)
              </div>
            </div>
            <div
              className="mr-5"
              style={{ borderLeft: "1px solid #0362fc", height: "90vh" }}
            ></div>
            <div
              style={{
                textAlign: "justify",
                width: "30vw",
                fontSize: "1.2rem",
                paddingRight: "0rem",
              }}
              className="pt-5 pl-5"
            >
              <p style={{ textIndent: '2rem', marginBottom: '2rem'}}>
                Merhaba, ben Yiğit Gümüş. 18 yaşında ve Nazilli Fen Lisesi mezunu
              bir teknoloji tutkunu olarak, bugüne kadar çeşitli projelerde yer
              aldım ve farklı disiplinlerde önemli başarılara imza attım.
              Hayatımın merkezinde her zaman öğrenme, yenilik yaratma ve topluma
              fayda sağlama fikri oldu. Geçmişte, TEKNOFEST ve TÜBİTAK'ın hem
              coğrafya hem de yazılım alanlarındaki projelerinde aktif olarak
              yer aldım. Ayrıca, TEKNOFEST Doğal Dil İşleme Yarışması'na
              katıldım ve burada yapay zeka teknolojilerini insan odaklı
              uygulamalara dönüştürme fırsatı buldum.
              </p>
              <p style={{ textIndent: '2rem', marginBottom: '2rem'}}>
              Önemli bir diğer başarım,
              Türk Japon Vakfı Afet Risk Yarışması'nda ikinci olarak
              afet konusunda Türkiye adına buluşlar geliştirmem oldu.
              Bu proje, afet riskini azaltma konusundaki kararlılığımı ve
              sorumluluğumu bir kez daha gözler önüne serdi. Bunun yanı sıra,
              Ankara Bilim Üniversitesi'nin 3. Verimlilik Yarışması'nda
              birincilik elde ederek yenilikçi fikirlerimi
              sergileme fırsatı buldum. Tüm bu deneyimler, hayata fark katma
              isteğimi ve sürekli daha iyisini arama azmimi besledi.
              </p>
              <p style={{ textIndent: '2rem' }}>
              Bu noktada,
              geleceğe daha süredürülebilir bir yaşam bırakma amacıyla bu
              şirketi kurdum. Vizyonum, teknolojiyi insan hayatını iyileştiren,
              doğayla uyumlu ve daha yaşanabilir bir geleceğe hizmet eden
              çözümlere dönüştürmek. Yaratıcılık ve disiplinle dolu bu
              yolculukta, herkese ilham vermeyi ve topluma kalıcı değerler
              kazandırmayı hedefliyorum.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
