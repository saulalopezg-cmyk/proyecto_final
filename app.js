if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("✅ Service Worker registrado correctamente"))
    .catch((err) => console.log("❌ Error al registrar el Service Worker:", err));
}
