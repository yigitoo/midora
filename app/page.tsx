"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../services/AuthProvider";
import { Loader2 } from "lucide-react";

import { URL_MAP } from '@/lib/urls'

export default function Home() {
  const { isLoggedIn } = useAuth();

  const router = useRouter();

  setTimeout(() => {
    if (isLoggedIn) {
      router.push(URL_MAP.forumPage);
    } else {
      router.push(URL_MAP.loginPage);
    }
  }, 1000);

  return (
    <>
      <div className="text-center font-bold text-2xl mt-20">
        Sayfa Yükleniyor...
        <Loader2 className="my-5 mx-auto h-24 w-24 animate-spin" />
      </div>
    </>
  );
}
