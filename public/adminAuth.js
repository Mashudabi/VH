// ========== ADMIN PAGE PROTECTION ==========

// Get admin token
function getAdminToken() {
    return localStorage.getItem("adminToken");
}

// Redirect to admin login if not logged in
function protectAdminPage() {
    if (!getAdminToken()) {
        alert("Admin login required");
        window.location.href = "admin-login.html";
    }
}
