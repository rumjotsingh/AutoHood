import  { useState } from "react";
import { Box, TextField, Button, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
      toast.warning("It Cannot Empty");
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
    }}
  >
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 3 : 3,
        justifyContent:"space-evenly",
        width: isMobile ? "100%" : "100%",
        borderRadius: 1,
        padding: isMobile ? 2 : 2,
      
      }}
    >
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for cars..."
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "5px",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size={isMobile ? "large" : "large"}
        startIcon={<SearchIcon className="h-3 w-3"/>}
        sx={{
         
          
          textTransform: "capitalize",
          borderRadius: "5px",
        }}
      >
        Search
      </Button>
    </Box>
  </Box>
  );
};
export default Search;
