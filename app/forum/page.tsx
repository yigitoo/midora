import React from 'react';

interface ForumEntry {
  id: number;
  title: string;
  content: string;
  author: string;
  uploadTime: Date;
}

const mockEntries: ForumEntry[] = [
  {
    id: 1,
    title: 'İlk Gönderi',
    content: 'Bu ilk gönderinin içeriği.',
    author: 'User1',
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    id: 2,
    title: 'İkinci Gönderi',
    content: 'Bu ikinci gönderinin içeriği.',
    author: 'User2',
    uploadTime: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  },
  { id: 3, title: 'Third Entry', content: 'This is the third entry content.', author: 'User3', uploadTime: new Date() },
  { id: 4, title: 'Fourth Entry', content: 'This is the fourth entry content.', author: 'User4', uploadTime: new Date() },
  { id: 5, title: 'Fifth Entry', content: 'This is the fifth entry content.', author: 'User5', uploadTime: new Date() },
  { id: 6, title: 'Sixth Entry', content: 'This is the sixth entry content.', author: 'User6', uploadTime: new Date() },
  { id: 7, title: 'Seventh Entry', content: 'This is the seventh entry content.', author: 'User7', uploadTime: new Date() },
  { id: 8, title: 'Eighth Entry', content: 'This is the eighth entry content.', author: 'User8', uploadTime: new Date() },
  { id: 9, title: 'Ninth Entry', content: 'This is the ninth entry content.', author: 'User9', uploadTime: new Date() },
  { id: 10, title: 'Tenth Entry', content: 'This is the tenth entry content.', author: 'User10', uploadTime: new Date() },
];

const formatDate = (date: Date): string => {
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ForumPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Forum Ana Sayfası</h1>
      <ul className="space-y-4">
        {mockEntries.map(entry => (
          <li key={entry.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{entry.title}</h2>
            <p className="text-gray-700 mb-2">{entry.content}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <p><strong>Yazar:</strong> {entry.author}</p>
              <p><strong>Yükleme Tarihi:</strong> {formatDate(entry.uploadTime)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumPage;
