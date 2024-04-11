import React from "react";
import { Typography, Container, Box, Paper, CardMedia } from "@mui/material";

function HomePage() {
  return (
    <Container>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: "background.paper",
            width: "100%",
            padding: "25px",
          }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "primary",
            }}>
            WELCOME TO EZDEALSHUB!
          </Typography>
          <CardMedia
            component="img"
            image="/assets/images/logo.png"
            alt="EzDealsHub Logo"
            sx={{
              width: "auto",
              height: 250,
              margin: "0 auto", // Center align the image
              mb: 4,
              textAlign: "center",
            }}
          />
          <Typography
            variant="body1"
            paragraph>
            Welcome to EzDealsHub, where innovation meets opportunity in the
            vast landscape of online commerce! At EzDealsHub, we've redefined
            the traditional marketplace experience, ushering in a new era of
            seamless online selling for entrepreneurs and businesses alike.
          </Typography>
          <Typography
            variant="body1"
            paragraph>
            Picture a marketplace where dreams of expanding reach and reducing
            overhead costs become reality – that's EzDealsHub. Our platform is
            more than just an online marketplace; it's a dynamic ecosystem
            designed to empower sellers, propel businesses, and connect buyers
            with a diverse array of products and services.
          </Typography>
          <Typography
            variant="body1"
            paragraph>
            We understand the challenges faced by sellers, and that's why we've
            crafted an intuitive platform that not only simplifies the selling
            process but also amplifies your online presence. By choosing
            EzDealsHub, sellers unlock a world of opportunities to showcase
            their products to a global audience.
          </Typography>
          <Typography
            variant="body1"
            paragraph>
            Our commitment extends beyond mere transactions; we're dedicated to
            fostering a thriving community of entrepreneurs. EzDealsHub is not
            just a marketplace; it's a catalyst for your success.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default HomePage;
