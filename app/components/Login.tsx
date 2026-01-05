"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        alert("Invalid credentials");
      } else {
        router.push("/home");
      }
    } else {
      const createRes = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await createRes.json();

      if (!createRes.ok) {
        alert(data.msg || "Sign up failed");
        return;
      }

      alert("Account created! You can now log in.");
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="splash-login">
      <div className="bg-icons">
        <span className="icon icon-1">📚</span>
        <span className="icon icon-2">📚</span>
        <span className="icon icon-3">📚</span>
        <span className="icon icon-4">📚</span>
        <span className="icon icon-5">📚</span>
        <span className="icon icon-6">📍</span>
        <span className="icon icon-7">📍</span>
        <span className="icon icon-8">📍</span>
        <span className="icon icon-9">📍</span>
        <span className="icon icon-10">📍</span>
        <span className="icon icon-11">☕</span>
        <span className="icon icon-12">☕</span>
        <span className="icon icon-13">☕</span>
        <span className="icon icon-14">☕</span>
        <span className="icon icon-15">☕</span>
      </div>

      <div className="login-left">
        <div className="login-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            type="button"
            className="guest-button"
            onClick={() => router.push("/home")}
          >
            Enter as a Guest
          </button>
        </form>
      </div>

      <div className="login-right">
        <h2>What you'll get:</h2>

        <div className="benefit-card">
          <h3>📍 Find Nearby Study Spots</h3>
          <p>Discover cafés and libraries near you with real-time availability</p>
        </div>

        <div className="benefit-card">
          <h3>☕ Read &amp; Write Reviews</h3>
          <p>Share your experiences and help other students find their perfect spot</p>
        </div>

        <div className="benefit-card">
          <h3>📖 Add Your Favorite Spots</h3>
          <p>Contribute to the community by adding new study locations</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
