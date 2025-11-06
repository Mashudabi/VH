// booking.js
const params = new URLSearchParams(window.location.search);
const houseId = params.get("house") || params.get("id"); // accept both

const API = "http://localhost:5000/api";

// DOM
const houseSummary = document.getElementById("houseSummary");
const bkName = document.getElementById("bkName");
const bkPhone = document.getElementById("bkPhone");
const bkDate = document.getElementById("bkDate");
const bkSubmit = document.getElementById("bkSubmit");
const bkMsg = document.getElementById("bkMsg");

// ✅ Load house details
async function loadHouse() {
  try {
    const res = await fetch(`${API}/houses/${houseId}`);
    if (!res.ok) throw new Error();

    const h = await res.json();
    houseSummary.innerHTML = `
      <img src="http://localhost:5000/uploads/${h.image}"
           onerror="this.src='placeholder.jpg'"
           style="width:100%; max-height:200px; object-fit:cover; border-radius:8px;">
      <h3>${h.title}</h3>
      <p>${h.location} • KES ${Number(h.price).toLocaleString()}</p>
    `;
  } catch (e) {
    houseSummary.innerText = "❌ House not found";
  }
}
loadHouse();

// ✅ Submit booking request
bkSubmit.addEventListener("click", async () => {
  const name = bkName.value.trim();
  const phone = bkPhone.value.trim();
  const date = bkDate.value;

  if (!name || !phone || !date) {
    bkMsg.innerText = "⚠️ Please fill all fields.";
    bkMsg.style.color = "red";
    return;
  }

  bkSubmit.disabled = true;
  bkSubmit.innerText = "Submitting...";
  bkMsg.innerText = "";

  try {
    // 1) Save view request
    const vr = await fetch(`${API}/view-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ houseId, name, phone, date })
    }).then(r => r.json());

    if (!vr.success) throw new Error("Failed saving view request");

    // 2) Create a booking record
    const bk = await fetch(`${API}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ houseId, name, phone, payFrom: "UserRequest" })
    }).then(r => r.json());

    if (!bk.success) throw new Error("Failed saving booking");

    // ✅ Your WhatsApp number
    const WHATSAPP_NUMBER = "2547XXXXXXXX"; // ← Replace with your real number

    const msg = `Hello, I'd like to view the property:

🏠 House: ${vr.request.houseTitle}
📅 Date: ${date}

👤 Name: ${name}
📞 Phone: ${phone}

Thank you.`;

    // ✅ Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);

    bkMsg.style.color = "green";
    bkMsg.innerText = "✅ Request sent! Opening WhatsApp...";

    // reset form
    bkName.value = "";
    bkPhone.value = "";
    bkDate.value = "";

  } catch (err) {
    bkMsg.style.color = "red";
    bkMsg.innerText = "❌ Something went wrong, try again!";
  }

  bkSubmit.disabled = false;
  bkSubmit.innerText = "Confirm Viewing";
});
