import { Container, Row, Col } from "react-bootstrap";
import ChatList from "../Components/Chat/ChatList";
import ChatWindow from "../Components/Chat/ChatWindow";
import { ChatBot } from "../Components/Chatbot/ChatBot";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileView } from "react-device-detect";
import { motion } from "framer-motion";
import EmptyChat from "../Components/Chat/EmptyChat";
import { Link } from "react-router-dom";
import styles from "../Styles/Logo.module.css";

export default function Layout() {
  enum DeviceType {
    Ios = "ios",
    Android = "android",
  }
  const device = localStorage.getItem("deviceType") || "unknown";
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [chatListOpen, setChatListOpen] = useState(false);

  useEffect(() => {
    if (device === DeviceType.Android || device === DeviceType.Ios) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  // Function to open chat list from ChatWindow or ChatBot
  const openChatList = () => setTimeout(() => setChatListOpen(true), 100);
  const closeChatList = () => setTimeout(() => setChatListOpen(false), 100);



  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <Container
          fluid
          className="p-0"
          style={{
            height: "100vh",
            overflow: "hidden",
          }}
        >

          <Row className="h-100 g-0">
            <Col
              xs={3}
              className="border-end bg-light"
              style={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3  m-0 border-bottom" >
                <Link
                  to='/'
                  className="text-decoration-none text-success "
                  onClick={() => closeChatList}
                >
                  <h2 className={`${styles.fontdinerSwankyRegular} p-0 m-0`} >Easy Chat</h2>
                </Link>
              </div>
              <ChatList />
            </Col>
            <Col
              xs={9}
              style={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Routes>
                {/* Normal chats */}
                <Route path="chat/:id" element={<ChatWindow />} />
                {/* Chatbot */}
                <Route path="chatbot" element={<ChatBot />} />
                <Route path="/" element={<EmptyChat isMobile={isMobile} openChatList={openChatList} chatList={chatListOpen} />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileView>
          <Container
            fluid
            className="p-0"
            style={{
              position: "relative",
              height: "100dvh", // dynamic viewport height
              overflow: "hidden",
            }}
          >
            {/* Sliding Chat List */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: chatListOpen ? 0 : "-100%" }}
              transition={{ type: "tween", duration: 0.5 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100dvh", // exact mobile viewport height
                maxHeight: "100dvh",
                background: "white",
                borderRight: "1px solid #ddd",
                zIndex: 20,
                overflowY: "auto",
                boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <Link
                  to='/'
                  className="text-decoration-none text-success "
                  onClick={() => closeChatList}
                >
                  <h2 className={`${styles.fontdinerSwankyRegular} p-0 m-0`} >Easy Chat</h2>
                </Link>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={closeChatList}
                >
                  ✕
                </button>
              </div>
              <ChatList isMobile={isMobile} openChatList={closeChatList} chatList={chatListOpen} />
            </motion.div>

            {/* Full-screen Chat Window / ChatBot */}
            <div
              style={{
                width: "100%",
                height: "100dvh", // full dynamic height
                display: "flex",
                flexDirection: "column",
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <Routes>
                <Route path="/" element={<EmptyChat openChatList={openChatList} chatList={chatListOpen} isMobile={isMobile} />} />
                <Route
                  path="chat/:id"
                  element={
                    <ChatWindow
                      openChatList={openChatList}
                      chatList={chatListOpen}
                      isMobile={isMobile}
                    />
                  }
                />
                <Route path="chatbot" element={<ChatBot chatList={chatListOpen} openChatList={openChatList} isMobile={isMobile} />} />
              </Routes>
            </div>
          </Container>
        </MobileView>
      )}

    </>
  );
}
