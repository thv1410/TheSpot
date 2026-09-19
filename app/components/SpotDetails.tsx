"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "./Card";
import AddReviewPopup from "./AddReview";
import "../styles/SpotDetail.css";

const getOptimizedSpotImage = (imageSrc?: string) => {
  if (!imageSrc) return "/backupPic.png";

  if (imageSrc.includes("maps.googleapis.com")) {
    try {
      const url = new URL(imageSrc);
      const photoRef = url.searchParams.get("photoreference");
      if (photoRef) {
        return `/api/place-photo?photoreference=${photoRef}&maxwidth=400`;
      }
    } catch {
      // Fall through if URL parsing fails
    }
  }

  if (!imageSrc.startsWith("http") && !imageSrc.startsWith("/") && imageSrc.length > 50) {
    return `/api/place-photo?photoreference=${imageSrc}&maxwidth=400`;
  }

  return imageSrc;
};

export default function SpotDetails({
  spot,
  onClose,
  onAddReview,
  onDeleteSpot,
  user,
}: {
  spot: any;
  onClose: () => void;
  onAddReview: (review: any, id: string) => void;
  onDeleteSpot: (id: string) => void;
  user: any;
}) {
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [deleteModalOpenFor, setDeleteModalOpenFor] = useState<string | null>(null);

  const handleAddReview = async (review: any) => {
    if (!user) {
      alert("You must be logged in to add a review.");
      return;
    }

    try {
      await fetch(`/api/location/${spot._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });
      onAddReview(review, spot._id);
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("Failed to add review. Try again.");
    } finally {
      setReviewPopupOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      alert("Please log in to delete this spot.");
      return;
    }

    try {
      await fetch(`/api/location/${id}`, { method: "DELETE" });
      onDeleteSpot(id);
      onClose();
    } catch (err) {
      console.error("Failed to delete spot:", err);
      alert("Failed to delete spot. Try again.");
    } finally {
      setDeleteModalOpenFor(null);
    }
  };

  const imageSrc = spot.place_id
    ? `/api/place-photo?placeId=${spot.place_id}&maxwidth=400`
    : getOptimizedSpotImage(spot.image);

  return (
    <div className="modalOverlay2">
      <div className="modalContent verticalModal">
        <button className="closeButton" onClick={onClose}>✖</button>

        <Card className="spotInfo vertical">
          <p><strong>Name:</strong> {spot.name}</p>
          <p><strong>Address:</strong> {spot.address}</p>
          <p><strong>Type:</strong> {(spot.type ?? []).join(", ")}</p>
          <p><strong>Vibes:</strong> {(spot.vibes ?? []).join(", ")}</p>
          <p><strong>Rating:</strong> {spot.rating}</p>

          {(spot.hours ?? []).length > 0 && (
            <>
              <button className="infoToggle" onClick={() => setHoursOpen(!hoursOpen)}>
                {hoursOpen ? "▼ Hide Hours" : "▶ Hours"}
              </button>
              {hoursOpen && (
                <p>
                  {(spot.hours ?? []).map((dayHour: string, idx: number) => (
                    <span key={dayHour + idx}>{dayHour}<br /></span>
                  ))}
                </p>
              )}
            </>
          )}
          <button
            className='addReviews'
            onClick={() => {
              if (!user) {
                alert("Please log in to add a review.");
                return;
              }
              setReviewPopupOpen(true);
            }}
          >
            Add Review
          </button>

          {(spot.reviews ?? []).length > 0 && (
            <button className="infoToggle" onClick={() => setReviewsOpen(!reviewsOpen)}>
              {reviewsOpen ? "▼ Hide Reviews" : `▶ Reviews (${spot.reviews.length})`}
            </button>
          )}

          {reviewsOpen && (spot.reviews ?? []).length > 0 && (
            <Card className="reviewsContainer">
              {(spot.reviews ?? []).map((r: any, idx: number) => (
                <div key={idx} className="reviewItem">
                  <p><strong>{r.author_name}</strong> - {r.rating}⭐</p>
                  <p>{r.text}</p>
                </div>
              ))}
            </Card>
          )}
        </Card>

        <Card className="spotImageWrapper verticalImage">
          <Image
            src={imageSrc}
            alt={spot.name || "Study spot image"}
            width={300}
            height={200}
            className="spotImage2"
            unoptimized
          />
        </Card>

        <button
          className='deleteItem2'
          onClick={() => {
            if (!user) {
              alert("Please log in to delete this spot.");
              return;
            }
            setDeleteModalOpenFor(spot._id);
          }}
        >
          Delete
        </button>

        {deleteModalOpenFor === spot._id && (
          <div className="deleteModalOverlay">
            <div className="deleteModal">
              <p>Are you sure you want to delete <strong>{spot.name}</strong>?</p>
              <button onClick={() => handleDelete(spot._id)}>Yes, Delete</button>
              <button onClick={() => setDeleteModalOpenFor(null)}>Cancel</button>
            </div>
          </div>
        )}

        <AddReviewPopup
          isOpen={reviewPopupOpen}
          onClose={() => setReviewPopupOpen(false)}
          onSubmit={handleAddReview}
          placeId={spot._id}
        />
      </div>
    </div>
  );
}