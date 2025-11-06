const API = "http://localhost:5000/api";

// DOM elements
const nameInput = document.getElementById("suName");
const phoneInput = document.getElementById("suPhone");
const passInput = document.getElementById("suPass");
const pass2Input = document.getElementById("suPass2");
const signupBtn = document.getElementById("signupBtn");
const loginLink = document.getElementById("loginLink");

// ===== Show login page =====
if (loginLink) {
  loginLink.addEventListener("click", () => {
    window.location = "login.html";
  });
}

// ===== SIGNUP FUNCTION =====
async function signup() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const pass = passInput.value.trim();
  const pass2 = pass2Input.value.trim();

  if (!name || !phone || !pass || !pass2) {
    return alert("Please fill all fields.");
  }

  if (pass !== pass2) {
    return alert("Passwords do not match.");
  }

  try {
    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, pass })
    });

    const data = await res.json();

    if (!data.success) {
      return alert(data.message || "Signup failed");
    }

    alert("Account created successfully! Please log in.");
    window.location = "login.html";
  } catch (err) {
    console.error("Signup error:", err);
    alert("Server error. Please try again later.");
  }
}

// ===== Bind Button =====
if (signupBtn) {
  signupBtn.addEventListener("click", signup);
}
