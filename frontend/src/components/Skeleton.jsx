import { Box, Skeleton as MuiSkeleton, Card, CardContent, Grid, Stack } from "@mui/material";
import PropTypes from "prop-types";

// Car Card Skeleton
export const CarCardSkeleton = () => (
  <Card
    sx={{
      height: "100%",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #E2E8F0",
    }}
  >
    <MuiSkeleton
      variant="rectangular"
      height={220}
      animation="wave"
      sx={{ bgcolor: "#E2E8F0" }}
    />
    <CardContent sx={{ p: 3 }}>
      <MuiSkeleton
        variant="text"
        width="70%"
        height={28}
        animation="wave"
        sx={{ mb: 1, bgcolor: "#E2E8F0" }}
      />
      <MuiSkeleton
        variant="text"
        width="100%"
        height={20}
        animation="wave"
        sx={{ mb: 0.5, bgcolor: "#E2E8F0" }}
      />
      <MuiSkeleton
        variant="text"
        width="85%"
        height={20}
        animation="wave"
        sx={{ mb: 2, bgcolor: "#E2E8F0" }}
      />
      <Stack direction="row" spacing={1}>
        <MuiSkeleton
          variant="rounded"
          width={70}
          height={24}
          animation="wave"
          sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
        />
        <MuiSkeleton
          variant="rounded"
          width={70}
          height={24}
          animation="wave"
          sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
        />
        <MuiSkeleton
          variant="rounded"
          width={70}
          height={24}
          animation="wave"
          sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
        />
      </Stack>
    </CardContent>
  </Card>
);

// Car Grid Skeleton - Multiple Cards
export const CarGridSkeleton = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {[...Array(count)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <CarCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

// Car Detail Skeleton
export const CarDetailSkeleton = () => (
  <Box>
    {/* Image Section */}
    <MuiSkeleton
      variant="rectangular"
      height={400}
      animation="wave"
      sx={{ borderRadius: "20px", mb: 4, bgcolor: "#E2E8F0" }}
    />

    <Grid container spacing={4}>
      {/* Left Column */}
      <Grid item xs={12} md={8}>
        {/* Title & Badges */}
        <MuiSkeleton
          variant="text"
          width="60%"
          height={48}
          animation="wave"
          sx={{ mb: 2, bgcolor: "#E2E8F0" }}
        />

        {/* Specs Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <MuiSkeleton
                variant="rounded"
                height={100}
                animation="wave"
                sx={{ borderRadius: "16px", bgcolor: "#E2E8F0" }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Description */}
        <MuiSkeleton
          variant="text"
          width="30%"
          height={32}
          animation="wave"
          sx={{ mb: 2, bgcolor: "#E2E8F0" }}
        />
        {[...Array(4)].map((_, i) => (
          <MuiSkeleton
            key={i}
            variant="text"
            width={i === 3 ? "60%" : "100%"}
            height={20}
            animation="wave"
            sx={{ mb: 1, bgcolor: "#E2E8F0" }}
          />
        ))}
      </Grid>

      {/* Right Column - Price Card */}
      <Grid item xs={12} md={4}>
        <MuiSkeleton
          variant="rounded"
          height={300}
          animation="wave"
          sx={{ borderRadius: "20px", bgcolor: "#E2E8F0" }}
        />
      </Grid>
    </Grid>
  </Box>
);

// Form Skeleton
export const FormSkeleton = () => (
  <Box>
    <MuiSkeleton
      variant="text"
      width="40%"
      height={40}
      animation="wave"
      sx={{ mb: 3, bgcolor: "#E2E8F0" }}
    />
    <Grid container spacing={3}>
      {[...Array(6)].map((_, i) => (
        <Grid item xs={12} sm={6} key={i}>
          <MuiSkeleton
            variant="rounded"
            height={56}
            animation="wave"
            sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <MuiSkeleton
          variant="rounded"
          height={120}
          animation="wave"
          sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <MuiSkeleton
          variant="rounded"
          height={56}
          width="30%"
          animation="wave"
          sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
        />
      </Grid>
    </Grid>
  </Box>
);

// Stats Skeleton
export const StatsSkeleton = ({ count = 4 }) => (
  <Grid container spacing={3}>
    {[...Array(count)].map((_, i) => (
      <Grid item xs={6} md={3} key={i}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
          <MuiSkeleton
            variant="rounded"
            width={50}
            height={50}
            animation="wave"
            sx={{ borderRadius: "12px", bgcolor: "#E2E8F0" }}
          />
          <Box sx={{ flex: 1 }}>
            <MuiSkeleton
              variant="text"
              width="70%"
              height={28}
              animation="wave"
              sx={{ bgcolor: "#E2E8F0" }}
            />
            <MuiSkeleton
              variant="text"
              width="50%"
              height={18}
              animation="wave"
              sx={{ bgcolor: "#E2E8F0" }}
            />
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <Box
    sx={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      py: { xs: 8, md: 12 },
    }}
  >
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 3 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <MuiSkeleton
            variant="rounded"
            width={180}
            height={32}
            animation="wave"
            sx={{ mb: 3, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <MuiSkeleton
            variant="text"
            width="90%"
            height={60}
            animation="wave"
            sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <MuiSkeleton
            variant="text"
            width="70%"
            height={60}
            animation="wave"
            sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <MuiSkeleton
            variant="text"
            width="80%"
            height={24}
            animation="wave"
            sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <MuiSkeleton
            variant="text"
            width="60%"
            height={24}
            animation="wave"
            sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Stack direction="row" spacing={2}>
            <MuiSkeleton
              variant="rounded"
              width={140}
              height={52}
              animation="wave"
              sx={{ borderRadius: "14px", bgcolor: "rgba(255,255,255,0.1)" }}
            />
            <MuiSkeleton
              variant="rounded"
              width={140}
              height={52}
              animation="wave"
              sx={{ borderRadius: "14px", bgcolor: "rgba(255,255,255,0.1)" }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }}>
          <MuiSkeleton
            variant="rounded"
            height={300}
            animation="wave"
            sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.1)" }}
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

// Review Card Skeleton
export const ReviewCardSkeleton = () => (
  <Box
    sx={{
      p: 3,
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
      bgcolor: "white",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <MuiSkeleton
        variant="circular"
        width={48}
        height={48}
        animation="wave"
        sx={{ bgcolor: "#E2E8F0" }}
      />
      <Box sx={{ flex: 1 }}>
        <MuiSkeleton
          variant="text"
          width="40%"
          height={24}
          animation="wave"
          sx={{ bgcolor: "#E2E8F0" }}
        />
        <MuiSkeleton
          variant="text"
          width="60%"
          height={18}
          animation="wave"
          sx={{ bgcolor: "#E2E8F0" }}
        />
      </Box>
    </Box>
    <MuiSkeleton
      variant="text"
      width="100%"
      height={20}
      animation="wave"
      sx={{ mb: 0.5, bgcolor: "#E2E8F0" }}
    />
    <MuiSkeleton
      variant="text"
      width="85%"
      height={20}
      animation="wave"
      sx={{ bgcolor: "#E2E8F0" }}
    />
  </Box>
);

// Text Block Skeleton
export const TextBlockSkeleton = ({ lines = 4 }) => (
  <Box>
    {[...Array(lines)].map((_, i) => (
      <MuiSkeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? "60%" : "100%"}
        height={20}
        animation="wave"
        sx={{ mb: 1, bgcolor: "#E2E8F0" }}
      />
    ))}
  </Box>
);

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <Box
    sx={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      py: { xs: 8, md: 10 },
      textAlign: "center",
    }}
  >
    <Box sx={{ maxWidth: 700, mx: "auto", px: 3 }}>
      <MuiSkeleton
        variant="rounded"
        width={120}
        height={32}
        animation="wave"
        sx={{ mx: "auto", mb: 3, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.1)" }}
      />
      <MuiSkeleton
        variant="text"
        width="80%"
        height={50}
        animation="wave"
        sx={{ mx: "auto", mb: 2, bgcolor: "rgba(255,255,255,0.1)" }}
      />
      <MuiSkeleton
        variant="text"
        width="60%"
        height={24}
        animation="wave"
        sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.1)" }}
      />
    </Box>
  </Box>
);

// PropTypes
CarGridSkeleton.propTypes = {
  count: PropTypes.number,
};

StatsSkeleton.propTypes = {
  count: PropTypes.number,
};

TextBlockSkeleton.propTypes = {
  lines: PropTypes.number,
};

export default {
  CarCardSkeleton,
  CarGridSkeleton,
  CarDetailSkeleton,
  FormSkeleton,
  StatsSkeleton,
  HeroSkeleton,
  ReviewCardSkeleton,
  TextBlockSkeleton,
  PageHeaderSkeleton,
};
