import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const tokenData = sessionStorage.getItem("jwt");
        const parsedTokenData = JSON.parse(tokenData);

        if (parsedTokenData && parsedTokenData.token) {
          const token = parsedTokenData.token;
          const response = await axios.get("/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom>
        Your Orders
      </Typography>
      <List>
        {orders.map((order, index) => (
          <Link
            to={`/order/${order._id}`}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}>
            <ListItem button>
              <ListItemText
                primary={`Order ${index + 1}`}
                secondary={`Total items: ${
                  order.products.length
                }, Date: ${new Date(order.orderDate).toDateString()}`}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default Orders;
