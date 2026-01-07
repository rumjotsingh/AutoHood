import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
  Badge,
} from "@mui/material";
import {
  Inbox,
  Send,
  Reply,
  MarkEmailRead,
  DirectionsCar,
  ArrowBack,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSentInquiries,
  fetchReceivedInquiries,
  replyToInquiry,
  markAsRead,
  clearError,
  clearSuccessMessage,
} from "../redux/slices/inquiriesSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const InquiryCard = ({ inquiry, type, onReply, onMarkRead, onViewCar }) => {
  const isReceived = type === "received";
  const isPending = inquiry.status === "pending";

  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        borderLeft: isPending && isReceived ? "4px solid #F97316" : "none",
        opacity: inquiry.status === "read" && isReceived ? 0.8 : 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor: isReceived ? "#F97316" : "#0F172A",
            width: 48,
            height: 48,
          }}
        >
          {isReceived
            ? inquiry.sender?.name?.[0] || "U"
            : inquiry.receiver?.name?.[0] || "S"}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {isReceived ? inquiry.sender?.name : inquiry.receiver?.name || "Seller"}
            </Typography>
            <Chip
              label={inquiry.status}
              size="small"
              color={
                inquiry.status === "pending"
                  ? "warning"
                  : inquiry.status === "replied"
                  ? "success"
                  : "default"
              }
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
              {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          {/* Car Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              p: 1,
              bgcolor: "#F8FAFC",
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={() => onViewCar(inquiry.car?._id)}
          >
            <Avatar
              src={inquiry.car?.image?.url || inquiry.car?.image}
              variant="rounded"
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {inquiry.car?.company || "Unknown Car"}
              </Typography>
              <Typography variant="caption" color="#F97316">
                ₹{inquiry.car?.price?.toLocaleString('en-IN')}
              </Typography>
            </Box>
            <DirectionsCar sx={{ ml: "auto", color: "text.secondary" }} />
          </Box>

          {/* Message */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            {inquiry.message}
          </Typography>

          {/* Phone */}
          {inquiry.phone && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              📞 {inquiry.phone}
            </Typography>
          )}

          {/* Reply (if exists) */}
          {inquiry.reply && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#F0FDF4",
                borderRadius: 2,
                borderLeft: "3px solid #22C55E",
                mb: 2,
              }}
            >
              <Typography variant="caption" color="success.main" fontWeight={600}>
                Reply from {isReceived ? "You" : "Seller"}:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {inquiry.reply}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {inquiry.repliedAt &&
                  new Date(inquiry.repliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          {isReceived && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {isPending && (
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={() => onMarkRead(inquiry._id)}
                >
                  Mark as Read
                </Button>
              )}
              {!inquiry.reply && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Reply />}
                  onClick={() => onReply(inquiry)}
                  sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
                >
                  Reply
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

InquiryCard.propTypes = {
  inquiry: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
    phone: PropTypes.string,
    reply: PropTypes.string,
    repliedAt: PropTypes.string,
    createdAt: PropTypes.string,
    sender: PropTypes.shape({
      name: PropTypes.string,
    }),
    receiver: PropTypes.shape({
      name: PropTypes.string,
    }),
    car: PropTypes.shape({
      _id: PropTypes.string,
      company: PropTypes.string,
      price: PropTypes.number,
      image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string,
        }),
      ]),
    }),
  }).isRequired,
  type: PropTypes.oneOf(["sent", "received"]).isRequired,
  onReply: PropTypes.func.isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onViewCar: PropTypes.func.isRequired,
};

const Inquiries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    sentInquiries,
    receivedInquiries,
    loadingSent,
    loadingReceived,
    error,
    successMessage,
    unreadCount,
  } = useSelector((state) => state.inquiries);

  const [tab, setTab] = useState(0);
  const [replyDialog, setReplyDialog] = useState({ open: false, inquiry: null });
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSentInquiries());
      dispatch(fetchReceivedInquiries());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => dispatch(clearSuccessMessage()), 3000);
    }
  }, [successMessage, dispatch]);

  const handleReply = (inquiry) => {
    setReplyDialog({ open: true, inquiry });
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    await dispatch(
      replyToInquiry({
        inquiryId: replyDialog.inquiry._id,
        reply: replyText,
      })
    );
    setReplyDialog({ open: false, inquiry: null });
    setReplyText("");
  };

  const handleMarkRead = (inquiryId) => {
    dispatch(markAsRead(inquiryId));
  };

  const handleViewCar = (carId) => {
    if (carId) navigate(`/cars/${carId}`);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Inbox sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign in to view your messages
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Sign In
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  const isLoading = tab === 0 ? loadingReceived : loadingSent;

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
              Back
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Inbox sx={{ fontSize: 32, color: "#F97316" }} />
              <Box>
                <Typography variant="h4" fontWeight={700} color="#0F172A">
                  Messages
                </Typography>
                <Typography color="text.secondary">
                  Manage your inquiries and responses
                </Typography>
              </Box>
            </Box>
          </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": { fontWeight: 600 },
              "& .Mui-selected": { color: "#F97316" },
              "& .MuiTabs-indicator": { bgcolor: "#F97316" },
            }}
          >
            <Tab
              icon={
                <Badge badgeContent={unreadCount} color="error">
                  <Inbox />
                </Badge>
              }
              iconPosition="start"
              label="Received"
            />
            <Tab icon={<Send />} iconPosition="start" label="Sent" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tab} index={0}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={180} sx={{ mb: 2 }} />
            ))
          ) : receivedInquiries.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Inbox sx={{ fontSize: 64, color: "#E2E8F0", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No inquiries received yet
              </Typography>
              <Typography color="text.secondary">
                When buyers contact you about your listings, their messages will appear here.
              </Typography>
            </Paper>
          ) : (
            receivedInquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry._id}
                inquiry={inquiry}
                type="received"
                onReply={handleReply}
                onMarkRead={handleMarkRead}
                onViewCar={handleViewCar}
              />
            ))
          )}
        </TabPanel>

        <TabPanel value={tab} index={1}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={180} sx={{ mb: 2 }} />
            ))
          ) : sentInquiries.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Send sx={{ fontSize: 64, color: "#E2E8F0", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No inquiries sent yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                When you contact sellers about their cars, your messages will appear here.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/search")}
                sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
              >
                Browse Cars
              </Button>
            </Paper>
          ) : (
            sentInquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry._id}
                inquiry={inquiry}
                type="sent"
                onReply={handleReply}
                onMarkRead={handleMarkRead}
                onViewCar={handleViewCar}
              />
            ))
          )}
        </TabPanel>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialog.open}
          onClose={() => setReplyDialog({ open: false, inquiry: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Reply to {replyDialog.inquiry?.sender?.name}
            <IconButton
              onClick={() => setReplyDialog({ open: false, inquiry: null })}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Original message: &quot;{replyDialog.inquiry?.message}&quot;
            </Typography>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              label="Your Reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialog({ open: false, inquiry: null })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Inquiries;
