document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const detectButton = document.getElementById('detectButton');
  const message = document.getElementById('message');

  // --- Funny messages for fails ---
  const errorMessages = [
    "bruh stop being fat",
    "bruh gtfo.",
    "rlly bruh?",
    "buddy be fr",
    "bas ya 7mar",
    "nice try diddy"
  ];

  // --- Start camera (prefer back camera on phones) ---
  function startCamera(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        return video.play();
      })
      .catch((err) => {
        console.error('Error accessing camera with constraints', constraints, err);
        if (constraints.video && constraints.video.facingMode) {
          startCamera({ video: true }); // fallback
        } else {
          message.textContent = 'Unable to access camera. Please allow camera access and refresh the page.';
        }
      });
  }

  startCamera({
    video: {
      facingMode: { ideal: "environment" }
    },
    audio: false
  });  

  // --- Load MobileNet once ---
  let model = null;

  async function loadModel() {
    if (model) return model;
    message.textContent = 'Loading ML model...';
    // mobilenet is provided by the CDN script
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    message.textContent = 'Model ready ✅ Point at grass and tap Detect.';
    return model;
  }

  // Kick off loading ASAP (so first detect is fast)
  loadModel().catch((e) => {
    console.error('Model load failed:', e);
    message.textContent = 'ML model failed to load. Check internet and refresh.';
  });

  // --- Grass keyword matching ---
  function looksLikeGrass(predictions) {
    // Common labels MobileNet might return (not guaranteed)
    const grassHints = [
      "grass",
      "lawn",
      "meadow",
      "field",
      "pasture",
      "park",
      "golf",
      "turf"
    ];

    // If any prediction label includes a grass hint and confidence is decent → accept
    return predictions.some(p => {
      const label = (p.className || "").toLowerCase();
      const conf = p.probability || 0;
      return conf >= 0.15 && grassHints.some(h => label.includes(h));
    });
  }

  // --- Detect handler ---
  detectButton.addEventListener('click', async () => {
    try {
      // Ensure video is ready
      if (video.readyState !== 4) {
        message.textContent = 'Video not ready yet. Please wait…';
        return;
      }

      // Ensure model is loaded
      if (!model) await loadModel();

      // Capture a frame to canvas (downscale for speed)
      const targetW = 320; // keep small for mobile speed
      const aspect = video.videoHeight / video.videoWidth;
      const targetH = Math.round(targetW * aspect);

      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, targetW, targetH);

      message.textContent = 'Thinking... 🤖🌿';

      // Run MobileNet on the canvas
      const predictions = await model.classify(canvas);
            // 🔍 DEBUG: show what the ML model thinks it sees
      console.log(predictions);

      message.textContent = predictions
        .slice(0, 3)
        .map(p => `${p.className} (${(p.probability * 100).toFixed(0)}%)`)
        .join(" • ");


      // Debug if you want:
      // console.log(predictions);

      if (looksLikeGrass(predictions)) {
        window.location.href = '/success';
      } else {
        const randomIndex = Math.floor(Math.random() * errorMessages.length);
        message.textContent = errorMessages[randomIndex];
        message.style.color = '#ffca28';
      }
    } catch (err) {
      console.error('Detection failed:', err);
      message.textContent = 'Something went wrong. Try again.';
    }
  });
});
