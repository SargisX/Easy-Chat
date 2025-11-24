import { useContext, useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Button } from "react-bootstrap";
import ChatItem from "./ChatItem";
import { userCache } from "../../utils/userCache";
import { deleteChat, getChatsByUserId } from "../../API/chatApi";
import { Chat, Message } from "../../types/chat";
import { User } from "../../types/user";
import AddChatPanel from "./AddChatPanel";
import { getUserById } from "../../API/usersApi";
import { ChatContext } from "../../context/chatContext";
import { ActionTypes } from "../../context/types";
import { useNavigate } from "react-router-dom";
import ProfileBox from "../Profile/ProfileBox";
import ProfilePopup from "../Profile/ProfilePopup";
import ProfileEditPanel from "../Profile/ProfileEditPanel"; // ✅ new component
import { getMessageById } from "../../API/messageApi";
import ChatBotButton from "../Chatbot/ChatBotButton";
import { useSwipeToggle } from "../../hooks/useSwipeToggle";

interface ListType {
  openChatList?: () => void
  chatList?: any
  isMobile?: boolean
}

export default function ChatList({ isMobile, openChatList, chatList }: ListType) {
  const ctx = useContext(ChatContext);
  if (!ctx) return null;
  const { state, dispatch } = ctx;
  const { chats } = state;


  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);

  const currentUserId = localStorage.getItem("userId") || "";
  const [currentUser, setCurrentUser] = useState<User>({} as User);

  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false); // ✅ new state

  const [lastMessages, setLastMessages] = useState<Record<string, Message | undefined>>({});



  const swipe = useSwipeToggle({
    isOpen: chatList,
    setOpen: openChatList!
  });

  useEffect(() => {
    let mounted = true;

    async function fetchChatsAndUsers() {
      try {
        // Always load current user FIRST
        const me = await getUserById(currentUserId);
        if (!mounted) return;
        setCurrentUser(me);

        const chatData = await getChatsByUserId(currentUserId);
        if (!mounted) return;

        dispatch({ type: ActionTypes.SET_CHATS, payload: chatData });

        const fetchedUsers: Record<string, User> = {};

        await Promise.all(
          chatData.map(async (chat) => {
            const otherUserId =
              chat.senderId === currentUserId ? chat.receiverId : chat.senderId;

            if (!otherUserId) return;

            let user: User;
            if (userCache[otherUserId]) {
              user = userCache[otherUserId];
            } else {
              user = await getUserById(otherUserId);
              userCache[otherUserId] = user;
              dispatch({ type: ActionTypes.UPDATE_USER, payload: user });
            }

            fetchedUsers[otherUserId] = user;

            if (chat.lastMessageId) {
              try {
                const msg = await getMessageById(chat.lastMessageId);
                setLastMessages((prev) => ({ ...prev, [chat.id]: msg }));
              } catch {
                setLastMessages((prev) => ({ ...prev, [chat.id]: undefined }));
              }
            } else {
              setLastMessages((prev) => ({ ...prev, [chat.id]: undefined }));
            }
          })
        );

        if (mounted) setUsers(fetchedUsers);

      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load chats.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchChatsAndUsers();

    return () => {
      mounted = false;
    };
  }, [dispatch, currentUserId, chats.length]);


  async function handleDeleteChat(chatId: string) {
    try {
      await deleteChat(chatId);
      dispatch({ type: ActionTypes.REMOVE_CHAT, payload: chatId });
      navigate("/");
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );

  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <div
          className="h-100 border-end bg-white position-relative"
          style={{
            padding: "1rem",
            overflow: "hidden", // 🚨 important: parent should not scroll
          }}
        >

          {/* Scrollable chat content */}
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: "0.5rem",
            }}
          >
            <ListGroup variant="flush" className="">
              <div>
                <ProfileBox
                  user={currentUser}
                  onInfoClick={() => setShowProfilePopup(true)}
                />

                {showProfilePopup && !showEditPanel && (
                  <ProfilePopup
                    user={currentUser}
                    onClose={() => setShowProfilePopup(false)}
                    onEdit={() => {
                      setShowProfilePopup(false);
                      setShowEditPanel(true);
                    }}
                  />
                )}

                {showEditPanel && (
                  <ProfileEditPanel
                    user={currentUser}
                    setUser={setCurrentUser}
                    onClose={() => setShowEditPanel(false)}
                  />
                )}
              </div>

              <div className="my-2">
                <ChatBotButton user={currentUser} closeChatList={swipe.close} chatList={chatList} />
              </div>

              {chats.map((chat) => {
                const otherId =
                  chat.senderId === currentUserId ? chat.receiverId : chat.senderId;

                const user = otherId ? users[otherId] : undefined;

                if (!user) {
                  return (
                    <ListGroup.Item key={chat.id} className="py-3 px-3">
                      <Spinner animation="border" variant="primary" />
                    </ListGroup.Item>
                  );
                }

                return (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    user={user}
                    lastMessage={lastMessages[chat.id]}
                    onDeleteChat={handleDeleteChat}
                    closeChatList={swipe.close}
                    chatList={chatList}
                  />
                );
              })}
            </ListGroup>
          </div>

          {/* Floating add chat button OUTSIDE the scroll container */}
          {!showAddPanel && (
            <div >
              <Button
                variant="primary"
                className="position-fixed "
                style={{
                  bottom: "1rem",
                  borderRadius: "50%",
                  width: "4rem",
                  height: "4rem",
                  fontSize: "1.6rem",
                  zIndex: 1000,
                }}
                onClick={() => setShowAddPanel(true)}
              >
                💭
              </Button>
            </div>
          )}

          {showAddPanel && (
            <AddChatPanel
              onClose={() => setShowAddPanel(false)}
              onChatAdded={() => setShowAddPanel(false)}
              existingChats={chats}
            />
          )}
        </div>
      )}


      {/* Mobile */}
      {isMobile && (
        <div
          onTouchStart={swipe.onTouchStart}
          onTouchMove={swipe.onTouchMove}
          onTouchEnd={swipe.onTouchEnd}
          className="position-relative bg-white"
          style={{
            width: "100%",
            height: "100dvh", // full viewport height
            overflowY: "auto", // only scrolls the list items
          }}
        >

          {/* User Profile + ChatBot */}
          <div className="px-3">
            <ProfileBox
              user={currentUser}
              onInfoClick={() => setShowProfilePopup(true)}
            />
            {showProfilePopup && !showEditPanel && (
              <ProfilePopup
                user={currentUser}
                onClose={() => setShowProfilePopup(false)}
                onEdit={() => {
                  setShowProfilePopup(false);
                  setShowEditPanel(true);
                }}
                isMobile={isMobile}
              />
            )}
            {showEditPanel && (
              <ProfileEditPanel
                user={currentUser}
                setUser={setCurrentUser}
                onClose={() => setShowEditPanel(false)}
              />
            )}
          </div>

          {/* Chat List */}
          <ListGroup variant="flush" className="px-0">
            <div className="my-2">
              <ChatBotButton user={currentUser} closeChatList={swipe.close} chatList={chatList} />
            </div>
            {chats.map((chat: Chat) => {
              const otherId =
                chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
              const user = otherId ? users[otherId] : undefined;
              if (!user) {
                return (
                  <ListGroup.Item key={chat.id} className="py-3 px-3">
                    <Spinner animation="border" variant="primary" />
                  </ListGroup.Item>
                );
              }
              return (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  user={user}
                  lastMessage={lastMessages[chat.id]}
                  onDeleteChat={handleDeleteChat}
                  closeChatList={swipe.close}
                  chatList={chatList}

                />
              );
            })}
          </ListGroup>

          {/* Add button */}
          {!showAddPanel && (

            <Button
              variant="primary"
              className="position-fixed "
              style={{
                bottom: "1rem",
                right: "1rem",
                borderRadius: "50%",
                width: "4rem",
                height: "4rem",
                fontSize: "1.6rem",
                zIndex: 1000,
              }}
              onClick={() => setShowAddPanel(true)}
            >
              💭
            </Button>
          )}

          {showAddPanel && (
            <AddChatPanel
              onClose={() => setShowAddPanel(false)}
              onChatAdded={() => setShowAddPanel(false)}
              existingChats={chats}
            />
          )}
        </div>
      )}


    </>
  );
}
