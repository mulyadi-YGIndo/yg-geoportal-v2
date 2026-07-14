const API_URL = window.YG_V2_CONFIG?.api || "https://script.google.com/macros/s/AKfycbxUe4QyBvSiL9UJsL-nsJ5XrohDabwqhYYR9q5CTgLYiW1ZCfVy429iMlpU-lCDUSvvRg/exec";

export function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callback = "ygV2_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Waktu koneksi habis."));
    }, 30000);

    function cleanup() {
      clearTimeout(timer);
      script.remove();
      try { delete window[callback]; } catch (error) {}
    }

    window[callback] = data => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("API tidak dapat dimuat."));
    };

    script.src = url + (url.includes("?") ? "&" : "?") +
      "callback=" + encodeURIComponent(callback) + "&t=" + Date.now();

    document.head.appendChild(script);
  });
}

export function loadObjects() {
  return jsonp(API_URL + "?page=objects");
}

export function loadSummary() {
  return jsonp(API_URL + "?page=dashboard-summary");
}
