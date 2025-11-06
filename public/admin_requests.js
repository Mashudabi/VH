// --- Admin Requests System --- //

const API = "http://localhost:5000/api";
const token = localStorage.getItem("adminAuth");

const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const loading = document.getElementById("loading");

// If admin already logged in, show panel
if (token) {
  loginBox.style.display = "none";
  panel.style.display = "block";
  loadData();
}

// --- ADMIN LOGIN ---
document.getElementById("adminLogin").addEventListener("click", async () => {
  const phone = document.getElementById("adminPhone").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password: pass })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("adminMsg").innerText = data.message || "Invalid login";
    return;
  }

  // Save token and go to admin dashboard
  localStorage.setItem("adminAuth", data.token);

  alert("✅ Admin Login Successful!");
  window.location.href = "admin_dashboard.html";
});

// --- LOAD ADMIN DATA ---
async function loadData() {
  loading.style.display = "block";

  try {

    const reqRes = await fetch(`${API}/requests`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const requests = await reqRes.json();

    const bookRes = await fetch(`${API}/bookings`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const bookings = await bookRes.json();

    renderRequests(requests);
    renderBookings(bookings);

  } catch (err) {
    alert("Error loading admin data");
  }

  loading.style.display = "none";
}

// --- DISPLAY REQUESTS ---
function renderRequests(list) {
  const table = document.getElementById("requestsList");
  table.innerHTML = "";

  list.forEach(req => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.name}</td>
      <td>${req.phone}</td>
      <td>${req.houseTitle || req.houseName || "N/A"}</td>
      <td><span class="badge badge-pending">Pending</span></td>
      <td>
        <button class="action-btn approve-btn" onclick="approveRequest('${req.id || req._id}')">Approve</button>
        <button class="action-btn delete-btn" onclick="deleteRequest('${req.id || req._id}')">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

// --- DISPLAY BOOKINGS ---
function renderBookings(list) {
  const table = document.getElementById("bookingsList");
  table.innerHTML = "";

  list.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.houseTitle || b.houseName || "N/A"}</td>
      <td>${b.payFrom || b.payNumber}</td>
    `;
    table.appendChild(tr);
  });
}

// --- APPROVE REQUEST ---
async function approveRequest(id) {
  if (!confirm("Approve this request?")) return;

  const res = await fetch(`${API}/requests/approve/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok) {
    alert("✅ Approved");
    loadData();
  } else {
    alert(data.message || "Error approving");
  }
}

// --- DELETE REQUEST ---
async function deleteRequest(id) {
  if (!confirm("Delete this request?")) return;

  const res = await fetch(`${API}/requests/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok) {
    alert("❌ Request deleted");
    loadData();
  } else {
    alert(data.message || "Error deleting");
  }
}
