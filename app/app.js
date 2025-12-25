// pour visibility toggle private/public

const toggleOptions = document.querySelectorAll(".visibility-toggle .option");
const publicSection = document.querySelector(".public");
const privateSection = document.querySelector(".private");

toggleOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    // Remove active class from all and add to clicked
    toggleOptions.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");

    // Show/hide sections based on selection
    if (opt.dataset.visibility === "public") {
      publicSection.style.display = "block";
      privateSection.style.display = "none";
    } else {
      publicSection.style.display = "none";
      privateSection.style.display = "flex"; // keep flex for centered input
    }

    // Optional: update filter variable
    currentVisibility = opt.dataset.visibility;
    applyFilters && applyFilters(); // call if you already have this function
  });
});

// Initialize default view
if (document.querySelector(".visibility-toggle .option.active").dataset.visibility === "public") {
  publicSection.style.display = "block";
  privateSection.style.display = "none";
} else {
  publicSection.style.display = "none";
  privateSection.style.display = "flex";
}


// handl the form 
const addRoomBtn = document.querySelector(".add-room-btn");
const modal = document.getElementById("createRoomModal");
const cancelBtn = document.getElementById("cancelModal");
const createRoomForm = document.getElementById("createRoomForm");

// Show modal
addRoomBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Hide modal
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Click outside modal to close
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// Handle form submit
createRoomForm.addEventListener("submit", e => {
  e.preventDefault();

  const roomName = document.getElementById("roomName").value.trim();
  const roomType = document.getElementById("roomType").value;
  const isPrivate = document.getElementById("roomPrivate").checked;

  // Here you can send data to backend via fetch / websocket
  console.log({ roomName, roomType, isPrivate });

  // Close modal after creation
  modal.style.display = "none";

  // Optional: reset form
  createRoomForm.reset();
});



const homeView = document.getElementById("homeView");
const meetingView = document.getElementById("meetingView");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const micBtn = document.getElementById("micBtn");
const camBtn = document.getElementById("camBtn");
const leaveBtn = document.getElementById("leaveBtn");

let localStream;
let peerConnection;

let micEnabled = true;
let camEnabled = true;

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

async function startCall(friendName) {
  homeView.classList.add("hidden");
  meetingView.classList.remove("hidden");

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(config);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  console.log("Call started with", friendName);
}

/* =====================
   MICROPHONE TOGGLE
===================== */
micBtn.addEventListener("click", () => {
  const audioTrack = localStream.getAudioTracks()[0];
  micEnabled = !micEnabled;
  audioTrack.enabled = micEnabled;

  micBtn.textContent = micEnabled ? "Mute" : "Unmute";
  micBtn.classList.toggle("active", !micEnabled);
});

/* =====================
   CAMERA TOGGLE
===================== */
camBtn.addEventListener("click", () => {
  const videoTrack = localStream.getVideoTracks()[0];
  camEnabled = !camEnabled;
  videoTrack.enabled = camEnabled;

  camBtn.textContent = camEnabled ? "Stop Video" : "Start Video";
  camBtn.classList.toggle("active", !camEnabled);
});

/* =====================
   LEAVE MEETING
===================== */
leaveBtn.addEventListener("click", () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  meetingView.classList.add("hidden");
  homeView.classList.remove("hidden");

  micEnabled = true;
  camEnabled = true;

  micBtn.textContent = "Mute";
  camBtn.textContent = "Stop Video";
  micBtn.classList.remove("active");
  camBtn.classList.remove("active");
});

/* =====================
   DRAG LOCAL VIDEO
===================== */
const localVid = document.getElementById('localVideo');

let isDragging = false;
let offsetX, offsetY;

localVid.addEventListener('mousedown', e => {
  isDragging = true;
  offsetX = e.clientX - localVid.getBoundingClientRect().left;
  offsetY = e.clientY - localVid.getBoundingClientRect().top;
  localVid.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  localVid.style.cursor = 'grab';
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;

  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;

  // Prevent going out of video area
  const rect = localVid.getBoundingClientRect();
  const parentRect = localVid.parentElement.getBoundingClientRect();
  x = Math.max(0, Math.min(x, parentRect.width - rect.width));
  y = Math.max(0, Math.min(y, parentRect.height - rect.height));

  localVid.style.left = x + 'px';
  localVid.style.top = y + 'px';
});

