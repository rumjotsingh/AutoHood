import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  CompareArrows,
  ArrowBack,
  Close,
  CheckCircle,
  Star,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { compareCars, clearComparison, removeFromComparison } from "../redux/slices/searchSlice";
import FavoriteButton from "../components/FavoriteButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ComparisonRow = ({ label, values, highlight }) => (
  <TableRow sx={{ "&:hover": { bgcolor: "action.hover" } }}>
    <TableCell
      sx={{
        fontWeight: 600,
        bgcolor: "#F8FAFC",
        color: "#0F172A",
        width: 180,
        position: "sticky",
        left: 0,
        zIndex: 1,
      }}
    >
      {label}
    </TableCell>
    {values.map((value, index) => (
      <TableCell
        key={index}
        align="center"
        sx={{
          bgcolor: highlight === index ? "#FFF7ED" : "inherit",
          fontWeight: highlight === index ? 600 : 400,
          color: highlight === index ? "#F97316" : "text.primary",
        }}
      >
        {value}
      </TableCell>
    ))}
  </TableRow>
);

ComparisonRow.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  highlight: PropTypes.number,
};

const Compare = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { comparisonList, comparisonData, comparisonInsights, compareLoading, error } = useSelector(
    (state) => state.search
  );

  // Get car IDs from URL or state
  const carIds = searchParams.get("carIds")?.split(",") || searchParams.get("ids")?.split(",") || comparisonList;
  const carIdsString = carIds.join(",");

  useEffect(() => {
    if (carIds.length >= 2) {
      dispatch(compareCars(carIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, carIdsString]);

  const handleRemoveCar = (carId) => {
    dispatch(removeFromComparison(carId));
    const newIds = carIds.filter((id) => id !== carId);
    if (newIds.length >= 2) {
      navigate(`/compare?ids=${newIds.join(",")}`);
    } else {
      navigate("/search");
    }
  };

  const handleClearAll = () => {
    dispatch(clearComparison());
    navigate("/search");
  };

  // Find best values for highlighting
  const findBestIndex = (values, type = "lowest") => {
    const numericValues = values.map((v) => {
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const num = parseFloat(v.replace(/[^0-9.-]/g, ""));
        return isNaN(num) ? null : num;
      }
      return null;
    });

    const validValues = numericValues.filter((v) => v !== null);
    if (validValues.length === 0) return -1;

    const targetValue = type === "lowest" ? Math.min(...validValues) : Math.max(...validValues);
    return numericValues.indexOf(targetValue);
  };

  if (carIds.length < 2) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, minHeight: '80vh' }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <CompareArrows sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Select at least 2 cars to compare
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add cars to your comparison list from the search or car details page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/search")}
              sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" } }}
            >
              Browse Cars
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  if (compareLoading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 4, minHeight: '80vh' }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={400} />
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, minHeight: '80vh' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button onClick={() => navigate("/search")}>Back to Search</Button>
        </Container>
        <Footer />
      </>
    );
  }

  const cars = comparisonData || [];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CompareArrows sx={{ fontSize: 32, color: "#F97316" }} />
              <Box>
                <Typography variant="h4" fontWeight={700} color="#0F172A">
                  Compare Cars
                </Typography>
                <Typography color="text.secondary">
                  Comparing {cars.length} cars side by side
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Close />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </Box>
        </Box>

        {/* Insights */}
        {comparisonInsights && cars.length > 0 && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: "#FFF7ED", border: "1px solid #FDBA74" }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#F97316" }}>
              <Star sx={{ mr: 1, verticalAlign: "middle" }} />
              Quick Insights
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {comparisonInsights.cheapest && (
                <Chip
                  label={`Cheapest: ${cars.find(c => c._id === comparisonInsights.cheapest)?.company || 'N/A'}`}
                  color="success"
                  icon={<CheckCircle />}
                />
              )}
              {comparisonInsights.mostExpensive && (
                <Chip
                  label={`Most Expensive: ${cars.find(c => c._id === comparisonInsights.mostExpensive)?.company || 'N/A'}`}
                  color="error"
                  icon={<CheckCircle />}
                />
              )}
              {comparisonInsights.bestMileage && (
                <Chip
                  label={`Best Mileage: ${cars.find(c => c._id === comparisonInsights.bestMileage)?.company || 'N/A'}`}
                  color="info"
                  icon={<CheckCircle />}
                />
              )}
              {comparisonInsights.highestRated && (
                <Chip
                  label={`Highest Rated: ${cars.find(c => c._id === comparisonInsights.highestRated)?.company || 'N/A'}`}
                  color="warning"
                  icon={<Star />}
                />
              )}
              {comparisonInsights.priceDifference > 0 && (
                <Chip
                  label={`Price Difference: ₹${comparisonInsights.priceDifference?.toLocaleString('en-IN')}`}
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        )}

        {/* Comparison Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table stickyHeader>
            {/* Car Headers */}
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#0F172A",
                    color: "white",
                    fontWeight: 600,
                    width: 180,
                  }}
                >
                  Specifications
                </TableCell>
                {cars.map((car) => (
                  <TableCell
                    key={car._id}
                    align="center"
                    sx={{
                      bgcolor: "#0F172A",
                      color: "white",
                      minWidth: 220,
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCar(car._id)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          color: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                          "&:hover": { bgcolor: "error.main" },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <Avatar
                        src={car.image?.url || car.image}
                        variant="rounded"
                        sx={{ width: 120, height: 80, mx: "auto", mb: 1 }}
                      />
                      <Typography fontWeight={600} noWrap>
                        {car.carName}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <FavoriteButton carId={car._id} size="small" />
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Price */}
              <ComparisonRow
                label="Price"
                values={cars.map((car) => `$${car.price?.toLocaleString()}`)}
                highlight={findBestIndex(cars.map((car) => car.price), "lowest")}
              />

              {/* Company */}
              <ComparisonRow
                label="Brand"
                values={cars.map((car) => car.company || "N/A")}
              />

              {/* Mileage */}
              <ComparisonRow
                label="Mileage"
                values={cars.map((car) =>
                  car.mileage ? `${car.mileage.toLocaleString()} mi` : "N/A"
                )}
                highlight={findBestIndex(cars.map((car) => car.mileage), "lowest")}
              />

              {/* Engine */}
              <ComparisonRow
                label="Engine Type"
                values={cars.map((car) => car.engine || "N/A")}
              />

              {/* Color */}
              <ComparisonRow
                label="Color"
                values={cars.map((car) => (
                  <Chip
                    key={car._id}
                    label={car.color || "N/A"}
                    size="small"
                    sx={{
                      bgcolor: car.color?.toLowerCase() || "#E2E8F0",
                      color:
                        ["white", "yellow", "beige"].includes(car.color?.toLowerCase())
                          ? "#000"
                          : "#fff",
                    }}
                  />
                ))}
              />

              {/* Fuel Type */}
              <ComparisonRow
                label="Fuel Type"
                values={cars.map((car) => car.fuelType || car.engine || "N/A")}
              />

              {/* Transmission */}
              <ComparisonRow
                label="Transmission"
                values={cars.map((car) => car.transmission || "N/A")}
              />

              {/* Location */}
              <ComparisonRow
                label="Location"
                values={cars.map((car) => car.location || "N/A")}
              />

              {/* Description */}
              <ComparisonRow
                label="Description"
                values={cars.map((car) => (
                  <Typography
                    key={car._id}
                    variant="caption"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {car.description || "No description available"}
                  </Typography>
                ))}
              />

              {/* Action Row */}
              <TableRow>
                <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 600 }}>
                  Actions
                </TableCell>
                {cars.map((car) => (
                  <TableCell key={car._id} align="center">
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/cars/${car._id}`)}
                      sx={{
                        bgcolor: "#F97316",
                        "&:hover": { bgcolor: "#EA580C" },
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
    <Footer />
    </>
  );
};

export default Compare;
