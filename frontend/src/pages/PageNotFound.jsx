import { useNavigate } from "react-router-dom";
import "../styles/PageNotFound.css"
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';
const PageNotFound = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
return (
    <>
    <Navbar/>
    <div className="page-not-found">
      <div className="content">
        <h1>404</h1>
        <p>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <p className="subtext">
          Maybe it was moved, deleted, or never existed in the first place.
        </p>
        <button onClick={goHome} className="home-btn">
          Take Me Home
        </button>
      </div>
      <div className="illustration">
        <img src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg" alt="Page Not Found" />
      </div>
    </div>
    <br></br>
    <Footer/>
    </>
  );
};
export default PageNotFound;
