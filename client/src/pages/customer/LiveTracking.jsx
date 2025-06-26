import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:9000"); // replace with backend

const LiveTracking = ({ parcelId }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 },
      zoom: 12,
    });
    markerRef.current = new window.google.maps.Marker({ map });

    socket.emit("joinParcelRoom", parcelId);
    socket.on("locationUpdate", ({ lat, lng }) => {
      markerRef.current.setPosition({ lat, lng });
      map.setCenter({ lat, lng });
    });

    return () => socket.emit("leaveParcelRoom", parcelId);
  }, [parcelId]);

  return <div ref={mapRef} className="h-[500px] w-full" />;
};

export default LiveTracking;