// ================= VOICE TO TEXT =================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Change to "hi-IN" for Hindi
    recognition.continuous = false;
    recognition.interimResults = false;

    const micBtn = document.getElementById("micBtn");
    const description = document.getElementById("description");
    const status = document.getElementById("status");

    micBtn.addEventListener("click", () => {
        if (micBtn.classList.contains("active")) {
            recognition.stop();
            micBtn.classList.remove("active");
            status.innerText = "Stopped listening.";
        } else {
            recognition.start();
            micBtn.classList.add("active");
            status.innerText = "Listening... Speak now.";
        }
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        description.value += (description.value ? " " : "") + speechResult;
        status.innerText = "Voice added!";
        micBtn.classList.remove("active");
    };

    recognition.onerror = (event) => {
        status.innerText = "Error: " + event.error;
        micBtn.classList.remove("active");
    };

    recognition.onend = () => {
        micBtn.classList.remove("active");
        status.innerText = "Stopped listening.";
    };
} else {
    document.getElementById("status").innerText = "Voice recognition not supported in this browser.";
}

// ================= FORM SUBMIT =================
document.getElementById("complaintForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        user_id: document.getElementById("user_id").value,
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value
    };

    const res = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    document.getElementById("responseMsg").innerText = result.message;
});

let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const recordStatus = document.getElementById("recordStatus");
const audioPlayback = document.getElementById("audioPlayback");

recordBtn.addEventListener("click", async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        // Stop recording
        mediaRecorder.stop();
        recordBtn.classList.remove("recording");
        // recordStatus.innerText = "Recording stopped.";
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            audioChunks = [];
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;

                // Convert blob to Base64 so we can send with form
                const reader = new FileReader();
                reader.onloadend = () => {
                    document.getElementById("audioData").value = reader.result;
                };
                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.start();
            recordBtn.classList.add("recording");
            recordStatus.innerText = "Recording... Click again to stop.";
        } catch (err) {
            recordStatus.innerText = "Error: " + err.message;
        }
    }
});

// ================= FORM SUBMIT =================
document.getElementById("complaintForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        user_id: document.getElementById("user_id").value,
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        audio: document.getElementById("audioData").value // Base64 audio
    };

    const res = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    document.getElementById("responseMsg").innerText = result.message;
});
/*const button = document.getElementById("location")*/






function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Fetch address using reverse geocoding
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const data = await response.json();

                // Prefer display_name (full address)
                const address = data.display_name || `${latitude}, ${longitude}`;

                // Put address in textarea
                document.getElementById("location").value = address;
            } catch (error) {
                console.error("Error fetching location:", error);
                document.getElementById("location").value = `${latitude}, ${longitude}`;
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}




const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});
