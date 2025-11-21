import { useEffect, useRef, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { streamText } from "../../utils/TextAppearing";
import { sendAiMessage } from "../../API/chatbotApi";
import { nanoid } from "nanoid";
import { PromptToggle } from "./PromptToggle";
import { parseMessage } from "../../utils/CodeSnippetFinder";
import { CodeSnippet } from "./CodeSnippet";
import styles from "../../Styles/ChatBot.module.css"
import { useSwipeToggle } from "../../hooks/useSwipeToggle";

interface ChatMessage {
    id: string;
    sender: "user" | "ai" | "thinking";
    content: string;
}


interface BotType {
    openChatList?: () => void
    chatList?: any
    isMobile?: boolean
}


export const ChatBot = ({ openChatList, chatList, isMobile }: BotType) => {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Toggler Variables
    const [enhancedMode, setEnhancedMode] = useState(false);
    const [codeMode, setCodeMode] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const swipe = useSwipeToggle({
        isOpen: chatList,
        setOpen: openChatList!
    });

    // Scroll listener to detect if user is at bottom
    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // consider "at bottom" if within 30px of the bottom
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 30);
    };

    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-scroll only if user is at bottom
    useEffect(() => {
        if (isAtBottom && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);



    const formattedTime = new Date(Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const ENHANCED_MODE_PROMPT = ". Please provide a more detailed, thoughtful, and structured answer.";
    const CODE_MODE_PROMPT = '. When you generate code, please include ``` and the language name at the start of the code and ``` at the end of each code '

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        // Add extra prompt if toggle is on
        let finalMessage = message.trim();
        if (enhancedMode) {
            finalMessage += ENHANCED_MODE_PROMPT;
        }
        if (codeMode) {
            finalMessage += CODE_MODE_PROMPT;
        }

        const userMessage: ChatMessage = {
            id: nanoid(),
            sender: "user",
            content: message.trim(), // show user text without prompt
        };

        // 1️⃣ Add user message
        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setIsSending(true);

        // 2️⃣ Add "thinking..." bubble
        const thinkingMessage: ChatMessage = {
            id: "thinking",
            sender: "thinking",
            content: "Thinking…",
        };
        setMessages((prev) => [...prev, thinkingMessage]);

        // 3️⃣ Send to AI
        const result = await sendAiMessage(finalMessage);

        // 4️⃣ Remove thinking bubble
        setMessages((prev) => prev.filter((m) => m.id !== "thinking"));

        if (result.status === "success") {
            // 5️⃣ Stream AI response
            const aiMessage: ChatMessage = {
                id: nanoid() + "_ai",
                sender: "ai",
                content: "",
            };
            setMessages((prev) => [...prev, aiMessage]);

            streamText(
                result.reply,
                (partial, isOver) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessage.id ? { ...msg, content: partial } : msg
                        )
                    );
                    if (isOver) setIsSending(false);
                },
                20
            );
        } else {
            // Error
            const aiMessage: ChatMessage = {
                id: nanoid() + "_ai",
                sender: "ai",
                content: "Error: " + result.error,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsSending(false);
        }
    }

    return (
        <div className="d-flex flex-column h-100 p-2 bg-light m-0"
            onTouchStart={swipe.onTouchStart}
            onTouchMove={swipe.onTouchMove}
            onTouchEnd={swipe.onTouchEnd}>
            <div className="border-bottom p-3 d-flex gap-2">
                {isMobile &&
                    (
                        <div
                            className="d-flex flex-column justify-content-between m=0 p-0"
                            style={{
                                width: "30px",
                                height: "22px",
                                cursor: "pointer",
                            }}
                            onClick={swipe.open}
                        >
                            <span
                                style={{
                                    display: "block",
                                    height: "4px",
                                    borderRadius: "2px",
                                    backgroundColor: "#333",
                                    transition: "all 0.3s ease",
                                    transform: chatList ? "rotate(45deg) translate(5px, 5px)" : "none",
                                }}
                            />
                            <span
                                style={{
                                    display: "block",
                                    height: "4px",
                                    borderRadius: "2px",
                                    backgroundColor: "#333",
                                    opacity: chatList ? 0 : 1,
                                    transition: "all 0.3s ease",
                                }}
                            />
                            <span
                                style={{
                                    display: "block",
                                    height: "4px",
                                    borderRadius: "2px",
                                    backgroundColor: "#333",
                                    transition: "all 0.3s ease",
                                    transform: chatList ? "rotate(-45deg) translate(5px, -5px)" : "none",
                                }}
                            />
                        </div>
                    )
                }
                <h5>AI ChatBot</h5>
            </div>

            {/* Chat area */}

            <div className="flex-grow-1 overflow-auto mb-3 px-2 " 
            style={{ width: '100%' }}>

                {messages.map((msg) => {
                    if (msg.sender === "user") {
                        return (
                            <div
                                className={`d-flex flex-column mb-3 align-items-end`} key={msg.id}
                            >
                                <div
                                    className={`d-flex align-items-end flex-row-reverse}`}
                                    style={{ gap: "10px" }}
                                >

                                    {/* ✅ Message bubble (slimmer vertically) */}
                                    <div className="d-flex flex-column mb-3 align-items-end" style={{ width: '100%' }}>
                                        <div
                                            className="px-3 py-1 rounded-4 shadow-sm bg-primary text-white"
                                            style={{
                                                maxWidth: '40vw',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                fontSize: '1rem',
                                                lineHeight: '1.3',
                                            }}
                                        >
                                            {msg.content}
                                            <h6 ref={chatEndRef}></h6>
                                        </div>
                                        <small className="mt-1 text-muted text-end" style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                                            {formattedTime}
                                        </small>
                                    </div>

                                </div>
                            </div>
                        );
                    } else if (msg.sender === "thinking") {
                        return (
                            <div
                                key={msg.id}
                                className={`${styles.ai_thinking} align-self-start p-2 rounded px-3 bg-light text-dark `}
                                style={{ maxWidth: "75%", wordBreak: "break-word" }}
                            >
                                <p className={styles.ai_thinking}>{msg.content}</p>
                            </div>
                        );
                    } else {
                        // AI message
                        return (
                            // <div
                            //     key={msg.id}
                            //     className={`align-self-start p-2 rounded px-3 text-white ${styles.ai_message}`}
                            //     style={{
                            //         maxWidth: '75%',
                            //         wordBreak: 'break-word',
                            //         overflowWrap: 'break-word',
                            //         whiteSpace: 'pre-wrap',
                            //     }}
                            // >
                            //     {msg.content}
                            // </div>
                            <div
                                className={`d-flex flex-column mb-3 align-self-start`} key={msg.id}
                            >
                                <div
                                    className={`d-flex align-items-end flex-row-reverse}`}
                                    style={{ gap: "10px" }}
                                >

                                    {/* ✅ Message bubble (slimmer vertically) */}
                                    <div className="d-flex flex-column mb-3 align-items-end" style={{ width: '100%' }}>
                                        <div
                                            className={`align-self-start p-2 rounded px-3 text-white ${styles.ai_message}`}
                                            ref={chatContainerRef}
                                            style={{
                                                maxWidth: '40vw',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                fontSize: '1rem',
                                                lineHeight: '1.3',
                                            }}
                                        >
                                            {parseMessage(msg.content).map((part, i) =>
                                                typeof part === "string" ? (
                                                    <span key={i}>{part}</span>
                                                ) : (
                                                    <CodeSnippet key={i} code={part.code} language={part.language} />
                                                )
                                            )}

                                            <h6 ref={chatEndRef}></h6>
                                        </div>
                                        <small className="mt-1 text-muted text-end" style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                                            {formattedTime}
                                        </small>
                                    </div>

                                </div>
                            </div>
                        );

                    }
                })}
            </div>
            <div className="d-flex flex-row gap-2">

                <PromptToggle
                    label="Enhanced Reply Mode"
                    active={enhancedMode}
                    onToggle={() => setEnhancedMode(!enhancedMode)}
                />
                <PromptToggle
                    label="Code Mode"
                    active={codeMode}
                    onToggle={() => setCodeMode(!codeMode)}
                />
            </div  >

            {/* Input */}
            <Form onSubmit={handleSend}>
                <InputGroup style={{ alignItems: "flex-end" }}>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            resize: "none",
                            overflow: "hidden",
                            minHeight: "35px",
                            maxHeight: "250px",
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                            borderTopRightRadius: "0",
                            borderBottomRightRadius: "0",
                            transition: "border-radius 0.2s, height 0.2s",
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            const newHeight = Math.max(target.scrollHeight, 35);
                            target.style.height = newHeight + "px";

                            if (newHeight > 50) {
                                // growing: corners all 15 except bottom-right stays 0
                                target.style.borderTopLeftRadius = "15px";
                                target.style.borderBottomLeftRadius = "15px";
                                target.style.borderTopRightRadius = "15px";
                                target.style.borderBottomRightRadius = "0";
                            } else {
                                // default: left 20, right 0
                                target.style.borderTopLeftRadius = "20px";
                                target.style.borderBottomLeftRadius = "20px";
                                target.style.borderTopRightRadius = "0";
                                target.style.borderBottomRightRadius = "0";
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="rounded-end-pill"
                        style={{ height: "fit-content" }}
                        disabled={isSending}
                    >
                        {isSending ? "Sending…" : "Send"}
                    </Button>
                </InputGroup>




            </Form>
        </div>
    );
};
