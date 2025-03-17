document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Load data on page load
        await loadDashboardStats();
        await loadJobApplications();
        await loadReminders();

        document.getElementById("search-btn").addEventListener("click", filterJobs);
        document.getElementById("search-input").addEventListener("input", filterJobs);
        document.getElementById("status-filter").addEventListener("change", filterJobs);

        document.getElementById("logout-btn").addEventListener("click", async () => {
            await fetch("/logout", { method: "GET", credentials: "include" });
            window.location.href = "/login.html";
        });

    } catch (error) {
        console.error("❌ Error initializing dashboard:", error.message);
    }
});

let allJobs = [];

let applicationChart = null;

async function loadDashboardStats() {
    try {
        const res = await fetch("/jobs/stats", { method: "GET", credentials: "include" });
        const stats = await res.json();

        document.getElementById("total-applications").textContent = stats.totalApplications;
        document.getElementById("interview-count").textContent = stats.interviewScheduled;
        document.getElementById("offer-count").textContent = stats.offerReceived;
        document.getElementById("rejection-count").textContent = stats.rejected;

        renderChart(stats); 
    } catch (error) {
        console.error("❌ Error loading stats:", error.message);
    }
}

async function loadJobApplications() {
    try {
        const res = await fetch("/jobs", { method: "GET", credentials: "include" });
        const data = await res.json();

        if (!data.jobs || !Array.isArray(data.jobs)) {
            console.error("❌ API Error: Expected 'data.jobs' to be an array but got:", data);
            return;
        }

        allJobs = data.jobs; 
        displayJobs(allJobs);
    } catch (error) {
        console.error("❌ Error loading job applications:", error.message);
    }
}
function displayJobs(jobs) {
    const jobList = document.getElementById("applications-list");
    jobList.innerHTML = ""; 

    if (jobs.length === 0) {
        jobList.innerHTML = "<li>No job applications found.</li>";
        return;
    }

    jobs.forEach(job => {
        const listItem = document.createElement("li");
        listItem.textContent = `${job.position} at ${job.companyName} - ${job.status}`;
        jobList.appendChild(listItem);
    });
}

function filterJobs() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const statusFilter = document.getElementById("status-filter").value;

    const filteredJobs = allJobs.filter(job => {
        const matchesSearch = job.position.toLowerCase().includes(searchInput) || 
                              job.companyName.toLowerCase().includes(searchInput);
        const matchesStatus = statusFilter === "" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    displayJobs(filteredJobs);
}

async function loadReminders() {
    try {
        const res = await fetch("/jobs/reminders", { method: "GET", credentials: "include" });
        const reminders = await res.json();

        const reminderList = document.getElementById("reminder-list");
        reminderList.innerHTML = "";

        reminders.forEach(reminder => {
            const listItem = document.createElement("li");
            listItem.textContent = `Follow-up for ${reminder.position} at ${reminder.companyName} on ${reminder.followUpDate}`;
            reminderList.appendChild(listItem);
        });
    } catch (error) {
        console.error("❌ Error loading reminders:", error.message);
    }
}

function renderChart(stats) {
    const ctx = document.getElementById("application-chart").getContext("2d");

    if (applicationChart) {
        applicationChart.destroy();
    }
    applicationChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Applied", "Interviews", "Offers", "Rejected"],
            datasets: [{
                label: "Application Status",
                data: [
                    stats.totalApplications,
                    stats.interviewScheduled,
                    stats.offerReceived,
                    stats.rejected
                ],
                backgroundColor: ["#3498db", "#f1c40f", "#2ecc71", "#e74c3c"],
            }]
        }
    });
}
