// JavaScript for the capture page.

// Once the DOM is fully loaded, set up the camera and detection logic.
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const detectButton = document.getElementById('detectButton');
  const message = document.getElementById('message');

  // Request access to the user's webcam and start streaming it to the video element.
  // We ask for the environment-facing camera when available (rear camera on phones)
  // but fall back to any available camera on error. This helps ensure iPhone
  // devices open the back camera when possible.
  function startCamera(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        return video.play();
      })
      .catch((err) => {
        console.error('Error accessing camera with constraints', constraints, err);
        // If the environment facing camera fails, try again with a generic constraint
        if (constraints.video && constraints.video.facingMode) {
          startCamera({ video: true });
        } else {
          message.textContent = 'Unable to access camera. Please allow camera access and refresh the page.';
        }
      });
  }

  // Attempt to start the environment-facing camera if available
  startCamera({ video: { facingMode: { ideal: 'environment' } } });

  // Define a list of humorous error messages to display when detection fails.
  // A playful collection of error messages to display when no grass is detected.
  const errorMessages = [
    "bruh stop being fat",
    "bruh gtfo.",
    "rlly bruh?",
    "buddy be fr",
    "bas ya 7mar",
    "nice try diddy"
  ];

  // When the user clicks the detection button, capture a frame and analyse it for green content.
  detectButton.addEventListener('click', () => {
    // Ensure the video stream is active
    if (video.readyState !== 4) {
      message.textContent = 'Video not ready yet. Please wait…';
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // Draw the current video frame onto the hidden canvas【594760590154827†L346-L359】
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let greenPixels = 0;
    const totalPixels = width * height;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Heuristic: a pixel is considered green if the green channel dominates red and blue【479374847350895†L53-L59】
      if (g > 60 && g > 1.3 * r && g > 1.3 * b) {
        greenPixels++;
      }
    }
    const greenRatio = greenPixels / totalPixels;
    if (greenRatio > 0.05) {
      // Redirect to the success page when grass is detected
      window.location.href = '/success';
    } else {
      // Otherwise, cycle through a humorous message when no grass is detected
      const randomIndex = Math.floor(Math.random() * errorMessages.length);
      message.textContent = errorMessages[randomIndex];
      message.style.color = '#ffca28';
    }
  });
});