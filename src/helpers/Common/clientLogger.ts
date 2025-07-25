import { generateSignature } from "./generateSignature";

const detectPlatform = () => {
  const ua = navigator.userAgent;

  if (/windows phone/i.test(ua)) return "Windows Phone";
  if (/android/i.test(ua)) return "Android";
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";

  return "unknown";
};

export const logClientError = async (error: any) => {
  const payload = {
    message: error?.message,
    stack: error?.stack,
    name: error?.name,
    url: window.location.href,
    path: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: detectPlatform(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    devicePixelRatio: window.devicePixelRatio,
    online: navigator.onLine,
    errorType: "client",
    time: new Date().toISOString(),
    performanceNow: performance.now(),
  };
  const signature = await generateSignature(
    payload,
    process.env.NEXT_PUBLIC_LOG_API_SECRET!
  );

  if (process.env.NODE_ENV !== "production") {
    console.log("Client Error Log:", payload, signature);
  }

  await fetch("/api/client-log", {
    method: "POST",
    body: JSON.stringify({ payload, signature }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
