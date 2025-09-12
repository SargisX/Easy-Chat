import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { login } from "../context/authService";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

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
      } else {
        if (data.token) {
          // Save to session storage
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId || "");
        }
        // Navigate to main chat page
        navigate("/Easy-Chat/");
      }
    } catch (err) {
      setStatus("❌ Something went wrong.");
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
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

        {/* Daily text / register suggestion */}
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
