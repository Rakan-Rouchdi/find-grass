// JavaScript for the capture page (NO ML version)
// Detects grass using a simple green-pixel heuristic.

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const detectButton = document.getElementById('detectButton');
  const message = document.getElementById('message');

  // Funny messages for fails
  const errorMessages = [
    "bruh stop being fat",
    "bruh gtfo.",
    "rlly bruh?",
    "buddy be fr",
    "bas ya 7mar",
    "nice try diddy"
  ];

  // Start camera (prefer back camera on phones)
  function startCamera(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        return video.play();
      })
      .catch((err) => {
        console.error('Error accessing camera with constraints', constraints, err);

        // If back camera constraint fails, fall back to any camera
        if (constraints.video && constraints.video.facingMode) {
          startCamera({ video: true, audio: false });
        } else {
          message.textContent = 'Unable to access camera. Please allow camera access and refresh the page.';
        }
      });
  }

  startCamera({
    video: { facingMode: { ideal: "environment" } },
    audio: false
  });

  // Detect grass when user clicks
  detectButton.addEventListener('click', () => {
    // Ensure video stream is ready
    if (video.readyState !== 4) {
      message.textContent = 'Video not ready yet. Please wait…';
      message.style.color = '#ffe066';
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let greenPixels = 0;
    const totalPixels = width * height;

    // Count "green-ish" pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Grass-like green heuristic
      if (g > 60 && g > 1.3 * r && g > 1.3 * b) {
        greenPixels++;
      }
    }

    const greenRatio = greenPixels / totalPixels;

    // Threshold decision
    if (greenRatio > 0.05) {
      // Grass detected
      window.location.href = '/success';
    } else {
      // No grass → show funny message
      const randomIndex = Math.floor(Math.random() * errorMessages.length);
      message.textContent = errorMessages[randomIndex];
      message.style.color = '#ffca28';
    }
  });
});
