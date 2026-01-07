import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Send, Phone, Message } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { sendInquiry, clearSuccessMessage, clearError } from "../redux/slices/inquiriesSlice";

const InquiryModal = ({ open, onClose, car }) => {
  const dispatch = useDispatch();
  const { sendingInquiry, error, successMessage } = useSelector(
    (state) => state.inquiries
  );
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    message: `Hi, I'm interested in your ${car?.company || car?.carName || "car"}. Is it still available?`,
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const result = await dispatch(
      sendInquiry({
        carId: car._id,
        message: formData.message,
        phone: formData.phone,
      })
    );

    if (sendInquiry.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearSuccessMessage());
        onClose();
        setFormData({
          message: `Hi, I'm interested in your ${car?.company || car?.carName || "car"}. Is it still available?`,
          phone: "",
        });
      }, 2000);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    onClose();
  };

  if (!car) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Header with car info */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            src={car.image?.url || car.image}
            variant="rounded"
            sx={{ width: 60, height: 60 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Contact Seller
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {car.company || car.carName} • ₹{car.price?.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sending as: <strong>{user?.name || user?.email}</strong>
            </Typography>
          </Box>

          <TextField
            name="message"
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Write your message to the seller..."
            InputProps={{
              startAdornment: (
                <Message
                  sx={{ color: "text.secondary", mr: 1, mt: 1, alignSelf: "flex-start" }}
                />
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            name="phone"
            label="Phone Number (Optional)"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number for quick contact"
            InputProps={{
              startAdornment: <Phone sx={{ color: "text.secondary", mr: 1 }} />,
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            The seller will receive your message via email and can respond to you directly.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={sendingInquiry || !formData.message.trim()}
            startIcon={
              sendingInquiry ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Send />
              )
            }
            sx={{
              bgcolor: "#F97316",
              "&:hover": { bgcolor: "#EA580C" },
            }}
          >
            {sendingInquiry ? "Sending..." : "Send Inquiry"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InquiryModal;
