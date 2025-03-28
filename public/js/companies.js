document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/companies", { method: "GET", credentials: "include" });
        const companies = await res.json();
        console.log(companies);
        if (!res.ok) throw new Error(companies.error || "Failed to load companies");

        const companyList = document.getElementById("company-list");
        companyList.innerHTML = "";
        companies.forEach(company => {
            const row = `
                <tr>
                    <td>${company.companyName}</td>
                    <td>${company.industry || "N/A"}</td>
                    <td>${company.companySize  || "N/A"}</td>
                    <td>${company.location  || "N/A"}</td>
                    <td>${company.notes  || "N/A"}</td>
                    <td>
                        <button class="edit-btn" onclick="editCompany(${company.id})">✏️</button>
                        <button class="delete-btn" onclick="deleteCompany(${company.id})">🗑️</button>
                    </td>
                    </tr>
            `;
            companyList.innerHTML += row;
        });
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
});

// Delete Company
async function deleteCompany(id) {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
        const res = await fetch(`/api/companies/${id}`, { method: "DELETE", credentials: "include" });
        if (!res.ok) throw new Error("Failed to delete company");

        location.reload(); // Refresh the page
    } catch (error) {
        console.error("Delete Error:", error.message);
    }
}

// Redirect to Add Company Page
document.getElementById("add-job-btn").addEventListener("click", () => {
    window.location.href = "/add-company.html";
});