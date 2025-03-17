document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        alert("Signup successful! You can now login.");
        window.location.href = "/login.html"; 
    } else {
        alert(data.error);
    }
});
