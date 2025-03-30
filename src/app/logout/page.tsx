"use client";

import React, { useEffect, useState } from 'react';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Logout() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const _router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser();
        setIsLoggedOut(true);
      } catch (error) {
        console.error('ログアウトエラー:', error);
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fdfcfb] to-[#e8dfd6] flex flex-col items-center">
        <header className="w-full bg-slate-500  py-2 relative flex items-center shadow-md">
          <h1 className="text-sm text-white pl-4">どこに応募したのかすぐに分かる就職管理APP</h1>
         </header>

      <main className="flex flex-col items-center justify-center w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center mt-16 w-full">
          <h2 className="text-xl font-normal mb-6 text-gray-800">ログアウト</h2>
          
          <p className="mb-6 text-gray-600">
            {isLoggedOut 
              ? "ログアウトしました。" 
              : "ログアウト処理中..."}
          </p>
          
          <Link href="/login" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 inline-block">
            ログインページへ戻る
          </Link>
        </div>
        
        <Link href="/" className="mt-4 text-blue-500 hover:underline">
          トップに戻る
        </Link>
      </main>
    </div>
  );
}