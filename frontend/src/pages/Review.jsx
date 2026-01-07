import  {  useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Paper,
  Fade,
  Zoom,
} from "@mui/material";
import { Send, Star } from "@mui/icons-material";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const ReviewsForm = ({refresh}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  
  const { id } = useParams();

  const handleSubmit = async () => {
    if (rating && review.trim()) {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage or wherever it is stored
        if (!token) {
          toast.error("You must me logged");
          return;
        }
  
        const response = await fetch(API_ENDPOINTS.REVIEWS.CREATE.replace(':id', id), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carListingId:id,
            rating,
            comment: review, // Assuming your API expects `description` for the review content
          }),
        });
      
        if (response.status===200) {
        
          toast.success("The review added sucessfully");
          refresh()
           
          setRating(0); // Reset the form
          setReview("");
        } else {
           toast.error("Failed to Submit ");
        }
      } catch (error) {
        console.error("Error:", error.message);
        toast.error("An error occurred while submitting the review.");
      }
    } else {
      toast.error("Please provide a rating and a review description.");
    }
  };
  


  return (
    <Box sx={{ mt: 6 }}>
      <Fade in timeout={800}>
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
            border: "2px solid",
            borderColor: "rgba(102, 126, 234, 0.2)",
            transition: "all 0.3s",
            "&:hover": {
              borderColor: "rgba(102, 126, 234, 0.4)",
              boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
            },
          }}
        >
          <Box textAlign="center" mb={4}>
            <Zoom in timeout={1000}>
              <Star sx={{ fontSize: 50, color: "#667eea", mb: 2 }} />
            </Zoom>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Share Your Experience
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your feedback helps others make better decisions
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom fontWeight="600">
                How would you rate this car?
              </Typography>
              <Rating
                name="review-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  "& .MuiRating-iconFilled": {
                    color: "#667eea",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#764ba2",
                  },
                }}
              />
            </Box>

            <TextField
              label="Your Review"
              variant="outlined"
              multiline
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              fullWidth
              placeholder="Tell us about your experience with this car..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  },
                },
              }}
            />

            <Button 
              variant="contained" 
              onClick={handleSubmit}
              startIcon={<Send />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              Submit Review
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};
ReviewsForm.propTypes = {
  refresh: PropTypes.func.isRequired,
};


export default ReviewsForm;
