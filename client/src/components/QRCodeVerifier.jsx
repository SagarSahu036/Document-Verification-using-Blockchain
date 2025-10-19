import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const QRCodeVerifier = () => {
  const { hash } = useParams();
  const [loading, setLoading] = useState(true);   // to show spinner
  const [data, setData] = useState(null);         // API response
  const [error, setError] = useState(null);       // error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://192.168.0.5:5000/api/documents/verify/${hash}`);
        setData(res.data);
      } catch (err) {
        setError("Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hash]);

  // Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        gap={2}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="textSecondary">
          Verifying document...
        </Typography>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Success State
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={1}
    >
      <Typography variant="h5" color="primary">
        ✅ Verification Successful!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {JSON.stringify(data, null, 2)}  
      </Typography>
    </Box>
  );
};

export default QRCodeVerifier;
