"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/services/AuthProvider";
import { Search, Loader2, MessageCircle } from "lucide-react";
import debounce from "lodash/debounce";

import type { Comment, ForumEntry, ForumResponse } from "@/types/forum";
import { useRouter } from "next/navigation";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ForumPage = () => {
  const [entries, setEntries] = useState<ForumEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const fetchEntries = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/forum?page=${page}&search=${encodeURIComponent(search)}`
      );
      if (!response.ok) throw new Error("Aradığınız göneriler bulunamadı.");

      const data: ForumResponse = await response.json();
      setEntries(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setCurrentPage(1);
    fetchEntries(1, value);
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    fetchEntries(currentPage, searchTerm);
  }, [currentPage]);

  if (error) {
    setTimeout(() => (window.location.href = "/forum"), 1500);
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-center text-3xl font-bold mb-6">Forum Ana Sayfası</h1>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Forum gönderilerinde ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {entries.map((entry) => (
              <li
                key={entry._id.toString()}
                className="border p-4 rounded-lg shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{entry.title}</h2>
                <p className="text-gray-700 mb-2 line-clamp-3">
                  {entry.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span
                      className="cursor-pointer"
                      onClick={() => window.open("/user/" + entry.author)}
                    >
                      <strong>Yazar: </strong>
                      {entry.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {entry.comments?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>
                      {formatDate(
                        new Date(entry.uploadTime).toLocaleDateString("tr-TR")
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/forum/entry/${entry._id}`)}
                    >
                      Detaylar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Önceki
            </Button>
            <span className="py-2 px-4">
              Sayfa {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Sonraki
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForumPage;
