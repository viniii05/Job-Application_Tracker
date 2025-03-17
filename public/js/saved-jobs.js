document.addEventListener("DOMContentLoaded", async () => {
    loadSavedJobs();
});

async function loadSavedJobs() {
    try {
        const res = await fetch("/api/saved-jobs", { method: "GET", credentials: "include" });
        const jobs = await res.json();

        const jobList = document.getElementById("job-list");
        jobList.innerHTML = "";

        jobs.forEach(job => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${job.jobTitle}</strong> at ${job.company}
                <p>📅 Saved on: ${new Date(job.dateSaved).toLocaleDateString()}</p>
                <a href="${job.jobUrl}" target="_blank">🔗 Job Link</a>
                <button onclick="deleteSavedJob(${job.id})">❌ Delete</button>
            `;
            jobList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading saved jobs:", error);
    }
}

document.getElementById("job-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const jobData = {
        jobTitle: document.getElementById("job-title").value,
        company: document.getElementById("job-company").value,
        jobUrl: document.getElementById("job-url").value,
    };

    try {
        const res = await fetch("/api/saved-jobs", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
        });

        if (res.ok) {
            loadSavedJobs();
        }
    } catch (error) {
        console.error("Error saving job:", error);
    }
});

async function deleteSavedJob(id) {
    try {
        const res = await fetch(`/api/saved-jobs/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) {
            loadSavedJobs();
        }
    } catch (error) {
        console.error("Error deleting saved job:", error);
    }
}
