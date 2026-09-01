import React from 'react';

const WhatsAppIcon = () => {
  const phoneNumber = '923331010640'; // Pakistani number format
  const message = `Hello! I am on the Alfalah Honey website and have a few questions about ordering your honey. Are you available to help?`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1ebd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.031 21.002c-1.503 0-2.969-.39-4.256-1.127l-.305-.175-3.158.828.843-3.078-.192-.306A8.904 8.904 0 0 1 3.567 12c0-4.962 4.038-9 9-9 2.404 0 4.664.937 6.365 2.639C20.634 7.34 21.571 9.6 21.571 12c0 4.962-4.038 9-9.54 9.002h-.001ZM12.031 4.792c-3.974 0-7.208 3.234-7.208 7.208 0 1.272.33 2.511.956 3.606l.37.643-.541 1.977 2.022-.53.626.353c1.066.603 2.274.92 3.504.92h.001c3.974 0 7.208-3.234 7.208-7.208 0-1.926-.749-3.734-2.112-5.097C16.494 5.302 14.331 4.792 12.031 4.792Zm3.953 9.771c-.217-.109-1.284-.634-1.483-.706-.198-.073-.343-.109-.488.109-.145.217-.562.706-.689.851-.126.145-.253.163-.47.054-1.206-.603-2.023-1.118-2.775-2.222-.192-.284.19-.271.603-.902.072-.109.036-.205-.001-.278-.036-.073-.488-1.177-.668-1.612-.175-.421-.353-.364-.488-.371-.126-.007-.271-.007-.416-.007-.145 0-.379.054-.578.271-.198.217-.758.741-.758 1.808 0 1.067.776 2.097.884 2.242.108.145 1.529 2.333 3.704 3.27.519.223.923.357 1.238.457.518.165.989.141 1.36.085.414-.062 1.284-.524 1.464-1.03.18-.506.18-.941.126-1.03-.054-.089-.199-.143-.416-.252Z" />
      </svg>
    </a>
  );
};

export default WhatsAppIcon;
