const WHATSAPP_PHONE = "923329610945";
const message = encodeURIComponent(
  "Hello Marble City, I'd like to enquire about your stone collection.",
);

export default function WhatsAppButton() {
  return (
    <a
      aria-label="Chat with Marble City on WhatsApp"
      className="whatsapp-button"
      href={`https://wa.me/${WHATSAPP_PHONE}?text=${message}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="26"
        viewBox="0 0 24 24"
        width="26"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.1 11.9a8.1 8.1 0 0 1-12 7.1L3 20.3l1.3-5a8.1 8.1 0 1 1 15.8-3.4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M8.8 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.4 0 .6l-.5.6c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-2 .5-1-.2-2.2-.8-3.4-1.9-1.4-1.2-2.3-2.7-2.5-3.8-.2-.9.1-1.5.5-1.8.3-.3.6-.4.8-.4Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
