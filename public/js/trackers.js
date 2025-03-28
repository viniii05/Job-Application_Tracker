document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/jobs", { method: "GET", credentials: "include" });
        const data = await res.json();

        console.log("🚀 Server Response:", data);

        if (!res.ok) throw new Error(data.error || "Failed to load jobs");
        if (!data.jobs) throw new Error("API response does not contain 'jobs'");


        const jobList = document.getElementById("job-list");
        jobList.innerHTML = "";

        data.jobs.forEach(job => {
            const row = `
                <tr>
                    <td>${job.position}</td>
                    <td>${job.companyName}</td>
                    <td>${job.maxSalary || "N/A"}</td>
                    <td>${job.location || "N/A"}</td>
                    <td>${job.status}</td>
                    <td>${job.applicationDate ? new Date(job.applicationDate).toLocaleDateString('en-GB') : "N/A"}</td>
                    <td>${job.followUpDate ? new Date(job.followUpDate).toLocaleDateString('en-GB') : "N/A"}</td>

                </tr>
            `;
            jobList.innerHTML += row;
        });
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
});

document.getElementById("add-job-btn").addEventListener("click", () => {
    window.location.href = "/add-job.html";
});
