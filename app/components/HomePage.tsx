"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddForm from "./AddForm";
import "../styles/HomePage.css";
import MapView from "./MapView";
import SpotList from "./SpotList";
import SpotDetails from "./SpotDetails";

export default function HomePage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  const [openReviewIds, setOpenReviewIds] = useState<Record<string, boolean>>({});
  const [openHoursIds, setOpenHoursIds] = useState<Record<string, boolean>>({});
  const [surpriseSpots, setSurpriseSpots] = useState<string[]>([]);
  const [modalSpot, setModalSpot] = useState<any | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      console.log("Session data:", data);
      setUser(data?.user ?? null);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
        setSpots(data.locations);
        setInitialLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoad(false);
      });
  }, []);

  useEffect(() => {
    if (modalSpot) {
      const updated = spots.find((s) => s._id === modalSpot._id);
      if (updated) setModalSpot(updated);
    }
  }, [spots]);

  const handleAddSpot = async (spotData: any) => {
    if (!user) {
      alert("You must be logged in to add a study spot.");
      return;
    }

    const geoRes = await fetch(`/api/google?address=${encodeURIComponent(spotData.address)}`);
    const geoData = await geoRes.json();

    if (!geoData || !geoData.userLocation) {
      alert("Unable to get location from address.");
      return;
    }

    const newSpot = {
      ...spotData,
      ownerEmail: user.email,
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      location: geoData.userLocation,
    };

    await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSpot),
    });

    const res = await fetch("/api/location");
    const data = await res.json();
    setSpots(data.locations);
  };

  const filteredSpots = spots.filter((spot) =>
    filter === "surprise"
      ? surpriseSpots.includes(spot._id)
      : (filter === "all" ? true : spot.vibes.includes(filter)) &&
      spot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSurpriseMe = () => {
    if (spots.length === 0) return;
    const count = Math.floor(Math.random() * 10) + 1;
    const shuffled = [...spots].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    setSurpriseSpots(selected.map((s) => s._id));
    setFilter("surprise");
  };

  const handleSubmitAddress = async () => {
    if (!userAddress.trim()) return;

    try {
      const res = await fetch(
        `/api/google?address=${encodeURIComponent(userAddress)}`
      );
      const data = await res.json();

      if (!data.nearbySpots || data.nearbySpots.length === 0) {
        alert("No nearby study spots found for this address.");
        return;
      }

      const newSpots = data.nearbySpots.filter(
        (s: any) => !spots.some((p) => p._id === s.place_id)
      );

      await Promise.all(
        newSpots.map((spot: any) =>
          fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: spot.name,
              address: spot.address,
              hours: spot.hours || [],
              type: spot.type || [],
              vibes: spot.vibes || [],
              description: spot.description || "",
              image: spot.image || "",
              rating: spot.rating || 0,
              _id: spot.place_id,
              location: spot.location,
              reviews: spot.reviews || [],
              ownerEmail: user?.email || null,
            }),
          })
        )
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setUserAddress("");
    }
  };

  const handleAddReview = (review: any, id: string) => {

    setSpots((prevSpots) =>
      prevSpots.map((spot) => {
        if (spot._id !== id) return spot;

        const updatedReviews = [...(spot.reviews || []), review];
        const avgRating = parseFloat(
          (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length
          ).toFixed(2)
        );

        if (modalSpot && modalSpot._id === id) {
          setModalSpot({ ...spot, reviews: updatedReviews, rating: avgRating });
        }

        return { ...spot, reviews: updatedReviews, rating: avgRating };
      })
    );
  };



  const handleDeleteSpot = (id: string) => {
    const spot = spots.find((s) => s._id === id);
    setSpots((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div id="container">
      <div className="Sidebar">
        <p>Filter by Vibe</p>
        <button className="leftButton" onClick={() => setFilter("all")}>
          🌐 All
        </button>
        <button className="leftButton" onClick={() => setFilter("quiet")}>
          🤫 Quiet
        </button>
        <button className="leftButton" onClick={() => setFilter("social")}>
          🗣️ Social
        </button>
        <button className="leftButton" onClick={() => setFilter("cozy")}>
          🛋️ Cozy
        </button>
        <button className="leftButton" onClick={() => setFilter("productive")}>
          ✅ Productive
        </button>
        <button className="leftButton" onClick={() => setFilter("latenight")}>
          🌙 Late Night
        </button>
        <button className="extraButton" onClick={handleSurpriseMe}>
          Surprise Me!
        </button>

        {user ? (
          <button
            className="extraButton2"
            onClick={() => setIsAddFormOpen(true)}
          >
            + Add New Study Spot
          </button>
        ) : (
          <button
            className="extraButton2"
            onClick={() => alert("Please log in to add a study spot.")}
          >
            + Add New Study Spot
          </button>
        )}

        <div className="userProfile">
          <button className="profileButton">
            <Image
              src="/profilePic.jpg"
              alt="Profile"
              width={50}
              height={50}
              className="profilePic"
            />
          </button>
          <p>{user?.email || "Guest"}</p>
        </div>
      </div>

      <div className="List">
        <div className="topBar">
          <div className="tabs">
            <button
              className={showMap ? "tabButton activeTab" : "tabButton"}
              onClick={() => setShowMap(true)}
            >
              Map
            </button>
            <button
              className={showMap ? "tabButton" : "tabButton activeTab"}
              onClick={() => {
                setShowMap(false);
                setModalSpot(null);
              }}
            >
              List
            </button>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter your address..."
              className="addressInput"
            />
            <button className="addressSubmit" onClick={handleSubmitAddress}>
              Submit
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setModalSpot(null)}
            className="searchInput"
          />
        </div>

        <div className="spotsContainer">
          {filteredSpots.length === 0 ? (
            <div className="noSpotsMessage">
              {initialLoad ? (
                <div className="mapWrapper">
                  <div className="mapLoad">
                    <p className="loadingText">Loading map...</p>
                  </div>
                </div>
              ) : (
                <p>No study spots found for the selected filter.</p>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: showMap ? "block" : "none" }}>
                <MapView spots={filteredSpots} onSelectSpot={setModalSpot} />
              </div>

              <div style={{ display: showMap ? "none" : "block" }}>
                <SpotList
                  spots={filteredSpots}
                  openReviewIds={openReviewIds}
                  setOpenReviewIds={setOpenReviewIds}
                  openHoursIds={openHoursIds}
                  setOpenHoursIds={setOpenHoursIds}
                  onAddReview={handleAddReview}
                  onDeleteSpot={handleDeleteSpot}
                  user={user}
                />
              </div>
            </>
          )}

          {modalSpot && (
            <SpotDetails
              spot={modalSpot}
              onClose={() => setModalSpot(null)}
              onAddReview={handleAddReview}
              onDeleteSpot={handleDeleteSpot}
              user={user}
            />
          )}
        </div>
      </div>
      <AddForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddSpot}
        user={user}
      />
    </div>
  );
}
