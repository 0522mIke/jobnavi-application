import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Firebase 設定をインポート

export const getCompanies = async () => {
  const querySnapshot = await getDocs(collection(db, "companies"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
