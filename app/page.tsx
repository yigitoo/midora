"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./services/AuthProvider";
import { Loader2 } from "lucide-react";
export default function Home() {
  const { isLoggedIn } = useAuth();

  const router = useRouter();

  setTimeout(() => {
    if (isLoggedIn) {
      router.push("/forum");
    } else {
      router.push("/login");
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
