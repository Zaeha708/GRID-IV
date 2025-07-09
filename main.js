const output = document.getElementById("output");
const video = document.getElementById("camera");
const wave = document.getElementById("wave");

window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

window.onload = () => {
  startListening();
};

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();
  console.log("🎧 Listening...");

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("🎤 You said:", text);
    output.innerHTML = `🗣️ You said: <b>${text}</b>`;

    if (text.includes("hey grid")) {
      speak("Hello, I am Grid I.V. Fully activated. How can I assist you?");
    } else if (text.includes("where am i")) {
      getLocation();
    } else if (text.includes("open camera")) {
      startCamera();
    } else {
      speak("Command not recognized.");
    }
  };

  recognition.onend = () => {
    setTimeout(() => startListening(), 500);
  };

  recognition.onerror = (event) => {
    console.error("Voice error:", event.error);
    speak("There was a microphone error.");
    setTimeout(() => startListening(), 2000);
  };
}

function speak(text) {
  if (!window.speechSynthesis) {
    alert("Speech Synthesis not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("google")) || voices[0];
  if (voice) utterance.voice = voice;

  wave.style.visibility = "visible";
  utterance.onend = () => {
    wave.style.visibility = "hidden";
    startListening();
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function getLocation() {
  if (!navigator.geolocation) {
    speak("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    output.innerHTML = `📍 Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    speak(`You are at latitude ${latitude.toFixed(2)} and longitude ${longitude.toFixed(2)}.`);
  });
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.style.display = "block";
      video.play();
      speak("Camera activated.");
    })
    .catch(err => {
      speak("Camera access failed.");
      console.error("Camera error:", err);
    });
}
