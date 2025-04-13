"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import Link from "next/link";
import Header from '@/app/components/header';
import FAQ from './components/faq';
import Image from "next/image";

export default function HomeClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const animSections = document.querySelectorAll('.anim-section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      animSections.forEach(section => observer.observe(section));
      return () => observer.disconnect();
    }
  }, [loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header variant={isLoggedIn ? "full" : "compact"} />
      <main className="flex flex-col items-center justify-center w-full">
     
       {/* ヒーローセクション */}
       <div className="w-full py-12 md:py-20 bg-gradient-to-b from-white via-[#fffff] to-[#eafcf6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="w-full md:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-8">
              求職中の方にオススメ!
              </h1>
              <p className="text-lg text-gray-900 mb-8">
              ポートフォリオ用プロジェクトNo.3。
              企業の求人情報や応募状況を登録して、就職活動の進捗を一元管理します。
              </p>
              
            {/* ボタン */}
            <div className="mt-8 flex flex-col space-y-4">
              {isLoggedIn ? (
                // ログイン済みの場合は直接各ページへのリンク
                <>
                  <Link href="/register">
                  <button className="bg-[#f6a623] text-white hover:bg-[#e6951f] font-semibold px-6 py-3 rounded-full shadow-md w-full transition duration-300">
                      気になる企業・求人情報を登録
                    </button>
                  </Link>
                  
                  <Link href="/list">
                  <button className="bg-white text-[#f6a623] border border-[#f6a623] hover:bg-[#fff7ec] font-semibold px-6 py-3 rounded-full shadow-md w-full transition duration-300">
                      就活状況をチェック
                    </button>
                  </Link>
                </>
              ) : (
                // 未ログインの場合はログインページへリダイレクト
                <>
                  <Link href="/login?redirect=register">
                  <button className="bg-[#f6a623] text-white hover:bg-[#e6951f] font-semibold px-6 py-3 rounded-full shadow-md w-full transition duration-300">
                      気になる企業・求人情報を登録
                    </button>
                  </Link>
                  
                  <Link href="/login?redirect=list">
                  <button className="bg-white text-[#f6a623] border border-[#f6a623] hover:bg-[#fff7ec] font-semibold px-6 py-3 rounded-full shadow-md w-full transition duration-300">
                      就活状況をチェック
                    </button>
                  </Link>
                </>
              )}
            </div>
           </div>
            
        <div 
          className="w-full md:w-1/2 rounded-lg" 
          style={{
            backgroundImage: "url('/images/hederpic.png')",
            backgroundSize: 'contain', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent',
            height: '400px'
          }}
        ></div>
          </div>
        </div>
  
        {/* コンセプトセクション */}
        <div className="w-full py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-9">CONCEPT</h2>
            <p className="text-lg text-gray-800">
              ”SyukatuTRACK - 就活の全てを、一つの場所で”
              企業の求人情報や応募状況を登録して、就職活動の進捗を一元管理!面接日程から選考フェーズまで、あなたの就活プロセス全体を可視化。
            </p>
          </div>
        </div>
  
        {/* 画像と文章のセクション */}
        <div className="w-full py-16 bg-[#eafcf6] anim-section anim-from-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
            
          <div className="w-full md:w-1/2 order-1 md:order-2">
              <Image
                src="/images/688.jpeg"
                alt="機能1"
                width={500}
                height={300}
                className="w-4/5 h-auto rounded-lg shadow-lg"
              />
            </div>
            
            <div className="w-full md:w-1/2 space-y-4 order-2 md:order-1">
            <h2 className="text-3xl mb-7 font-bold text-[#2589d0] inline-block px-4 py-2 border-2 border-[#2589d0] shadow-[5px_5px_0px_#2589d0]">POINT1</h2>
              <p className="text-lg text-gray-800">
              リアルタイムデータ取得で企業情報や求人データを常に最新の状態に保ちます。登録した企業の募集要項変更や締切情報も削除や編集が可能なので、必要な企業情報だけを取捨選択して、就活を効率化。
              </p>
            </div>
          </div>
        </div>
  
        {/* 画像と文章のセクション2 */}
        <div className="w-full py-16 bg-white anim-section anim-from-right">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
            
          <div className="w-full md:w-1/2">
              <Image
                src="/images/1183.png"
                alt="機能2"
                width={500}
                height={300}
                className="w-4/5 h-auto rounded-lg shadow-lg"
              />
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-3xl mb-7 font-bold text-[#2589d0] inline-block px-4 py-2 border-2 border-[#2589d0] shadow-[5px_5px_0px_#2589d0]">POINT2</h2>
              <p className="text-lg text-gray-800">
              職種や選考段階などの条件でデータを並べ替え可能。自分だけの就活リストを作成できます。また、応募状況や応募日付の視覚化で迷いなく次のステップに集中できます。
              </p>
            </div>
          </div>
        </div>
  
        {/* アイコンセクション */}
        <div className="w-full py-16 bg-[#FFFAFA] anim-section anim-from-bottom">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">サービスの特徴</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-[#078080] text-white rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v3m0 0v3m0-3h3m-3 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">一元管理</h3>
              <p className="text-gray-800 mb-4">企業情報や応募状況をクラウド上で一元管理。いつでもどこでもアクセスでき、就活状況を把握できます。</p>
            </div>
              
                <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-[#078080] text-white rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">圧倒的なスピード</h3>
                <p className="text-gray-800 mb-4">高速処理技術により、従来の何倍ものスピードでタスクを完了します。時間は最も貴重な資産です。</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-[#078080] text-white rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">強固なセキュリティ</h3>
                <p className="text-gray-800 mb-4">最高レベルの暗号化とセキュリティ対策で、データを常に安全に保護します。</p>
              </div>
              
            </div>
          </div>
        </div>

        <FAQ />
                    
        {/* リンクボタンセクション */}
        <div className="w-full py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">就活を始めましょう</h2>
            <p className="text-lg text-gray-600 mb-8">
              今すぐ無料でサービスを利用してみる↓
            </p>
            
              <Link href="/login?redirect=list">
                  <button className="bg-white text-[#f6a623] border border-[#f6a623] hover:bg-[#fff7ec] font-semibold px-6 py-3 rounded-full shadow-md w-full transition duration-300">
                      サービスを利用してみる
                    </button>
              </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
