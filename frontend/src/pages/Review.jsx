import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Paper,
  Fade,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Send, Star, RateReview, Edit } from "@mui/icons-material";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const ReviewsForm = ({ refresh }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const { id } = useParams();

  const handleSubmit = async () => {
    if (rating && review.trim()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to submit a review");
          setLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.REVIEWS.CREATE(id), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carListingId: id,
            rating,
            comment: review,
          }),
        });

        if (response.status === 200) {
          toast.success("Review submitted successfully!");
          refresh();
          setRating(0);
          setReview("");
        } else {
          toast.error("Failed to submit review");
        }
      } catch (error) {
        console.error("Error:", error.message);
        toast.error("An error occurred while submitting the review.");
      }
      setLoading(false);
    } else {
      toast.error("Please provide a rating and a review description.");
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: '24px',
          bgcolor: 'white',
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: '#F97316',
            boxShadow: '0 12px 40px rgba(249, 115, 22, 0.1)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)',
            }}
          >
            <RateReview sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography 
            variant="h4" 
            fontWeight={700}
            color="#0F172A"
            sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
          >
            Share Your Experience
          </Typography>
          <Typography variant="body1" color="#64748B" sx={{ mt: 1 }}>
            Your feedback helps others make better decisions
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* Rating Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600} color="#0F172A" gutterBottom>
              How would you rate this car?
            </Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Rating
                name="review-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                onChangeActive={(event, newHover) => setHoveredRating(newHover)}
                size="large"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  "& .MuiRating-iconFilled": {
                    color: '#F97316',
                  },
                  "& .MuiRating-iconHover": {
                    color: '#FB923C',
                  },
                  "& .MuiRating-iconEmpty": {
                    color: '#E2E8F0',
                  },
                }}
              />
            </Box>
            {rating !== null && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#F97316',
                  fontWeight: 600,
                  minHeight: 24,
                }}
              >
                {ratingLabels[hoveredRating !== -1 ? hoveredRating : rating] || 'Select a rating'}
              </Typography>
            )}
          </Box>

          {/* Review Text */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#0F172A" mb={1.5}>
              Write your review
            </Typography>
            <TextField
              variant="outlined"
              multiline
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              fullWidth
              placeholder="Share your thoughts about this car... What did you like? What could be better?"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <Edit sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: '14px',
                  bgcolor: '#F8FAFC',
                  transition: 'all 0.3s',
                  "& fieldset": {
                    borderColor: '#E2E8F0',
                  },
                  "&:hover fieldset": {
                    borderColor: '#F97316',
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: '#F97316',
                    borderWidth: 2,
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Typography variant="caption" color="#94A3B8">
                {review.length}/500 characters
              </Typography>
            </Box>
          </Box>

          {/* Submit Button */}
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            startIcon={!loading && <Send />}
            fullWidth
            disabled={loading || !rating || !review.trim()}
            sx={{
              py: 1.75,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
              transition: 'all 0.3s',
              "&:hover": {
                background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
              },
              "&:disabled": {
                background: '#E2E8F0',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>

          {/* Helper Text */}
          <Typography 
            variant="caption" 
            color="#94A3B8" 
            sx={{ 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            <Star sx={{ fontSize: 14 }} />
            Your review will be visible to other users after submission
          </Typography>
        </Stack>
      </Paper>
    </Fade>
  );
};

ReviewsForm.propTypes = {
  refresh: PropTypes.func.isRequired,
};

export default ReviewsForm;
