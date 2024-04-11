import React from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";

const Footer = () => {
  return (
    <AppBar
      position="static"
      sx={{
        top: "auto",
        bottom: 0,
      }}>
      <Toolbar>
        <Container>
          <Typography
            variant="body2"
            align="center">
            © 2023 EZDealsHub. All rights reserved.
          </Typography>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
