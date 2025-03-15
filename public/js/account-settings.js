document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/user", { method: "GET", credentials: "include" });
        const user = await res.json();

        if (!res.ok) throw new Error(user.error || "Failed to fetch user data");

        document.getElementById("first-name").value = user.firstName;
        document.getElementById("last-name").value = user.lastName;
        document.getElementById("email").value = user.email;
        document.getElementById("career-goals").value = user.careerGoals || "";
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
});

document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const careerGoals = document.getElementById("career-goals").value;

    try {
        const res = await fetch("/api/user", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, careerGoals }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update profile");

        alert("Profile updated successfully!");
    } catch (error) {
        console.error("❌ Update Error:", error.message);
        alert("Error updating profile.");
    }
});
