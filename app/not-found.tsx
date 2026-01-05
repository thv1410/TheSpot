'use client';

import Link from "next/link";
import './styles/not-found.css';


export default function NotFound() {
  return (
    <div className="error-container">
      <div className="bg-emoji bg1">📚</div>
      <div className="bg-emoji bg2">📍</div>
      <div className="bg-emoji bg3">📖</div>
      <div className="bg-emoji bg4">☕</div>

      <div className="error-box">
        <div className="error-icon">
          <span className="error-emoji">⚠️</span>
        </div>

        <h1 className="error-title">This page can't be found.</h1>

        <p className="error-subtitle">
          Sorry about that. Try going back.
        </p>

        <Link href="/" className="error-button">
          Return
        </Link>
      </div>
    </div>
  );
}
