// Export as JSON
function exportAsJSON(tasks) {
    const jsonContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "workflow.json");
    document.body.appendChild(link);
    link.click();
}

// Export as CSV
function exportAsCSV(tasks) {
    const csvContent = "data:text/csv;charset=utf-8," +
        tasks.map(task => Object.values(task).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workflow.csv");
    document.body.appendChild(link);
    link.click();
}

// Export workflow
function exportWorkflow(format) {
    fetch('/get_tasks')
        .then(response => response.json())
        .then(data => {
            if (format === 'json') {
                exportAsJSON(data);
            } else if (format === 'csv') {
                exportAsCSV(data);
            }
        })
        .catch(error => console.error("Error exporting workflow:", error));
}

// Import workflow from JSON
function importWorkflow() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a JSON file to import.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const tasks = JSON.parse(e.target.result);
        fetch('/import_tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasks)
        })
        .then(response => response.json())
        .then(() => {
            alert("Workflow imported successfully!");
            window.location.href = '/'; // Redirect to home page
        })
        .catch(error => console.error("Error importing workflow:", error));
    };
    reader.readAsText(file);
}

// Load notification preference
function loadNotificationPreference() {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
    notificationToggle.checked = notificationEnabled;
}

// Save notification preference
function saveNotificationPreference() {
    const notificationToggle = document.getElementById('notificationToggle');
    localStorage.setItem('notificationEnabled', notificationToggle.checked);
}

// Add event listener to the notification toggle
document.getElementById('notificationToggle').addEventListener('change', saveNotificationPreference);

// Call these functions on page load
document.addEventListener('DOMContentLoaded', function () {
    loadNotificationPreference();
});
