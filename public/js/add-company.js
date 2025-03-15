document.getElementById("add-company-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const companyName = document.getElementById("company-name").value.trim();
    const industry = document.getElementById("industry").value.trim();
    const companySize = document.getElementById("company-size").value.trim();
    const location = document.getElementById("location").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!companyName) {
        alert("Company name is required.");
        return;
    }

    try {
        const res = await fetch("/api/companies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Include auth cookies
            body: JSON.stringify({ companyName, industry, companySize, location, notes }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Company added successfully!");
            window.location.href = "/dashboard.html";  // Redirect to dashboard
        } else {
            alert(data.error || "Failed to add company");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
        alert("Server error. Please try again later.");
    }
});
