import { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  useMediaQuery, 
  useTheme,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      toast.warning("Please enter a search term");
      return;
    }
    navigate(`/results`, { state: { searchTerm } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 700,
          p: 1,
          borderRadius: "16px",
          bgcolor: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            borderColor: "#F97316",
          },
          "&:focus-within": {
            boxShadow: "0 8px 30px rgba(249, 115, 22, 0.15)",
            borderColor: "#F97316",
          },
        }}
      >
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by brand, model, or type..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8", fontSize: 24, ml: 1 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-input": {
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 500,
              color: "#0F172A",
              "&::placeholder": {
                color: "#94A3B8",
                opacity: 1,
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            px: isMobile ? 3 : 4,
            py: 1.5,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
            transition: "all 0.3s",
            "&:hover": {
              background: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px rgba(249, 115, 22, 0.4)",
            },
          }}
        >
          Search
        </Button>
      </Paper>
    </Box>
  );
};

export default Search;
