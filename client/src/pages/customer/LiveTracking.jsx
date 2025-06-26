import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // your backend socket URL

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

const LiveTracking = () => {
  const { parcelId } = useParams();
  const [position, setPosition] = useState(defaultCenter);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM", // 🔐 Replace with your API key
  });

  useEffect(() => {
    if (!parcelId || !isLoaded) return;

    socket.emit("joinParcelRoom", parcelId);

    socket.on("locationUpdate", ({ lat, lng }) => {
      setPosition({ lat, lng });
    });

    return () => {
      socket.emit("leaveParcelRoom", parcelId);
      socket.off("locationUpdate");
    };
  }, [parcelId, isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
      onLoad={(map) => (mapRef.current = map)}
    >
      <Marker position={position} />
    </GoogleMap>
  );
};

export default LiveTracking;
