import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { register } from "../API/authService";
import styles from "../Styles/Logo.module.css";
import { DeviceType } from "../utils/mobileCheck";

export default function Register({ deviceType }: { deviceType: DeviceType }) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();
  const isMobileDevice = deviceType == "android" || deviceType == "ios" ? true : false
  const logo = import.meta.env.VITE_EasyChat_Logo

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setStatus("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const data = await register(username, password);
      if (data.error) {
        setStatus(`❌ ${data.error}`);
      } else {
        setStatus(`✅ ${data.message}`);
        // After successful register → redirect to login page
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setStatus("❌ Something went wrong.");
    }
  }

  return (

    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
      className="d-flex flex-column justify-content-center align-items-center "
    >
      {/* Title */}
      <div className="text-center mb-5">
        <img src={logo} alt="logo" style={{ width: isMobileDevice? "3rem" : "10rem" ,height:'auto'}}/>
        <h2
          className={`${styles.fontdinerSwankyRegular} p-0 m-0 text-success`}
          style={{ fontSize: isMobileDevice ? "3rem" : "6rem" }}
        >
          Easy Chat
        </h2>
      </div>

      {/* Form container */}
      <Container
        style={{
          maxWidth: isMobileDevice ? "400px" : "600px",
          width: "100%",
        }}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h2 className="mb-4 text-center">Register</h2>

        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Register
          </Button>
        </Form>

        {status && <Alert variant="info" className="mt-3">{status}</Alert>}

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/Easy-Chat/login" className="fw-bold text-decoration-none">
            Login here
          </Link>
        </p>
      </Container>
    </div>




  );
}
