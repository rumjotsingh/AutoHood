import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import About from './pages/About';
import Policy from './pages/Policy';
import Contact from "./pages/Contact";
import Register from './pages/Register';
import PageNotFound from "./pages/PageNotFound";
import CarsForm from "./Forms/CarsForm";
import CarsDetailed from './pages/CarsDetailed';
import { ToastContainer } from "react-toastify";
import EditPage from './pages/EditPage';
import Result from './pages/Result';
import CarLoanCalculator from "./pages/CarLoanCalc";
import Success from "./pages/Sucess";
import Cancel from "./pages/Cancel";
const App = () => {
   return(
  
    <BrowserRouter>
    <ToastContainer/>
    <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/add-car" element={<CarsForm/>}></Route>
        <Route path="/cars/:id" element={<CarsDetailed/>}></Route>
        <Route path="/cars/payment/:id/success" element={<Success/>} ></Route>
        <Route path="/cars/payment/:id/cancel" element={<Cancel/>} ></Route>
        <Route path="/edit/:id" element={<EditPage/>}></Route>
        <Route path="/car-loan/:id" element={<CarLoanCalculator />}></Route>
        <Route path="/policy" element={<Policy/>}></Route>
        <Route path="/contact" element={<Contact/>}></Route>
        <Route path="/results" element={<Result/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="*" element={<PageNotFound/>}></Route>
      </Routes>
    </BrowserRouter>
    // cars/payment/${id}/cancel
  
  )
};
export default App;
