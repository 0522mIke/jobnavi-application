'use client';

import React, { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import JobList from './JobList';

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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login?redirect=list');
        return;
      }

      try {
        const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            companyName: data.companyName || '',
            applicationDate: data.applicationDate || null,
            interviewDate: data.interviewDate || null,
            interviewNotes: data.interviewNotes || '',
            status: data.status || '',
            jobTag: data.jobTag || '',
            url: data.url || '',
            createdAt: data.createdAt
              ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
              : undefined,
          };
        });
        setJobs(jobsData);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fdfcfb] to-[#e8dfd6] flex flex-col items-center w-full">
      <Header variant="full" />
      <main className="flex flex-col items-center justify-center w-full px-4 py-6">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-4xl font-medium text-gray-700">応募リスト</h2>
          <JobList initialJobs={jobs} />
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:underline">
              トップに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListPage;