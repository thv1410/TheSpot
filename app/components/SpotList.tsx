import { useEffect, useState } from "react";
import Image from "next/image";
import AddReviewPopup from "./AddReview";
import '../styles/SpotList.css'

export default function SpotList({
  spots,
  openReviewIds,
  setOpenReviewIds,
  openHoursIds,
  setOpenHoursIds,
  onAddReview,
  onDeleteSpot,
}: any) {
  const [reviewPopupOpenFor, setReviewPopupOpenFor] = useState<string | null>(null);
  const [deleteModalOpenFor, setDeleteModalOpenFor] = useState<string | null>(null);

  const handleAddReview = async (review: any, id: string) => {
    await fetch(`/api/location/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review }),
    });
    onAddReview(review, id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/location/${id}`, {
        method: "DELETE",
      });
      onDeleteSpot(id);
    } catch (err) {
      console.error("Failed to delete spot:", err);
      alert("Failed to delete spot. Try again.");
    } finally {
      setDeleteModalOpenFor(null);
    }
  };

  return (
    <>
      {spots.map((spot: any) => {
        const isReviewsOpen = !!openReviewIds[spot._id];
        const isHoursOpen = !!openHoursIds[spot._id];

        const toggleReviews = () =>
          setOpenReviewIds((prev: any) => ({
            ...prev,
            [spot._id]: !prev[spot._id],
          }));

        const toggleHours = () =>
          setOpenHoursIds((prev: any) => ({
            ...prev,
            [spot._id]: !prev[spot._id],
          }));

        return (
          <div key={spot._id || spot.place_id} className="spotItem">
            <div className="spotInfo">
              <button
                className='deleteItem'
                onClick={() => setDeleteModalOpenFor(spot._id)}
              >
                ✖
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

              <p><strong>Name:</strong> {spot.name}</p>
              <p><strong>Address:</strong> {spot.address}</p>

              {(spot.hours ?? []).length > 0 && (
                <>
                  <button className="infoToggle" onClick={toggleHours}>
                    {isHoursOpen ? "▼ Hide Hours" : "▶ Hours"}
                  </button>
                  {isHoursOpen && (
                    <p id="hours">
                      {(spot.hours ?? []).map((dayHour: string, idx: number) => (
                        <span key={dayHour + idx}>
                          {dayHour}<br />
                        </span>
                      ))}
                    </p>
                  )}
                </>
              )}

              <p><strong>Type:</strong> {(spot.type ?? []).join(", ")}</p>
              <p><strong>Vibes:</strong> {(spot.vibes ?? []).join(", ")}</p>
              <p><strong>Rating:</strong> {spot.rating}</p>

              <button className='addReviews' onClick={() => setReviewPopupOpenFor(spot._id)}>Add Review</button>
              <br />
              {(spot.reviews ?? []).length > 0 && (
                <button className="infoToggle" onClick={toggleReviews}>
                  {isReviewsOpen ? "▼ Hide Reviews" : `▶ Reviews (${(spot.reviews ?? []).length})`}
                </button>
              )}

              {isReviewsOpen && (spot.reviews ?? []).length > 0 && (
                <div className="reviewsContainer">
                  {(spot.reviews ?? []).map((r: any, idx: number) => (
                    <div key={idx} className="reviewItem">
                      <p><strong>{r.author_name}</strong> - {r.rating}⭐</p>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="spotImageWrapper">
              <Image
                src={spot.image || "/backupPic.png"}
                alt={spot.name}
                width={300}
                height={200}
                className="spotImage"
                loading="eager"
                unoptimized
              />
            </div>

            <AddReviewPopup
              isOpen={reviewPopupOpenFor === spot._id}
              onClose={() => setReviewPopupOpenFor(null)}
              onSubmit={handleAddReview}
              placeId={spot._id}
            />
          </div>
        );
      })}
    </>
  );
}
