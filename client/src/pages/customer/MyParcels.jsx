import React, { useEffect, useState } from "react";
import { List, Button, Card, Spin, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const { Text } = Typography;

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      try {
        const res = await API.get("/parcels/my");
        setParcels(res.data);
      } catch (error) {
        message.error("Failed to load parcels.");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={parcels}
          locale={{ emptyText: "No parcels found" }}
          renderItem={(parcel) => (
            <List.Item>
              <Card
                title={`Parcel ID: ${parcel._id}`}
                extra={
                  <Button
                    type="primary"
                    onClick={() => navigate(`/customer/tracking/${parcel._id}`)}
                  >
                    🚚 Track Live
                  </Button>
                }
              >
                <p>
                  <Text strong>Status:</Text> {parcel.status}
                </p>
                <p>
                  <Text strong>From:</Text> {parcel.pickupAddress}
                </p>
                <p>
                  <Text strong>To:</Text> {parcel.deliveryAddress}
                </p>
                <p>
                  <Text strong>Payment Method:</Text> {parcel.paymentMethod}
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default MyParcels;
