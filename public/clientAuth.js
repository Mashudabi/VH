// ========== CLIENT PAGE PROTECTION ==========

// Check client login token
function getClientToken() {
    return localStorage.getItem("clientToken");
}

// Redirect to client login if not logged in
function protectClientPage() {
    if (!getClientToken()) {
        alert("Please login first");
        window.location.href = "login.html";
    }
}
