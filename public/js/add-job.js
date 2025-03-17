document.getElementById("resume").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById("file-name").textContent = `Selected File: ${file.name}`;
    } else {
        document.getElementById("file-name").textContent = "";
    }
});

document.getElementById("job-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("resume");
    let fileUrl = "";

    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const uploadRes = await fetch("/jobs/upload", {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
            alert("File upload failed");
            return;
        }

        fileUrl = uploadData.fileUrl;
    }

    const jobData = {
        companyName: document.getElementById("companyName").value,
        position: document.getElementById("position").value,
        status: document.getElementById("status").value,
        applicationDate: document.getElementById("applicationDate").value,
        followUpDate: document.getElementById("followUpDate").value,
        notes: document.getElementById("notes").value,
        attachmentUrl: fileUrl,
    };

    try {
        const res = await fetch("/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(jobData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add job");

        alert("Job added successfully!");
        window.location.href = "/trackers.html"; 
    } catch (error) {
        alert("Error: " + error.message);
    }
});
