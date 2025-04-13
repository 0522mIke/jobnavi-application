"use client";

//DB提携のためインポート
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Link from "next/link";

//定義付け
export default function Register() {
  const [companyName, setCompanyName] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [status, setStatus] = useState<typeof statusOptions[number]>("応募前");
  const [jobTag, setJobTag] = useState("");
  const [url, setUrl] = useState("");
  
  const router = useRouter();

  // 追加: 認証チェック
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // 未ログインならログインページへリダイレクト
      if (!user) {
        router.push('/login?redirect=register');
      }
    });
    
    // クリーンアップ関数
    return () => unsubscribe();
  }, [router]);

  //ステータス選択肢
  const statusOptions = [
    "応募前", "書類選考中", "1次面接前", "1次面接通過", 
    "2次面接前", "2次面接通過", "最終面接前", "内定", 
    "不合格", "辞退"
  ];

  //職種選択肢
  const tagOptions = [
    "バックエンド",
    "フロントエンド",
    "Web開発",
    "SE（システムエンジニア）",
    "AIエンジニア",
    "EC開発",
  ];
  
   //firebaseにデータを保存
  //firebaseにデータを保存
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 現在のユーザーIDを取得
    const userId = auth.currentUser?.uid;

    if (!userId) {
      alert("ログインが必要です");
      router.push('/login?redirect=register');
      return;
    }
    
    await addDoc(collection(db, "applications"), {
      companyName,
      applicationDate,
      interviewDate,
      interviewNotes,
      status,
      jobTag,
      url,
      userId, // ユーザーIDを追加
      createdAt: serverTimestamp()
    });

    alert("データを登録しました！");

    // フォームをリセット
    setCompanyName("");
    setApplicationDate("");
    setInterviewDate("");
    setInterviewNotes("");
    setStatus("応募前");
    setJobTag("");
    setUrl("");
  } catch (error) {
    console.error("エラー:", error);
    alert("データの登録に失敗しました");
  }
};
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
      <main className="flex flex-col items-center justify-center w-full">
        {/* 白背景の枠 */}
        <div className="bg-white p-20 rounded-xl shadow-lg w-[90%] max-w-3xl text-center mt-16">
          <h2 className="text-4xl font-medium text-gray-700">企業・求人登録ページ</h2>
       {/* 余白を追加 */}
      <div className="mt-8"></div>
       
           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col text-left text-black">
            会社名:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded-md mt-2"
            />
          </label>

          <label className="flex flex-col text-left text-black">
            応募日（YYYY-MM-DD）:
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            />
          </label>

          <label className="flex flex-col text-left text-black">
            面接予定日（YYYY-MM-DD）:
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            />
          </label>

          <label className="flex flex-col text-left text-black">
            メモ:
            <textarea
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            />
          </label>

          <label className="flex flex-col text-left text-black">
            応募ステータス:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-left text-black">
            職種タグ:
            <select
              value={jobTag}
              onChange={(e) => setJobTag(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            >
              <option value="">選択してください</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-left text-black">
            企業URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-2"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-400 text-white hover:bg-blue-500 p-2 font-semibold rounded-md mt-4"
          >登録</button>

               {/* リストページへのリンク */}
              
                <div className="mt-4 text-center">
                  <Link href="/list" className="text-blue-500 hover:underline">
                    求人リストを見る
                      </Link>
                    </div>
               </form>

            </div>
        </main>
    </div>
  );
}