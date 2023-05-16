import { useState, useEffect } from "react";
import { Nav, Navbar, NavLink } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import logo from "../../logo.png";

const NavigationBar = () => {
  const [displayUserName, setDisplayUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/register") {
      setShowMenu(false);
    } else {
      setShowMenu(true);
      let userName = sessionStorage.getItem("userName");
      if (userName === "" || userName === null) {
        navigate("/");
      } else {
        setDisplayUserName(userName);
      }
    }
  }, [location, navigate]);

  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      &nbsp;&nbsp;&nbsp;
      {/* <Navbar.Toggle
        aria-controls="navbarScroll"
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
      />
      <Navbar.Brand href="/">
        <img
          alt=""
          src={logo}
          width="50"
          height="30"
          className="d-inline-block align-top"
        />
      </Navbar.Brand> */}
      <Navbar.Collapse id="navbarScroll">
        {showMenu && (
          <Nav>
            <NavLink eventKey="1" as={Link} to="/ProductionSheet">
              Home
            </NavLink>
            <NavLink eventKey="2" as={Link} to="/CardbordPalletInventary">
              CardBord Pallet
            </NavLink>
            <NavLink eventKey="3" as={Link} to="/BoxSize">
              Box Size
            </NavLink>
          </Nav>
        )}
      </Navbar.Collapse>
      {/* <Navbar.Toggle /> */}
      {showMenu && (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="/">{displayUserName}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      )}
      &nbsp;&nbsp;&nbsp;
    </Navbar>
  );
};

export default NavigationBar;
