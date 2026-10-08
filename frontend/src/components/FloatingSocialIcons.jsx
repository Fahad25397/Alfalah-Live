import React from 'react';

const FloatingSocialIcons = () => {
  const phoneNumber = '923331010640'; // Pakistani number format
  const message = `Hello! I am on the Alfalah Honey website and have a few questions about ordering your honey. Are you available to help?`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1ebd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center"
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

      {/* Instagram */}
      <a
        href="https://www.instagram.com/alfalah_honey_gulbahar?utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Follow us on Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/@alfalah_honey_gulbahar?_r=1&_t=ZS-99JuHUOZ8rs"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Follow us on TikTok"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.5.85 2.87 1.94 3.82.99.87 2.29 1.34 3.63 1.35v4.05c-1.35.03-2.67-.32-3.8-1-.74-.46-1.39-1.04-1.92-1.72-.03 2.54-.04 5.09-.04 7.64 0 3.39-2.58 6.36-5.95 6.74-3.41.38-6.62-1.78-7.55-5.06-.94-3.27 1.08-6.65 4.31-7.4 1.25-.29 2.56-.25 3.79.16V12.7c-1.46-.38-3.03-.12-4.29.74-1.32.9-2.07 2.45-1.96 4.02.13 1.76 1.48 3.23 3.23 3.51 1.76.28 3.53-.59 4.38-2.14.47-.85.73-1.83.74-2.82V.02z"/>
        </svg>
      </a>
    </div>
  );
};

export default FloatingSocialIcons;
