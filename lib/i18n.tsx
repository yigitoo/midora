"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "tr"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.markets": "Markets",
    "nav.screener": "Screener",
    "nav.watchlist": "Watchlist",
    "nav.portfolio": "Portfolio",
    "nav.forum": "Forum",
    "nav.news": "News",
    "nav.about": "About",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.signout": "Sign Out",

    // Common
    "common.loading": "Loading...",
    "common.search": "Search",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.close": "Close",
    "common.open": "Open",
    "common.view": "View",
    "common.add": "Add",
    "common.remove": "Remove",
    "common.update": "Update",
    "common.refresh": "Refresh",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.export": "Export",
    "common.import": "Import",
    "common.share": "Share",
    "common.copy": "Copy",
    "common.download": "Download",
    "common.upload": "Upload",
    "common.success": "Success",
    "common.error": "Error",
    "common.warning": "Warning",
    "common.info": "Information",

    // Hero Section
    "hero.title": "Midora",
    "hero.subtitle": "Advanced Market Analysis",
    "hero.description":
      "Professional-grade financial analysis platform with real-time data from NYSE, NASDAQ, and BIST. Make informed investment decisions with our comprehensive tools and community insights.",
    "hero.cta.start": "Start Trading",
    "hero.cta.explore": "Explore Markets",
    "hero.badge": "🚀 Professional Trading Platform",

    // Features
    "features.title": "Everything You Need for Smart Trading",
    "features.subtitle":
      "Comprehensive tools and features designed to give you the edge in today's fast-moving markets",
    "features.realtime.title": "Real-time Market Data",
    "features.realtime.desc": "Live quotes, charts, and market movements from NYSE, NASDAQ, and BIST exchanges",
    "features.screener.title": "Advanced Screener",
    "features.screener.desc": "Filter stocks by technical indicators, fundamentals, and custom criteria",
    "features.alerts.title": "Smart Alerts",
    "features.alerts.desc": "Get notified about price movements, news, and trading opportunities",
    "features.portfolio.title": "Portfolio Tracking",
    "features.portfolio.desc": "Monitor your investments with detailed performance analytics",
    "features.community.title": "Community Forum",
    "features.community.desc": "Share insights and learn from experienced traders and investors",
    "features.security.title": "Secure Platform",
    "features.security.desc": "Bank-level security with encrypted data and secure authentication",

    // Markets
    "markets.title": "Global Markets",
    "markets.subtitle": "Real-time data from NYSE, NASDAQ, and BIST exchanges",
    "markets.search.placeholder": "Search stocks...",
    "markets.update.bist": "Update BIST Data",
    "markets.updating": "Updating...",
    "markets.companies": "Listed Companies",
    "markets.tech.companies": "Tech Companies",
    "markets.turkish.companies": "Turkish Companies",
    "markets.symbol": "Symbol",
    "markets.company": "Company",
    "markets.price": "Price",
    "markets.change": "Change",
    "markets.market.cap": "Market Cap",
    "markets.volume": "Volume",
    "markets.pe.ratio": "P/E",
    "markets.dividend": "Dividend",
    "markets.action": "Action",

    // Forum
    "forum.title": "Midora Forum",
    "forum.subtitle": "Connect with fellow investors and share market insights",
    "forum.new.post": "New Post",
    "forum.categories": "Categories",
    "forum.stats": "Forum Stats",
    "forum.total.posts": "Total Posts",
    "forum.active.users": "Active Users",
    "forum.todays.posts": "Today's Posts",
    "forum.search.placeholder": "Search discussions...",
    "forum.recent": "Recent",
    "forum.trending": "Trending",
    "forum.unanswered": "Unanswered",
    "forum.replies": "replies",
    "forum.likes": "likes",
    "forum.post.title.placeholder": "Enter post title...",
    "forum.post.content.placeholder": "Write your post content...",
    "forum.select.category": "Select Category",
    "forum.create.post": "Create Post",
    "forum.cancel": "Cancel",

    // News
    "news.title": "Financial News",
    "news.subtitle": "Stay updated with the latest market news and analysis",
    "news.search.placeholder": "Search news...",
    "news.general": "General",
    "news.stocks": "Stocks",
    "news.crypto": "Crypto",
    "news.economy": "Economy",
    "news.turkey": "Turkey",
    "news.read.more": "Read More",
    "news.no.articles": "No articles found",
    "news.try.adjusting": "Try adjusting your search or category selection",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.subtitle": "Here's your portfolio overview and market insights",
    "dashboard.add.watchlist": "Add to Watchlist",
    "dashboard.portfolio.value": "Portfolio Value",
    "dashboard.days.gain": "Day's Gain/Loss",
    "dashboard.total.positions": "Total Positions",
    "dashboard.watchlist.items": "Watchlist Items",
    "dashboard.recent.activity": "Recent Activity",
    "dashboard.latest.trades": "Your latest trades and portfolio changes",
    "dashboard.market.alerts": "Market Alerts",
    "dashboard.quick.actions": "Quick Actions",
    "dashboard.browse.markets": "Browse Markets",
    "dashboard.stock.screener": "Stock Screener",
    "dashboard.community.forum": "Community Forum",

    // Auth
    "auth.welcome.back": "Welcome Back",
    "auth.signin.subtitle": "Sign in to your Midora account to access your portfolio and watchlists",
    "auth.create.account": "Create Account",
    "auth.signup.subtitle": "Join Midora to start tracking your investments and analyzing markets",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm.password": "Confirm Password",
    "auth.full.name": "Full Name",
    "auth.forgot.password": "Forgot password?",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.signing.in": "Signing in...",
    "auth.creating.account": "Creating account...",
    "auth.no.account": "Don't have an account?",
    "auth.have.account": "Already have an account?",
    "auth.back.home": "Back to Home",
    "auth.check.email": "Check Your Email",
    "auth.confirmation.sent": "We've sent you a confirmation link at",
    "auth.click.link": "Click the link in the email to verify your account and complete your registration.",
    "auth.back.signin": "Back to Sign In",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account preferences and application settings",
    "settings.profile": "Profile Settings",
    "settings.appearance": "Appearance",
    "settings.notifications": "Notifications",
    "settings.privacy": "Privacy & Security",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",
    "settings.english": "English",
    "settings.turkish": "Turkish",
    "settings.save.changes": "Save Changes",
    "settings.changes.saved": "Changes saved successfully",

    // Profile
    "profile.title": "Profile",
    "profile.edit": "Edit Profile",
    "profile.view.public": "View Public Profile",
    "profile.member.since": "Member since",
    "profile.posts": "Posts",
    "profile.followers": "Followers",
    "profile.following": "Following",
    "profile.bio": "Bio",
    "profile.location": "Location",
    "profile.website": "Website",
    "profile.twitter": "Twitter",
    "profile.linkedin": "LinkedIn",
    "profile.update.success": "Profile updated successfully",

    // Watchlist
    "watchlist.title": "My Watchlist",
    "watchlist.subtitle": "Track your favorite stocks and monitor their performance",
    "watchlist.add.stock": "Add Stock",
    "watchlist.remove.stock": "Remove from Watchlist",
    "watchlist.empty": "Your watchlist is empty",
    "watchlist.add.first": "Add your first stock to start tracking",
    "watchlist.total.value": "Total Value",
    "watchlist.total.change": "Total Change",
    "watchlist.last.updated": "Last Updated",
  },
  tr: {
    // Navigation
    "nav.home": "Ana Sayfa",
    "nav.dashboard": "Kontrol Paneli",
    "nav.markets": "Piyasalar",
    "nav.screener": "Tarayıcı",
    "nav.watchlist": "İzleme Listesi",
    "nav.portfolio": "Portföy",
    "nav.forum": "Forum",
    "nav.news": "Haberler",
    "nav.about": "Hakkında",
    "nav.settings": "Ayarlar",
    "nav.profile": "Profil",
    "nav.signin": "Giriş Yap",
    "nav.signup": "Kayıt Ol",
    "nav.signout": "Çıkış Yap",

    // Common
    "common.loading": "Yükleniyor...",
    "common.search": "Ara",
    "common.save": "Kaydet",
    "common.cancel": "İptal",
    "common.edit": "Düzenle",
    "common.delete": "Sil",
    "common.submit": "Gönder",
    "common.back": "Geri",
    "common.next": "İleri",
    "common.previous": "Önceki",
    "common.close": "Kapat",
    "common.open": "Aç",
    "common.view": "Görüntüle",
    "common.add": "Ekle",
    "common.remove": "Kaldır",
    "common.update": "Güncelle",
    "common.refresh": "Yenile",
    "common.filter": "Filtrele",
    "common.sort": "Sırala",
    "common.export": "Dışa Aktar",
    "common.import": "İçe Aktar",
    "common.share": "Paylaş",
    "common.copy": "Kopyala",
    "common.download": "İndir",
    "common.upload": "Yükle",
    "common.success": "Başarılı",
    "common.error": "Hata",
    "common.warning": "Uyarı",
    "common.info": "Bilgi",

    // Hero Section
    "hero.title": "Midora",
    "hero.subtitle": "Gelişmiş Piyasa Analizi",
    "hero.description":
      "NYSE, NASDAQ ve BIST'ten gerçek zamanlı verilerle profesyonel finansal analiz platformu. Kapsamlı araçlarımız ve topluluk içgörüleriyle bilinçli yatırım kararları alın.",
    "hero.cta.start": "İşleme Başla",
    "hero.cta.explore": "Piyasaları Keşfet",
    "hero.badge": "🚀 Profesyonel İşlem Platformu",

    // Features
    "features.title": "Akıllı İşlem İçin İhtiyacınız Olan Her Şey",
    "features.subtitle": "Günümüzün hızla değişen piyasalarında size avantaj sağlayacak kapsamlı araçlar ve özellikler",
    "features.realtime.title": "Gerçek Zamanlı Piyasa Verisi",
    "features.realtime.desc": "NYSE, NASDAQ ve BIST borsalarından canlı fiyatlar, grafikler ve piyasa hareketleri",
    "features.screener.title": "Gelişmiş Tarayıcı",
    "features.screener.desc": "Teknik göstergeler, temel analiz ve özel kriterlerle hisse senetlerini filtreleyin",
    "features.alerts.title": "Akıllı Uyarılar",
    "features.alerts.desc": "Fiyat hareketleri, haberler ve işlem fırsatları hakkında bildirim alın",
    "features.portfolio.title": "Portföy Takibi",
    "features.portfolio.desc": "Detaylı performans analitiği ile yatırımlarınızı izleyin",
    "features.community.title": "Topluluk Forumu",
    "features.community.desc": "Deneyimli tüccarlar ve yatırımcılarla içgörü paylaşın ve öğrenin",
    "features.security.title": "Güvenli Platform",
    "features.security.desc": "Şifrelenmiş veri ve güvenli kimlik doğrulama ile banka düzeyinde güvenlik",

    // Markets
    "markets.title": "Küresel Piyasalar",
    "markets.subtitle": "NYSE, NASDAQ ve BIST borsalarından gerçek zamanlı veriler",
    "markets.search.placeholder": "Hisse senedi ara...",
    "markets.update.bist": "BIST Verilerini Güncelle",
    "markets.updating": "Güncelleniyor...",
    "markets.companies": "Kayıtlı Şirketler",
    "markets.tech.companies": "Teknoloji Şirketleri",
    "markets.turkish.companies": "Türk Şirketleri",
    "markets.symbol": "Sembol",
    "markets.company": "Şirket",
    "markets.price": "Fiyat",
    "markets.change": "Değişim",
    "markets.market.cap": "Piyasa Değeri",
    "markets.volume": "Hacim",
    "markets.pe.ratio": "F/K",
    "markets.dividend": "Temettü",
    "markets.action": "İşlem",

    // Forum
    "forum.title": "Midora Forum",
    "forum.subtitle": "Yatırımcı arkadaşlarınızla bağlantı kurun ve piyasa içgörülerini paylaşın",
    "forum.new.post": "Yeni Gönderi",
    "forum.categories": "Kategoriler",
    "forum.stats": "Forum İstatistikleri",
    "forum.total.posts": "Toplam Gönderi",
    "forum.active.users": "Aktif Kullanıcılar",
    "forum.todays.posts": "Bugünkü Gönderiler",
    "forum.search.placeholder": "Tartışmalarda ara...",
    "forum.recent": "Son Gönderiler",
    "forum.trending": "Trend Olanlar",
    "forum.unanswered": "Cevaplanmamış",
    "forum.replies": "yanıt",
    "forum.likes": "beğeni",
    "forum.post.title.placeholder": "Gönderi başlığını girin...",
    "forum.post.content.placeholder": "Gönderi içeriğinizi yazın...",
    "forum.select.category": "Kategori Seç",
    "forum.create.post": "Gönderi Oluştur",
    "forum.cancel": "İptal",

    // News
    "news.title": "Finansal Haberler",
    "news.subtitle": "En son piyasa haberleri ve analizleriyle güncel kalın",
    "news.search.placeholder": "Haberlerde ara...",
    "news.general": "Genel",
    "news.stocks": "Hisse Senetleri",
    "news.crypto": "Kripto",
    "news.economy": "Ekonomi",
    "news.turkey": "Türkiye",
    "news.read.more": "Devamını Oku",
    "news.no.articles": "Makale bulunamadı",
    "news.try.adjusting": "Arama veya kategori seçiminizi ayarlamayı deneyin",

    // Dashboard
    "dashboard.welcome": "Tekrar hoş geldiniz",
    "dashboard.subtitle": "İşte portföy özetiniz ve piyasa içgörüleriniz",
    "dashboard.add.watchlist": "İzleme Listesine Ekle",
    "dashboard.portfolio.value": "Portföy Değeri",
    "dashboard.days.gain": "Günlük Kazanç/Kayıp",
    "dashboard.total.positions": "Toplam Pozisyonlar",
    "dashboard.watchlist.items": "İzleme Listesi Öğeleri",
    "dashboard.recent.activity": "Son Aktiviteler",
    "dashboard.latest.trades": "En son işlemleriniz ve portföy değişiklikleriniz",
    "dashboard.market.alerts": "Piyasa Uyarıları",
    "dashboard.quick.actions": "Hızlı İşlemler",
    "dashboard.browse.markets": "Piyasalara Göz At",
    "dashboard.stock.screener": "Hisse Senedi Tarayıcısı",
    "dashboard.community.forum": "Topluluk Forumu",

    // Auth
    "auth.welcome.back": "Tekrar Hoş Geldiniz",
    "auth.signin.subtitle": "Portföyünüze ve izleme listelerinize erişmek için Midora hesabınıza giriş yapın",
    "auth.create.account": "Hesap Oluştur",
    "auth.signup.subtitle": "Yatırımlarınızı takip etmeye ve piyasaları analiz etmeye başlamak için Midora'ya katılın",
    "auth.email": "E-posta",
    "auth.password": "Şifre",
    "auth.confirm.password": "Şifreyi Onayla",
    "auth.full.name": "Ad Soyad",
    "auth.forgot.password": "Şifrenizi mi unuttunuz?",
    "auth.signin": "Giriş Yap",
    "auth.signup": "Kayıt Ol",
    "auth.signing.in": "Giriş yapılıyor...",
    "auth.creating.account": "Hesap oluşturuluyor...",
    "auth.no.account": "Hesabınız yok mu?",
    "auth.have.account": "Zaten hesabınız var mı?",
    "auth.back.home": "Ana Sayfaya Dön",
    "auth.check.email": "E-postanızı Kontrol Edin",
    "auth.confirmation.sent": "Size şu adrese onay bağlantısı gönderdik",
    "auth.click.link": "Hesabınızı doğrulamak ve kaydınızı tamamlamak için e-postadaki bağlantıya tıklayın.",
    "auth.back.signin": "Giriş Sayfasına Dön",

    // Settings
    "settings.title": "Ayarlar",
    "settings.subtitle": "Hesap tercihlerinizi ve uygulama ayarlarınızı yönetin",
    "settings.profile": "Profil Ayarları",
    "settings.appearance": "Görünüm",
    "settings.notifications": "Bildirimler",
    "settings.privacy": "Gizlilik ve Güvenlik",
    "settings.language": "Dil",
    "settings.theme": "Tema",
    "settings.light": "Açık",
    "settings.dark": "Koyu",
    "settings.system": "Sistem",
    "settings.english": "İngilizce",
    "settings.turkish": "Türkçe",
    "settings.save.changes": "Değişiklikleri Kaydet",
    "settings.changes.saved": "Değişiklikler başarıyla kaydedildi",

    // Profile
    "profile.title": "Profil",
    "profile.edit": "Profili Düzenle",
    "profile.view.public": "Herkese Açık Profili Görüntüle",
    "profile.member.since": "Üyelik tarihi",
    "profile.posts": "Gönderiler",
    "profile.followers": "Takipçiler",
    "profile.following": "Takip Edilenler",
    "profile.bio": "Biyografi",
    "profile.location": "Konum",
    "profile.website": "Web Sitesi",
    "profile.twitter": "Twitter",
    "profile.linkedin": "LinkedIn",
    "profile.update.success": "Profil başarıyla güncellendi",

    // Watchlist
    "watchlist.title": "İzleme Listem",
    "watchlist.subtitle": "Favori hisse senetlerinizi takip edin ve performanslarını izleyin",
    "watchlist.add.stock": "Hisse Senedi Ekle",
    "watchlist.remove.stock": "İzleme Listesinden Kaldır",
    "watchlist.empty": "İzleme listeniz boş",
    "watchlist.add.first": "Takip etmeye başlamak için ilk hisse senedinizi ekleyin",
    "watchlist.total.value": "Toplam Değer",
    "watchlist.total.change": "Toplam Değişim",
    "watchlist.last.updated": "Son Güncelleme",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("midora-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("midora-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
