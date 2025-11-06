// payment.js
const API = "http://localhost:5000/api";
const params = new URLSearchParams(window.location.search);
const houseId = params.get("house");
const bookingId = params.get("booking");
const USER = JSON.parse(localStorage.getItem("user") || "null");

const content = document.getElementById("content");

async function load() {
  if (!houseId) {
    content.innerHTML = "<div>Missing house id</div>"; return;
  }

  // fetch house
  const hRes = await fetch(`${API}/houses/${houseId}`);
  if (!hRes.ok) { content.innerHTML = "<div>House not found</div>"; return; }
  const house = await hRes.json();

  // fetch booking if bookingId provided
  let booking = null;
  if (bookingId) {
    const bRes = await fetch(`${API}/bookings`);
    const all = await bRes.json();
    booking = all.find(b => String(b.id) === String(bookingId));
  }

  // show summary
  const amount = booking ? booking.amount : (Number(house.price) + 277);
  content.innerHTML = `
    <h2>Pay for: ${house.title}</h2>
    <img src="http://localhost:5000${house.image}" style="width:100%; height:180px; object-fit:cover; border-radius:8px">
    <div style="margin-top:8px">Amount: <b>KES ${Number(amount).toLocaleString()}</b></div>

    <div style="margin-top:12px">
      <label>Payment phone (where you'll pay from)</label><br>
      <input id="payPhone" style="width:100%; padding:8px; margin-top:6px;" placeholder="e.g. 0712345678"/>
    </div>

    <div style="margin-top:12px">
      <button id="doPay" class="btn">Simulate Payment</button>
    </div>

    <div id="msg" style="margin-top:10px" class="muted"></div>
  `;

  document.getElementById("doPay").addEventListener("click", async () => {
    const payPhone = document.getElementById("payPhone").value.trim();
    if (!payPhone) return alert("Enter pay phone");

    // 1) If booking doesn't exist (unlikely), create it
    let b = booking;
    if (!b) {
      const createRes = await fetch(`${API}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          houseId: house.id,
          name: USER ? USER.name : "Guest",
          phone: USER ? USER.phone : payPhone,
          payFrom: payPhone
        })
      });
      const createData = await createRes.json();
      if (!createData.success) return alert("Could not create booking");
      b = createData.booking;
    }

    // 2) Simulate payment: call backend to mark booking as paid
    document.getElementById("msg").innerText = "Processing payment...";
    const payRes = await fetch(`${API}/bookings/${b.id}/pay`, { method: "POST" });
    const payData = await payRes.json();
    if (!payData.success) {
      document.getElementById("msg").innerText = "Payment failed: " + (payData.message || "");
      return;
    }

    // 3) On success, redirect to profile
    alert("Payment successful — booking confirmed. It will appear in your profile.");
    window.location.href = "profile.html";
  });
}

load().catch(err => {
  console.error(err);
  content.innerHTML = "<div>Error loading payment</div>";
});
