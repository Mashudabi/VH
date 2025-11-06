const API = "http://localhost:5000/api";

// Ensure admin is logged in
function getAdminToken() {
  return localStorage.getItem("adminAuth") || "";
}

if (!getAdminToken()) location.href = "admin.html";


// --- LOAD HOUSES ---
async function loadHouses() {
  const res = await fetch(`${API}/houses`);
  const data = await res.json();
  const div = document.getElementById("houseList");

  if (!data.length) {
    div.innerHTML = "No houses added yet.";
    return;
  }

  div.innerHTML = data.map(h => `
    <div class="list-item">
      <div class="flex">
        <img src="http://localhost:5000${h.image}" class="house-thumb">
        <div>
          <b>${h.title}</b><br>${h.location} — KES ${Number(h.price).toLocaleString()}
        </div>
      </div>
      <button onclick="deleteHouse(${h.id})" class="btn-small danger">Delete</button>
    </div>
  `).join("");
}


// --- DELETE HOUSE ---
async function deleteHouse(id) {
  if (!confirm("Delete house permanently?")) return;

  const token = getAdminToken();

  const res = await fetch(`${API}/houses/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  // ✅ Backend sends { message: "...", success: true/false }
  if (!data.success) {
    alert(data.message || "Delete failed");
    return;
  }

  alert("✅ House deleted");
  loadHouses();
}


// --- LOAD VIEWING REQUESTS ---
async function loadRequests() {
  const token = getAdminToken();
  const res = await fetch(`${API}/view-requests`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const div = document.getElementById("reqList");

  if (!data.length) {
    div.innerHTML = "No viewing requests.";
    return;
  }

  div.innerHTML = data.map(r => `
    <div class="list-item">
      <b>${r.name}</b> (${r.phone})<br>
      House: ${r.houseTitle}<br>Date: ${r.date}
    </div>
  `).join("");
}


// --- LOAD BOOKINGS ---
async function loadBookings() {
  const token = getAdminToken();
  const res = await fetch(`${API}/bookings`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const div = document.getElementById("booksList");

  if (!data.length) {
    div.innerHTML = "No bookings yet.";
    return;
  }

  div.innerHTML = data.map(b => `
    <div class="list-item">
      <b>${b.customerName}</b> (${b.customerPhone})<br>
      House: ${b.houseTitle}<br>
      Amount: KES ${b.amount}
    </div>
  `).join("");
}


// Run on load
loadHouses();
loadRequests();
loadBookings();
