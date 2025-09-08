// Example problems (comment this array out if you want to test "No problems to solve")
let problems = [
    {
        id: 1,
        description: "Streetlight not working",
        status: "open",
        department: "Electricity",
        location: [23.3441, 85.3096],
        address: "Kutchery Road, Ranchi, Jharkhand"
    },
    {
        id: 2,
        description: "Water leakage near park",
        status: "open",
        department: "Water Supply",
        location: [23.3470, 85.3108],
        address: "Morabadi, Ranchi, Jharkhand"
    },
    {
        id: 3,
        description: "Garbage not collected",
        status: "resolved",
        department: "Garbage",
        location: [23.3425, 85.3072],
        address: "Lalpur Chowk, Ranchi, Jharkhand"
    }
];
// let problems = []; // Uncomment this to test "No problems to solve"

const issuesDiv = document.getElementById('issues');
const statusFilter = document.getElementById('statusFilter');
const deptFilter = document.getElementById('deptFilter');



let markers = [];
function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function renderIssues() {
    issuesDiv.innerHTML = '';

    // If no problems exist
    if (!problems || problems.length === 0) {
        issuesDiv.innerHTML = '<p>No problems to solve</p>';
        clearMarkers();
        return;
    }

    // Apply filters
    let filtered = problems.filter(p => {
        let statusMatch = (statusFilter.value === 'all') || (p.status === statusFilter.value);
        let deptMatch = (deptFilter.value === 'all') || (p.department === deptFilter.value);
        return statusMatch && deptMatch;
    });

    // If no problems match filters
    if (filtered.length === 0) {
        issuesDiv.innerHTML = '<p>No problems to solve</p>';
        clearMarkers();
        return;
    }

    // Render matching problems
    filtered.forEach(p => {
        let div = document.createElement('div');
        div.className = 'issue';
        div.innerHTML = `
          <p><strong>${p.description}</strong></p>
          <p>Status: ${p.status}</p>
          <p>Department: ${p.department}</p>
          <p><i class="fa-solid fa-location-dot"></i> ${p.address}</p>
          ${p.status === 'open' ? `<button class="status-btn" onclick="updateStatus(${p.id})">Mark as Resolved</button>` : ""}
        `;
        issuesDiv.appendChild(div);
    });

    // Update markers
    clearMarkers();
    filtered.forEach(p => {
        let marker = L.marker(p.location).addTo(map)
            .bindPopup(`<b>${p.description}</b><br>${p.address}<br>Status: ${p.status}<br>Dept: ${p.department}`);
        markers.push(marker);
    });
}

function updateStatus(id) {
    problems = problems.map(p => p.id === id ? { ...p, status: 'resolved' } : p);
    renderIssues();
}

// Attach filter events
statusFilter.addEventListener('change', renderIssues);
deptFilter.addEventListener('change', renderIssues);
// Init map
const map = L.map('map').setView([23.3441, 85.3096], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);



// Initial render
renderIssues();


