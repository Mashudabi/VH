document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!phone || !pass) {
    alert("⚠️ Please enter both phone and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, pass })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "❌ Invalid phone or password");
      return;
    }

    // ✅ Save user session
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));

    alert("✅ Login successful!");

    // ✅ Redirect based on role
    if (data.user.isAdmin === true) {
      window.location.href = "admin_dashboard.html"; // Admin page
    } else {
      window.location.href = "index.html"; // Regular user home page
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Could not connect to the server. Please check your connection.");
  }
});
