"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from '@/lib/firebase';

type Job = {
  id: string;
  companyName: string;
  applicationDate: string | null;
  interviewDate: string | null;
  interviewNotes: string;
  status: string;
  jobTag: string;
  url: string;
};

export async function updateJob(job: Job) {
  try {
    const jobDocRef = doc(db, "applications", job.id);
    
    await updateDoc(jobDocRef, {
      companyName: job.companyName,
      applicationDate: job.applicationDate,
      interviewDate: job.interviewDate,
      status: job.status,
      jobTag: job.jobTag,
      interviewNotes: job.interviewNotes,
      url: job.url
    });
    
    revalidatePath('/list');
    
    return { success: true };
  } catch (error) {
    console.error("更新エラー:", error);
    return { error: "更新に失敗しました" };
  }
}

export async function deleteJob(id: string) {
  try {
    const jobDocRef = doc(db, "applications", id);
    await deleteDoc(jobDocRef);
    
    revalidatePath('/list');
    
    return { success: true };
  } catch (error) {
    console.error("削除エラー:", error);
    return { error: "削除に失敗しました" };
  }
}

export async function registerCompany(data: {
  companyName: string;
  applicationDate: string;
  interviewDate: string;
  interviewNotes: string;
  status: string;
  jobTag: string;
  url: string;
}) {
  try {
   
    const userId = auth.currentUser?.uid;

    if (!userId) {
      return { error: "ログインが必要です" };
    }
    
    await addDoc(collection(db, "applications"), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
    
      revalidatePath('/list');
    
    return { success: true };
  } catch (error) {
    console.error("登録エラー:", error);
    return { error: "データの登録に失敗しました" };
  }
}