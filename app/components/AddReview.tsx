"use client";

import { useState } from "react";
import '../styles/AddReview.css'

interface AddReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { author_name: string; rating: number; text: string }, placeId: string) => void;
  placeId: string;
}

export default function AddReviewPopup({ isOpen, onClose, onSubmit, placeId }: AddReviewPopupProps) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!author || !text) {
      alert("Please fill in your name and review");
      return;
    }
    onSubmit({ author_name: author, rating, text }, placeId);
    setAuthor("");
    setRating(5);
    setText("");
    onClose();
  };

  return (
    <div className='reviewContainer'>
      <div className='reviewForm'>
        <h2>Add Review</h2>
        <input
          placeholder="Your Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
