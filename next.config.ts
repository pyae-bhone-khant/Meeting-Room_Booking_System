// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   turbopack: {}, // Turbopack အလုပ်လုပ်စေရန်

//   async rewrites() {
//     return [
//       {
//         source: '/api/auth/:path*', // Frontend က /api/auth လို့ ခေါ်သမျှကို...
//         destination: 'https://meeting-room-booking-system-api.onrender.com/api/auth/:path*', // Render Backend ဆီ အနောက်ကွယ်ကနေ လှည့်ပို့ပေးမှာပါ
//       },
//     ];
//   },
// };

// export default nextConfig;  

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // API ရဲ့ Base URL ကို သီးသန့် ခွဲထုတ်ယူပါမယ်
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        // အမြဲတမ်း အနောက်မှာ /api/:path* ပါသွားအောင် တွဲပေးရပါမယ်
        destination: `${apiBaseUrl}/api/:path*`, 
      },
    ];
  },
 
};

export default nextConfig;