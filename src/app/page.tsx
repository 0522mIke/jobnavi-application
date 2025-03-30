"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // 実際のパスに合わせて調整
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態を監視する
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    
    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fdfcfb] to-[#e8dfd6] flex flex-col items-center">
        <header className="w-full bg-slate-500 py-1 px-4 flex flex-wrap items-center justify-between shadow-md">
          <h1 className="text-sm text-white pl-4">どこに応募したのかすぐに分かる就職管理APP</h1>
          
          {/* ユーザー情報とログアウトボタン */}
          {auth.currentUser && (
            <div className="flex items-center space-x-4 pb-1 pt-0">
                        <span className="text-sm text-white truncate max-w-[150px]">{auth.currentUser.email}</span>
              <Link href="/logout" className="text-sm bg-slate-500 hover:bg-slate-600 text-white px-3 py-1 rounded">
                ログアウト
              </Link>
            </div>
          )}
        </header>

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center">
        {/* 白背景の枠 */}
        <div className="bg-white p-20 rounded-xl shadow-lg w-[90%] max-w-3xl text-center mt-16">
          <h2 className="text-4xl font-semibold text-gray-800">就活管理アプリ</h2>
          <p className="mt-10 text-gray-600 text-sm">
            ポートフォリオ用プロジェクトNo.3。求職中の方にオススメ!
            企業の求人情報や応募状況を登録して、就職活動の進捗を一元管理します。
          </p>

          {/* ボタン */}
          <div className="mt-10 flex flex-col space-y-4">
            {isLoggedIn ? (
              // ログイン済みの場合は直接各ページへのリンク
              <>
                <Link href="/register">
                  <button className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium px-6 py-3 rounded-full shadow-md w-full">
                    気になる企業・求人情報を登録
                  </button>
                </Link>
                
                <Link href="/list">
                  <button className="bg-blue-200 text-blue-700 hover:bg-blue-300 font-medium px-6 py-3 rounded-full shadow-md w-full">
                    就活状況をチェック
                  </button>
                </Link>
              </>
            ) : (
              // 未ログインの場合はログインページへリダイレクト
              <>
                <Link href="/login?redirect=register">
                  <button className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium px-6 py-3 rounded-full shadow-md w-full">
                    気になる企業・求人情報を登録
                  </button>
                </Link>
                
                <Link href="/login?redirect=list">
                  <button className="bg-blue-200 text-blue-700 hover:bg-blue-300 font-medium px-6 py-3 rounded-full shadow-md w-full">
                    就活状況をチェック
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}