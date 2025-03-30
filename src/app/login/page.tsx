"use client";

import React, { useState } from 'react';
import { loginUser } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// デモユーザー情報
const demoUsers = [
  { email: 'user1@example.com', password: 'pass1111' },
  { email: 'user2@example.com', password: 'pass2222' },
  { email: 'user3@example.com', password: 'pass3333' }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect') || 'list';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(email, password);
      router.push(`/${redirect}`);
    } catch (error: any) {
      setError('ログインに失敗しました: ' + error.message);
    }
  };

  const loginAsDemo = async (user: { email: string; password: string }) => {
    setEmail(user.email);
    setPassword(user.password);
    
    try {
      await loginUser(user.email, user.password);
      router.push(`/${redirect}`);
    } catch (error: any) {
      setError('デモユーザーでのログインに失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fdfcfb] to-[#e8dfd6] flex flex-col items-center">
  <header className="w-full bg-slate-500 py-2 relative flex items-center shadow-md">
    <h1 className="text-sm text-white pl-4">どこに応募したのかすぐに分かる就職活動管理APP</h1>
  </header>

  <main className="flex flex-col items-center justify-center w-full">
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center mt-16 w-full">
      <h2 className="text-xl font-normal mb-4 text-gray-800">ログイン</h2>
          
          {error && <p className="text-red-400 mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-left">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-left">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              ログイン
            </button>
          </form>
          
          {/* デモユーザーセクション */}
          <div className="border-t pt-6">
            <h3 className="text-lg text-gray-600 font-medium mb-4">デモユーザーでログイン</h3>
            <p className="text-sm text-gray-600 mb-4">
              ポートフォリオ閲覧用に、以下のデモユーザーをご利用いただけます。サンプルデータ入力済：
            </p>
            
            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <div key={index} className="border p-3 rounded hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between mb-2">
                    <span className="font-medium text-gray-500">{user.email}</span>
                    <span className="text-gray-500 text-sm">パスワード: {user.password}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => loginAsDemo(user)}
                      className="ml-2 text-sm bg-blue-400 text-white px-3 py-1 rounded"
                    >
                      このユーザーでログイン
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Link href="/" className="mt-4 text-blue-500 hover:underline">
          トップに戻る
        </Link>
      </main>
    </div>
  );
}