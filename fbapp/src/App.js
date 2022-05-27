import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Contactus from "./components/Contactus";
import { useSelector, useDispatch } from "react-redux";
import { clearLoginStatus } from "./slices/userSlice";
import { useNavigate } from "react-router-dom";
import UserDashboard from "./components/useDashboard/UserDashboard"
function App() {
  let dispatch = useDispatch();
  let { userObj, isError, isLoading, isSuccess, errMsg } = useSelector(
    (state) => state.user
  );

  let navigate = useNavigate();
  const userLogout = () => {
    localStorage.clear();
    dispatch(clearLoginStatus());
    navigate("/login");
  };
  return (
    <div>
      
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end">
             {isSuccess!==true?(          
            
                <>
                <NavLink className="nav-link" to="">
                  Home
                </NavLink>

                <NavLink className="nav-link" to="Login">
                  Login
                </NavLink>

                <NavLink className="nav-link" to="SignUp">
                  SignUp
                </NavLink>

                <NavLink className="nav-link" to="Contactus">
                  ContactUs
                </NavLink>
                </>
             ):(
                    
            <>
            
              <NavDropdown title={userObj.username} id="nav-dropdown">
                <NavDropdown.Item onClick={userLogout}>Logout</NavDropdown.Item>
                <NavDropdown.Item >
                changepassword bhavik
                </NavDropdown.Item>
              </NavDropdown>
            </>
             )}
            </Nav>      
            </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Contactus" element={<Contactus />} />
        <Route path="/UserDashboard" element={<UserDashboard/>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
