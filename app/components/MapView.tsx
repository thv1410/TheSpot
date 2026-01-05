"use client";
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import "../styles/MapView.css";

interface Spot {
  _id: string;
  name: string;
  location?: { lat: number; lng: number }; 
  vibes?: string[];
}

interface MapViewProps {
  spots?: Spot[];
  onSelectSpot?: (spot: Spot) => void;
}

const LIBRARIES: ("marker")[] = ["marker"];

const vibeIconMap: Record<string, string> = {
  quiet: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f92b.png",
  social: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f5e3.png",
  cozy: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f6cb.png",
  productive: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2705.png",
  latenight: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f319.png",
};

const darkModeStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

export default function MapView({ spots = [], onSelectSpot }: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBf0ChenwYIIgclFwtNJJ_A9a-TL8thnlo',
    libraries: LIBRARIES,
  });

  const center = spots.length && spots[0].location ? spots[0].location : { lat: 33.9507, lng: -83.3783 };

  useEffect(() => {
    if (isLoaded && mapDivRef.current && !mapRef.current) {
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center,
        zoom: 15,
        styles: darkModeStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      google.maps.event.addListenerOnce(mapRef.current, "tilesloaded", () => {
        setOverlayVisible(false);
      });
    }
  }, [isLoaded, center]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current as any;

    map.markers?.forEach((m: any) => m.setMap(null));
    map.markers = [];

    spots.forEach((spot) => {
      if (!spot.location) return; 

      const vibe = spot.vibes?.[0];
      const iconUrl = vibe ? vibeIconMap[vibe] : undefined;

      const marker = new google.maps.Marker({
        map: mapRef.current!,
        position: spot.location as google.maps.LatLngLiteral,
        title: spot.name,
        icon: iconUrl ? { url: iconUrl, scaledSize: new google.maps.Size(45, 45) } : undefined,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding:8px; color: #fff;"><strong>${spot.name}</strong><br/>Vibes: ${spot.vibes?.join(", ") || "N/A"}</div>`,
      });

      marker.addListener("click", () => {
        if (typeof onSelectSpot === "function") onSelectSpot(spot);
      });

      map.markers.push(marker);
    });
  }, [isLoaded, spots, onSelectSpot]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapDivRef} className="mapDiv"></div>

      {overlayVisible && (
        <div className="mapLoad">
          <p className="loadingText">Loading map...</p>
        </div>
      )}
    </div>
  );
}
