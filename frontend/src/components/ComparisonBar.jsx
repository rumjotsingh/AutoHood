
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Slide,
} from "@mui/material";
import { Close, CompareArrows } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearComparison, removeFromComparison } from "../redux/slices/searchSlice";

const ComparisonBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { comparisonList } = useSelector((state) => state.search);
  const { cars } = useSelector((state) => state.cars);
  
  // Get car details for comparison list
  const comparisonCars = comparisonList
    .map((id) => cars.find((car) => car._id === id))
    .filter(Boolean);

  const handleCompare = () => {
    navigate(`/compare?carIds=${comparisonList.join(",")}`);
  };

  const handleRemove = (carId) => {
    dispatch(removeFromComparison(carId));
  };

  const handleClear = () => {
    dispatch(clearComparison());
  };

  if (comparisonList.length === 0) return null;

  return (
    <Slide direction="up" in={comparisonList.length > 0} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          p: 2,
          borderRadius: "16px 16px 0 0",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Title and count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CompareArrows sx={{ color: "#F97316" }} />
          <Typography sx={{ color: "white" }} variant="subtitle1" fontWeight={600}>
              Compare
            </Typography>
            <Chip
              label={`${comparisonList.length}/4`}
              size="small"
              sx={{
                bgcolor: "#F97316",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Center: Car thumbnails */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flex: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {comparisonCars.map((car) => (
              <Box
                key={car._id}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  p: 0.5,
                  pr: 1,
                }}
              >
                <Avatar
                  src={car.image?.url || car.image}
                  variant="rounded"
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
                  {car.carName}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemove(car._id)}
                  sx={{
                    color: "white",
                    p: 0.25,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 4 - comparisonList.length }).map((_, i) => (
              <Box
                key={`empty-${i}`}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  border: "2px dashed rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="rgba(255,255,255,0.5)">
                  +
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleCompare}
              disabled={comparisonList.length < 2}
              sx={{
                bgcolor: "#F97316",
                "&:hover": { bgcolor: "#EA580C" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(249, 115, 22, 0.5)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              Compare ({comparisonList.length})
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default ComparisonBar;
