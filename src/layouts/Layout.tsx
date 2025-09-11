import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import ChatList from "../Components/ChatList";
import EmptyChat from "../Components/EmptyChat";
import ChatWindow from "../Components/ChatWindow";

export default function Layouta() {
  return (
    <Container fluid>
      <Row>
        <Col xs={3} md={3} className="p-0 bg-light">
          <ChatList />
        </Col>
        <Col xs={9} md={9} className="p-0" style={{ height: "100vh" }}>
          <Routes>
            <Route path="/Easy-Chat" element={<EmptyChat />} />
            <Route path="/Easy-Chat/chat/:id" element={<ChatWindow />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}
