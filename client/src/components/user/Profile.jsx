import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material/";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, onUserUpdate }) => {
  const [token, setToken] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const fetchUpdatedUser = async () => {
    try {
      const updatedUser = await axios.get(`/api/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // update the user in App, so other components can access it
      onUserUpdate(updatedUser.data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  useEffect(() => {
    const storedData = sessionStorage.getItem("jwt");
    if (!storedData) {
      navigate("/login");
    } else {
      const parsedData = JSON.parse(storedData);
      if (parsedData.isAuthenticated) {
        setToken(parsedData.token);
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(
        `/api/user/update-password/${user._id}`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // get updated user info
      await fetchUpdatedUser();
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await axios.post(`/api/user/upload-avatar/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUpdatedUser();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}>
        User Profile
      </Typography>
      <Grid
        container
        spacing={3}>
        <Grid
          item
          xs={12}
          sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                gutterBottom>
                {user.username}
              </Typography>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <Badge
                overlap="circular"
                badgeContent={
                  <label htmlFor="avatar-input">
                    <Fab
                      component="span"
                      size="small">
                      <EditIcon />
                    </Fab>
                  </label>
                }
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}>
                <Avatar
                  alt={user.name}
                  src={`/images/avatars/${user.avatar}`}
                  sx={{
                    width: 200,
                    height: 200,
                    fontSize: "8rem",
                    color: "#FFFFFF",
                  }}
                />
              </Badge>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body2"
                color="textSecondary">
                Name: {user.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary">
                Email: {user.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom>
                Change Password
              </Typography>
              <TextField
                type="password"
                label="Current Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="New Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="Confirm New Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                sx={{ mt: 2 }}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
