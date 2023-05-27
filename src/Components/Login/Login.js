import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [validatedLogin, setValidatedLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const ProceedLogin = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      setValidatedLogin(false);
      let user = { userName: userName, password: password };
      fetch(process.env.REACT_APP_API_BASE_URL + "/Auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          if (resp.isAuthorized === false) {
            toast.error(resp.message);
          } else {
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("token", resp.message);
            navigate("/ProductionSheet");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Login Failed due to :" + err.message);
        });
    } else {
      setValidatedLogin(true);
    }
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="offset-lg-4 col-lg-4" style={{ marginTop: "100px" }}>
        <Form
          noValidate
          validated={validatedLogin}
          onSubmit={ProceedLogin}
          className="container"
        >
          <div className="card">
            <div className="card-header">
              <h2>Sign in</h2>
            </div>
            <div className="card-body">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom01">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    placeholder="Enter User Name"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid User Name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom02">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Password.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Enter
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
