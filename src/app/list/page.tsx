"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; 


//job型の定義
type Job = {
  id: string;
  companyName: string;
  applicationDate: string | null;
  interviewDate: string | null;
  interviewNotes: string;
  status: string;
  jobTag: string;
  url: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

const ListPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');

  const router = useRouter();

  // 修正フォームの選択肢のため定義
  const statusOptions = [
    "応募前", "書類選考中", "1次面接前", "1次面接通過", 
    "2次面接前", "2次面接通過", "最終面接前", "内定", 
    "不合格", "辞退"
  ];

  const tagOptions = [
    "バックエンド",
    "フロントエンド",
    "Web開発",
    "SE（システムエンジニア）",
    "AIエンジニア",
    "EC開発",
  ];

  //Firestoreからデータを取得
  useEffect(() => {
    const authCheck = auth.onAuthStateChanged((user) => {
      if (!user) {
        // 未ログインならログインページへリダイレクト
        router.push('/login?redirect=list');
      } else {
        // ログイン済みなら、データ取得処理を実行
        fetchJobs();
      }
    });
  
    // クリーンアップ関数
    return () => authCheck();
  }, [router]);
  
  const fetchJobs = async () => {
    try {
      // 現在のユーザーIDを取得
      const userId = auth.currentUser?.uid;

      if (userId) {
        // ユーザーIDでフィルタリングしたクエリを作成
        const q = query(
          collection(db, "applications"),
          where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);
        const jobsData: Job[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
  
      setJobs(jobsData);
    } 

    } catch (error) {
      console.error("データの取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  // ソート関数を追加
  const getSortedJobs = () => {
    let sorted = [...jobs];
    
    switch(sortOption) {
      case 'newest': 
        return sorted.sort((a, b) => {
          // createdAtがあればそれを使用
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          // なければapplicationDateにフォールバック
          return new Date(b.applicationDate || 0).getTime() - 
                 new Date(a.applicationDate || 0).getTime();
        });
        case 'oldest': 
        return sorted.sort((a, b) => {
          // createdAtがあればそれを使用
          if (a.createdAt && b.createdAt) {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
          // なければapplicationDateにフォールバック
          return new Date(a.applicationDate || 0).getTime() - 
                 new Date(b.applicationDate || 0).getTime();
        });
      case 'companyName': // 会社名でソート
        return sorted.sort((a, b) => 
          (a.companyName || '').localeCompare(b.companyName || '', 'ja')
        );
      case 'interviewDate': // 面接日でソート（近い順）
        return sorted.sort((a, b) => {
          const dateA = a.interviewDate ? new Date(a.interviewDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.interviewDate ? new Date(b.interviewDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB; // 未設定は後ろに
        });
      case 'status': // ステータス順でソート
        return sorted.sort((a, b) => 
          (a.status || '').localeCompare(b.status || '', 'ja')
        );
      default: 
        return sorted;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    field: string
  ) => {
    const { value } = e.target;
  
    // `editJob`の対応するフィールドを更新
    setEditJob((prevEditJob) => {
      if (prevEditJob) {
        return { ...prevEditJob, [field]: value };
      }
      return prevEditJob;
    });
  };

  const handleEdit = (id: string) => {
    const jobToEdit = jobs.find((job) => job.id === id);
    setEditJob(jobToEdit || null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (editJob?.id) {
      try {
        // Firestoreのドキュメント参照を作成
        const jobDocRef = doc(db, "applications", editJob.id);
        
        // ドキュメントを更新
        await updateDoc(jobDocRef, {
          companyName: editJob.companyName,
          applicationDate: editJob.applicationDate,
          interviewDate: editJob.interviewDate,
          status: editJob.status,
          jobTag: editJob.jobTag,
          interviewNotes: editJob.interviewNotes,
          url: editJob.url
        });

        // ローカルステートを更新
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === editJob.id ? { ...job, ...editJob } : job
          )
        );

        // 編集状態をリセット
        setEditJob(null);
      } catch (error) {
        console.error("データの更新に失敗しました", error);
      }
    }
  };

      const handleDelete = async (id: string) => {
        if (window.confirm("この求人情報を削除してもよろしいですか？")) {
          try {
            // Firestoreからドキュメントを削除
            const jobDocRef = doc(db, "applications", id);
            await deleteDoc(jobDocRef);
            
            // ローカルステートからも削除
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
            
            // 編集中の場合は編集モードを終了
            if (editJob && editJob.id === id) {
              setEditJob(null);
            }

            alert("削除が完了しました。");
            
          } catch (error) {
            console.error("データの削除に失敗しました", error);
            alert("削除に失敗しました。もう一度お試しください。");
          }
        }
      };

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

     
        <main className="flex flex-col items-center justify-center w-full px-4 py-6">
           <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">
           <h2 className="text-xl font-normal mb-4 text-gray-800">応募リスト</h2>

          {/* 編集フォームが表示される場合 */}
          {editJob && (
            <form onSubmit={handleSave} className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">求人情報を編集</h3>
              
              {/* 会社名 */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">会社名</label>
                <input
                  type="text"
                  value={editJob.companyName}
                  onChange={(e) => handleChange(e, "companyName")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                />
              </div>

              {/* 応募日 */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">応募日</label>
                <input
                  type="date"
                  value={editJob.applicationDate || ""}
                  onChange={(e) => handleChange(e, "applicationDate")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                />
              </div>

              {/* 面接日 */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-800">面接日</label>
                <input
                  type="date"
                  value={editJob.interviewDate || ""}
                  onChange={(e) => handleChange(e, "interviewDate")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                />
              </div>

              {/* ステータス */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">ステータス</label>
                <select
                  value={editJob.status}
                  onChange={(e) => handleChange(e, "status")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 職種タグ */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">職種タグ</label>
                <select
                value={editJob.jobTag}
                onChange={(e) => handleChange(e, "jobTag")}
                className="p-2 border border-gray-300 text-gray-400 rounded"
              >
                <option value="">選択してください</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* 企業URL */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">企業URL</label>
                <input
                  type="url"
                  value={editJob.url || ""}
                  onChange={(e) => handleChange(e, "url")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                />
              </div>

              {/* 面接メモ */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-700">面接メモ</label>
                <input
                  type="text"
                  value={editJob.interviewNotes}
                  onChange={(e) => handleChange(e, "interviewNotes")}
                  className="p-2 border border-gray-300 text-gray-400 rounded"
                />
              </div>

              {editJob && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(editJob.id)}
                  className="bg-rose-400 text-white hover:bg-rose-500 py-2 px-4 rounded-md"
                >
                  削除
                </button>
              </div>
            )}
            </form>
          )}

          {/* ソート用セレクト */}
          <div className="flex justify-end items-center mb-4 pr-4">
            <label className="mr-2 text-gray-700">並び替え:</label>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)} 
              className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-700"
            >
              <option value="newest">新着順</option>
              <option value="oldest">古い順</option>
              <option value="companyName">会社名順</option>
              <option value="interviewDate">面接日順</option>
              <option value="status">ステータス順</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto">
          <table className="w-full mt-8 border-collapse border border-gray-300 shadow-md text-gray-800">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-center whitespace-nowrap">会社名</th>
                <th className="border p-2 text-center whitespace-nowrap">応募日</th>
                <th className="border p-2 text-center whitespace-nowrap">面接日</th>
                <th className="border p-2 text-center whitespace-nowrap">ステータス</th>
                <th className="border p-2 text-center whitespace-nowrap">職種タグ</th>
                <th className="border p-2 text-center whitespace-nowrap">企業URL</th>
                <th className="border p-2 text-center whitespace-nowrap">面接メモ</th>
              </tr>
            </thead>
            <tbody>
              {getSortedJobs().map((job) => (
                <tr key={job.id}>
                  <td className="border px-4 py-2 text-sm">{job.companyName}</td>
                  <td className="border px-4 py-2 text-sm">
                    {job.applicationDate && !isNaN(new Date(job.applicationDate).getTime())
                      ? new Date(job.applicationDate).toLocaleDateString()
                      : null }
                  </td>
                  <td className="border px-4 py-2 text-sm">
                    {job.interviewDate && !isNaN(new Date(job.interviewDate).getTime())
                      ? new Date(job.interviewDate).toLocaleDateString()
                      : null }
                  </td>
                  <td className="border px-4 py-2 text-sm">{job.status}</td>
                  <td className="border px-4 py-2 text-sm">{job.jobTag}</td>
                  {/* URL列を追加 */}
                  <td className="border px-4 py-2 text-sm">
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        リンク
                      </a>
                    ) : null }
                  </td>
                  {/* 面接メモ列 - 編集ボタン付き */}
                  <td className="border px-4 py-2 text-sm">
                    <div className="flex items-start">
                      <span className="flex-grow break-words">{job.interviewNotes}</span>
                      <button 
                        onClick={() => handleEdit(job.id)} 
                        className="ml-2 text-blue-500 hover:text-blue-700 text-sm flex-shrink-0"
                      >
                        編集
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div className="mt-16 text-center">
            <Link href="/register" className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500">
              新しい求人を登録
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="px-4">
            <Link href="/" className="text-blue-500 hover:underline">
              トップに戻る
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
};

export default ListPage;
