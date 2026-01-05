"use client";

import { useState } from "react";
import "../styles/AddForm.css";
import Image from "next/image";

interface AddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  user?: any;
}

function AddForm({ isOpen, onClose, onSubmit, user }: AddFormProps) {
  const [spotName, setSpotName] = useState("");
  const [hours, setHours] = useState<string[]>(["", "", "", "", "", "", ""]);
  const [types, setTypes] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [vibe, setVibe] = useState<string>("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [image, setImage] = useState<string | null>(null);


  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const availableTypes = [
    { value: "cafe", label: "☕ Café" },
    { value: "food", label: "🍽️ Food" },
    { value: "store", label: "🏪 Store" },
    { value: "bar", label: "🍺 Bar" },
    { value: "night_club", label: "🎵 Night Club" },
    { value: "bakery", label: "🥐 Bakery" },
    { value: "restaurant", label: "🍴 Restaurant" },
    { value: "library", label: "📚 Library" },
    { value: "school", label: "🎓 School" },
  ];

  const handleTypeToggle = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter((t) => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleHourChange = (index: number, value: string) => {
    const newHours = [...hours];
    newHours[index] = value;
    setHours(newHours);
  };

  const handleVibeSelect = (selectedVibe: string) => {
    if (vibe === selectedVibe) {
      setVibe("");
    } else {
      setVibe(selectedVibe);
    }
  };

  const handleSubmit = () => {
    const formData = {
      name: spotName,
      hours,
      type: types,
      address,
      vibes: vibe ? [vibe] : [],
      rating,
      image,
      _id: `user_${Date.now()}_${Math.random().toString(32).substring(2, 9)}`,
      location: { lat: 0, lng: 0 },
      reviews: review ? [{
        author_name: user?.email,
        rating,
        text: review,
        relative_time_description: "Just now",
        profile_photo_url: user.image || null,
      }] : [],
    };

    console.log("Study Spot Submitted:", formData);

    if (onSubmit) {
      onSubmit(formData);
    }

    setSpotName("");
    setHours(["", "", "", "", "", "", ""]);
    setTypes([]);
    setAddress("");
    setVibe("");
    setReview("");
    setRating(0);
    setImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Add Study Spot</h2>
          <button className="closeButton" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          {/* Basic Info */}
          <div className="section">
            <h3 className="sectionTitle">Basic Information</h3>
            <div className="formRow">
              <div className="formGroup fullWidth">
                <label>Spot Name *</label>
                <input
                  type="text"
                  className="textInput"
                  placeholder="e.g., The Daily Grind Café"
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Type * (Select all that apply)</label>
              <div className="checkboxGrid">
                {availableTypes.map((type) => (
                  <label key={type.value} className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={types.includes(type.value)}
                      onChange={() => handleTypeToggle(type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="formGroup">
              <label>📍 Address *</label>
              <input
                type="text"
                className="textInput"
                placeholder="123 University Ave, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Hours */}
          <div className="section">
            <h3 className="sectionTitle">🕐 Hours of Operation</h3>
            <p className="instruction">Enter hours for each day (e.g., "7:30 AM - 8:00 PM" or "Closed")</p>
            <div className="hoursGrid">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="hourRow">
                  <label className="dayLabel">{day}:</label>
                  <input
                    type="text"
                    className="textInput hourInput"
                    placeholder="e.g., 7:30 AM - 8:00 PM"
                    value={hours[index]}
                    onChange={(e) => handleHourChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="uploadButton"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            Choose Image
          </button>

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {image && (
            <Image
              src={image}
              alt="Preview"
              width={200}
              height={200}
              className="imagePreview"
            />
          )}

          {/* Vibe & Review */}
          <div className="formRow">
            <div className="section halfWidth">
              <h3 className="sectionTitle">Vibe *</h3>
              <p className="instruction">Select only one vibe</p>
              <div className="checkboxGroup">
                {[
                  { key: "quiet", label: "🤫 Quiet" },
                  { key: "social", label: "🗣️ Social" },
                  { key: "cozy", label: "🛋️ Cozy" },
                  { key: "productive", label: "✅ Productive" },
                  { key: "latenight", label: "🌙 Late Night" },
                ].map((v) => (
                  <label key={v.key} className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={vibe === v.key}
                      onChange={() => handleVibeSelect(v.key)}
                    />
                    <span>{v.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="section halfWidth">
              <h3 className="sectionTitle">Review & Rating</h3>
              <div className="ratingSection">
                <label>Your Rating *</label>
                <div className="starRating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ratingText">{rating > 0 ? `${rating}/5` : 'Click to rate'}</span>
                </div>
              </div>

              <div className="reviewSection">
                <label>Your Review</label>
                <p className="instruction">Tell us about your experience</p>
                <textarea
                  className="textArea"
                  placeholder="What makes this place special? Good wifi? Great coffee? Perfect for studying?"
                  rows={6}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modalFooter">
          <button className="cancelButton" onClick={onClose}>Cancel</button>
          <button className="submitButton" onClick={handleSubmit}>Add Study Spot</button>
        </div>
      </div>
    </div>
  );
}

export default AddForm;
