import React, { useState } from "react";
import { User } from "firebase/auth";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Paper } from "../types/Paper";

interface UploadPageProps {
  user: User;
}

export default function UploadPage({ user }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<string>("");

  const handleUpload = async () => {
    if (!file) {
      alert("ファイルを選択してください。");
      return;
    }

    try {
      // 1. Firebase Storage へアップロード
      const fileRef = ref(storage, `pdfs/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);

      // 2. PDFのダウンロードURL取得
      const pdfUrl = await getDownloadURL(fileRef);

      // 3. Firestoreにメタデータ(著者など)を登録
      const authorsArray = authors.split(",").map((a) => a.trim()); // カンマ区切り->配列
      const paperData: Paper = {
        userId: user.uid,
        pdfUrl: pdfUrl,
        authors: authorsArray,
        createdAt: Date.now() // または serverTimestamp() でも可
      };

      await addDoc(collection(db, "papers"), paperData);

      alert("アップロード完了！");
      setFile(null);
      setAuthors("");
    } catch (error) {
      alert("アップロード失敗: " + (error as Error).message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>PDFアップロード</h2>

      <div>
        <label>PDFファイル: </label>
        <input 
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <div>
        <label>著者名 (カンマ区切り): </label>
        <input 
          type="text"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          placeholder="Alice, Bob, Charlie"
        />
      </div>

      <button onClick={handleUpload}>アップロード</button>
    </div>
  );
}
