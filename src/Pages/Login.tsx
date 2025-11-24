import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { login } from "../API/authService";
import { UserStatus } from "../types/user";
import { updateUserStatus } from "../API/usersApi";
import { initTabSession } from "../utils/authSync";
import styles from "../Styles/Logo.module.css";
import { DeviceType } from "../utils/mobileCheck";

export default function Login({ deviceType }: { deviceType: DeviceType }) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();
  const isMobileDevice = deviceType == "android" || deviceType == "ios" ? true : false

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username || !password) {
      setStatus("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const data = await login(username, password);

      if (data.error) {
        setStatus(`❌ ${data.error}`);
        return;
      }

      if (data.token && data.userId) {
        // PERSIST login across all tabs
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);


        // PER-TAB session ID
        initTabSession()
        sessionStorage.setItem('sessionTime', Date.now().toString())
        // Sync login event across tabs
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "login" });

        await updateUserStatus(data.userId, UserStatus.ONLINE);
      }

      navigate("/Easy-Chat/");

    } catch (err) {
      setStatus("❌ Something went wrong.");
    }
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      {/* Title */}
      <div className="text-center mb-5">
        <h2
          className={`${styles.fontdinerSwankyRegular} p-0 m-0 text-success`}
          style={{ fontSize: isMobileDevice? "4rem" : "6rem" }}
        >
          Easy Chat
        </h2>
      </div>

      {/* Login Form */}
      <div style={{ maxWidth: isMobileDevice ? "400px" : "600px", width: "100%" }}>
        <h2 className="mb-4 text-center">Login</h2>

        <Form onSubmit={handleSubmit}>
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

          <Button type="submit" variant="success" className="w-100">
            Login
          </Button>
        </Form>

        {status && <Alert variant="info" className="mt-3">{status}</Alert>}

        <p className="mt-3 text-center">
          Not registered yet?{" "}
          <Link to="/Easy-Chat/register" className="fw-bold text-decoration-none">
            Create an account
          </Link>
        </p>
      </div>
    </Container>

  );
}
