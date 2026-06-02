/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Turbopack အလုပ်လုပ်စေရန်

  async rewrites() {
    return [
      {
        source: '/api/auth/:path*', // Frontend က /api/auth လို့ ခေါ်သမျှကို...
        destination: 'https://meeting-room-booking-system-api.onrender.com/api/auth/:path*', // Render Backend ဆီ အနောက်ကွယ်ကနေ လှည့်ပို့ပေးမှာပါ
      },
    ];
  },
};

export default nextConfig;