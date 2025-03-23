import React, { useState, useRef } from "react";
import { User } from "firebase/auth";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Paper } from "../types/Paper";
import "./UploadPage.css"; // 新しく追加するCSSファイル

interface UploadPageProps {
  user: User;
}

export default function UploadPage({ user }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [authorInput, setAuthorInput] = useState<string>("");
  const [authorsList, setAuthorsList] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setAuthorsList([...authorsList, authorInput.trim()]);
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setAuthorsList(authorsList.filter((author) => author !== authorToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("PDFファイルを選択してください");
      return;
    }

    if (authorsList.length === 0) {
      setErrorMessage("少なくとも1人の著者を追加してください");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setErrorMessage("");

      // アップロード進捗のシミュレーション
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      // 1. Firebase Storage へアップロード
      const fileRef = ref(storage, `pdfs/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);

      // 2. PDFのダウンロードURL取得
      const pdfUrl = await getDownloadURL(fileRef);

      // 3. Firestoreにメタデータを登録
      const paperData: Paper = {
        userId: user.uid,
        pdfUrl: pdfUrl,
        authors: authorsList,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "papers"), paperData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccessMessage("PDFが正常にアップロードされました！");

      // フォームをリセット
      setTimeout(() => {
        setFile(null);
        setAuthorsList([]);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1500);
      
    } catch (error) {
      setErrorMessage(`アップロード失敗: ${(error as Error).message}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">論文アップロード</h1>
        <div className="divider"></div>

        {errorMessage && (
          <div className="alert alert-error">
            <span>{errorMessage}</span>
            <button className="alert-close" onClick={() => setErrorMessage("")}>×</button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span>{successMessage}</span>
            <button className="alert-close" onClick={() => setSuccessMessage("")}>×</button>
          </div>
        )}

        {/* ファイルアップロードエリア */}
        <div 
          className="file-upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          
          {file ? (
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📤</div>
              <div className="upload-text">
                クリックしてPDFファイルを選択
              </div>
              <div className="upload-subtext">
                最大ファイルサイズ: 10MB
              </div>
            </div>
          )}
        </div>

        {/* 著者情報エリア */}
        <div className="authors-section">
          <h2 className="section-title">
            著者情報
            <span className="info-icon" title="著者名を追加してください。複数の著者がいる場合は、一人ずつ追加してください。">ⓘ</span>
          </h2>
          
          <div className="author-input-group">
            <input
              type="text"
              className="author-input"
              placeholder="例: 山田太郎"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAuthor()}
            />
            <button
              className="add-author-btn"
              onClick={handleAddAuthor}
              disabled={!authorInput.trim()}
            >
              追加
            </button>
          </div>

          {/* 著者リスト */}
          <div className="authors-list">
            {authorsList.length === 0 ? (
              <div className="no-authors">著者が追加されていません</div>
            ) : (
              authorsList.map((author, index) => (
                <div key={index} className="author-chip">
                  <span>{author}</span>
                  <button
                    className="remove-author"
                    onClick={() => handleRemoveAuthor(author)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* アップロードボタン */}
        <div className="upload-button-container">
          <button
            className={`upload-button ${isUploading ? 'uploading' : ''}`}
            onClick={handleUpload}
            disabled={isUploading || !file || authorsList.length === 0}
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </button>
        </div>

        {/* プログレスバー */}
        {isUploading && (
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}