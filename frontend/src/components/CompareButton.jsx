import { IconButton, Tooltip } from "@mui/material";
import { CompareArrows, Check } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  addToComparison,
  removeFromComparison,
} from "../redux/slices/searchSlice";

const CompareButton = ({ carId, size = "medium", showTooltip = true }) => {
  const dispatch = useDispatch();
  
  const { comparisonList } = useSelector((state) => state.search);
  
  const isInComparison = comparisonList.includes(carId);
  const isFull = comparisonList.length >= 4;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInComparison) {
      dispatch(removeFromComparison(carId));
    } else if (!isFull) {
      dispatch(addToComparison(carId));
    }
  };

  const button = (
    <IconButton
      onClick={handleClick}
      disabled={isFull && !isInComparison}
      size={size}
      sx={{
        color: isInComparison ? "primary.main" : "text.secondary",
        bgcolor: "background.paper",
        boxShadow: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "background.paper",
          color: "primary.main",
          transform: "scale(1.1)",
        },
        "&.Mui-disabled": {
          bgcolor: "action.disabledBackground",
        },
      }}
    >
      {isInComparison ? (
        <Check fontSize={size} color="primary" />
      ) : (
        <CompareArrows fontSize={size} />
      )}
    </IconButton>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip
      title={
        isInComparison
          ? "Remove from comparison"
          : isFull
          ? "Comparison list is full (max 4)"
          : "Add to comparison"
      }
      arrow
    >
      <span>{button}</span>
    </Tooltip>
  );
};

CompareButton.propTypes = {
  carId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  showTooltip: PropTypes.bool,
};

export default CompareButton;
