import { useSwipeToggle } from "../../hooks/useSwipeToggle";

interface EmptyType {
  openChatList?: (open: boolean) => void
  chatList?: any
  isMobile?: boolean
}
export default function EmptyChat({ openChatList, chatList, isMobile }: EmptyType) {
  const swipe = useSwipeToggle({
    isOpen: chatList,
    setOpen: openChatList!
  });
  return (
    <>
      {isMobile &&
        (
          <div
            className="d-flex flex-column justify-content-between mt-3 mx-2"
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
      <div
        className="d-flex justify-content-center align-items-center h-100"
        onTouchStart={swipe.onTouchStart}
        onTouchMove={swipe.onTouchMove}
        onTouchEnd={swipe.onTouchEnd}
      >

        <h5 className="text-muted">Select a chat to start messaging</h5>
      </div>
    </>
  );
}
