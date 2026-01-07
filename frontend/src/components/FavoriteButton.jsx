import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/slices/favoritesSlice";

const FavoriteButton = ({ carId, size = "medium", showTooltip = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favoriteIds = [], checkingFavorite = {} } = useSelector(
    (state) => state.favorites || {}
  );
  
  const isFavorite = favoriteIds.includes(carId);
  const isLoading = checkingFavorite[carId];

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFromFavorites(carId));
    } else {
      dispatch(addToFavorites(carId));
    }
  };

  const button = (
    <IconButton
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      sx={{
        color: isFavorite ? "error.main" : "text.secondary",
        bgcolor: "background.paper",
        boxShadow: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "background.paper",
          color: "error.main",
          transform: "scale(1.1)",
        },
      }}
    >
      {isLoading ? (
        <CircularProgress size={size === "small" ? 16 : 20} color="inherit" />
      ) : isFavorite ? (
        <Favorite fontSize={size} />
      ) : (
        <FavoriteBorder fontSize={size} />
      )}
    </IconButton>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip
      title={
        !isAuthenticated
          ? "Login to save"
          : isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
      arrow
    >
      {button}
    </Tooltip>
  );
};

export default FavoriteButton;
