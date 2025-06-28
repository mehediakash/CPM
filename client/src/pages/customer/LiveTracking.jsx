
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import io from "socket.io-client";
import API from "../../api/axios";
import { Card } from "antd";
const socket = io("http://localhost:8000"); 

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
  const [position, setPosition] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM", 
  });


  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
        const res = await API.get(`/parcels/${parcelId}`);
        console.log(res)
        const history = res.data.locationHistory;

        if (Array.isArray(history) && history.length > 0) {
          const latest = history[history.length - 1];
          if (latest?.lat && latest?.lng) {
            setPosition({
              lat: parseFloat(latest.lat),
              lng: parseFloat(latest.lng),
            });
            console.log("Initial fetched position:", latest);
          } else {
            setPosition(defaultCenter);
          }
        } else {
          setPosition(defaultCenter);
        }
      } catch (err) {
        console.error("Error fetching parcel", err);
        setPosition(defaultCenter);
      }
    };

    if (parcelId) fetchInitialLocation();
  }, [parcelId]);


  useEffect(() => {
    if (!parcelId || !isLoaded) return;

    socket.emit("joinParcelRoom", parcelId);

    socket.on("locationUpdate", ({ lat, lng }) => {
      if (lat && lng) {
        setPosition({ lat, lng });
        console.log("Socket position update:", { lat, lng });
      }
    });

    return () => {
      socket.emit("leaveParcelRoom", parcelId);
      socket.off("locationUpdate");
    };
  }, [parcelId, isLoaded]);

if (!isLoaded || !position)
    return (
      <Card style={{ minHeight: 500, textAlign: "center" }}>
        Loading map...
      </Card>
    );


  return (
      <Card style={{ minHeight: 500 }}>
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
      <Marker position={position} />
    </GoogleMap>
    </Card>
  );
};

export default LiveTracking;
