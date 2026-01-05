'use client';

import { useRouter } from "next/navigation";
import "../styles/SplashPage.css";
import Image from "next/image";

const SplashPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="splash-container">

      <div className="bg-emoji bg1">📚</div>
      <div className="bg-emoji bg2">📖</div>
      <div className="bg-emoji bg3">☕</div>
      <div className="bg-emoji bg4">📍</div>

      <div className="splash-start">
        <div className="splash-icon">
          <span className="emoji">📚</span>
          <span className="emoji">☕</span>
        </div>

        <h1 className="splash-title">StudySpot Finder</h1>
        <p className="splash-subtitle">Your perfect study space awaits</p>

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
      <button className="start-button" onClick={handleGetStarted}>
        Get Started
      </button>

    </div>
  );
};

export default SplashPage;
