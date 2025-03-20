import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- 既存: Email/Password ログイン ---
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("ログイン失敗: " + (error as Error).message);
    }
  };

  // --- 既存: Email/Password 新規登録 ---
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("ユーザー作成失敗: " + (error as Error).message);
    }
  };

  // === NEW: Googleログイン ===
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // ログイン成功時、自動的にユーザー情報がAuthに登録される
      navigate("/");
    } catch (error) {
      alert("Googleログイン失敗: " + (error as Error).message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login or Register</h2>
      
      <div>
        <label>Email: </label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
        />
      </div>

      <div>
        <label>Password: </label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </div>
      
      <button onClick={handleLogin}>Login</button>{" "}
      <button onClick={handleRegister}>Register</button>
      
      <hr style={{ margin: "16px 0" }} />
      
      {/* Googleログインボタン */}
      <button onClick={handleGoogleLogin}>
        Googleアカウントでログイン
      </button>
    </div>
  );
}
