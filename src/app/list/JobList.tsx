"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

// JobListコンポーネントのprops
type JobListProps = {
  initialJobs: Job[];
};

export default function JobList({ initialJobs }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

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

  const getSortedJobs = () => {
    const sorted = [...jobs];
    
    switch(sortOption) {
      case 'newest': 
        return sorted.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return new Date(b.applicationDate || 0).getTime() - 
                 new Date(a.applicationDate || 0).getTime();
        });
      case 'oldest': 
        return sorted.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
          return new Date(a.applicationDate || 0).getTime() - 
                 new Date(b.applicationDate || 0).getTime();
        });
      case 'companyName':
        return sorted.sort((a, b) => 
          (a.companyName || '').localeCompare(b.companyName || '', 'ja')
        );
      case 'interviewDate':
        return sorted.sort((a, b) => {
          const dateA = a.interviewDate ? new Date(a.interviewDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.interviewDate ? new Date(b.interviewDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        });
      case 'status':
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

        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === editJob.id ? { ...job, ...editJob } : job
          )
        );

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
        
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
        
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

    return (
    <>
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
                {/* URL */}
                <td className="border px-4 py-2 text-sm">
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      リンク
                    </a>
                  ) : null }
                </td>
                {/* 面接メモ列 */}
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
    </>
  );
}