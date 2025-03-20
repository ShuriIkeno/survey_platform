import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div>
      <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link>{" "}
        {currentUser ? (
          <>
            | <Link to="/upload">Upload PDF</Link>{" "}
            | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            | <Link to="/login">Login</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/upload"
          element={
            currentUser ? (
              <UploadPage user={currentUser} />
            ) : (
              <div>Please login first.</div>
            )
          }
        />
      </Routes>
    </div>
  );
}

// シンプルなホーム画面
function Home({ currentUser }: { currentUser: User | null }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome to Paper App</h2>
      {currentUser ? (
        <p>ログイン中: {currentUser.email}</p>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
