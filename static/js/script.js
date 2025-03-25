document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const ctx = document.getElementById('workflowChart').getContext('2d');
    const taskTableBody = document.querySelector('#taskTable tbody');
    let workflowChart;

    // Fetch tasks and update chart and table
    function fetchTasks() {
        fetch('/get_tasks')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched tasks:", data); // Debugging line
                updateChart(data);
                updateTaskTable(data);
                checkTaskReminders(data); // Check for reminders
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }

    // Update Chart.js visualization
    function updateChart(tasks) {
        const labels = tasks.map(task => task.name);
        const data = tasks.map(task => task.time);

        if (workflowChart) {
            workflowChart.destroy();
        }

        workflowChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Time Required (hours)',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Update task table
    function updateTaskTable(tasks) {
        taskTableBody.innerHTML = ''; // Clear the table
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.time}</td>
                <td>${task.assignee || 'Unassigned'}</td>
                <td>${task.startTime || 'N/A'}</td>
                <td>${task.endTime || 'N/A'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            taskTableBody.appendChild(row);
        });
    }

    // Add task
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskTime = document.getElementById('taskTime').value;
        const taskDependencies = document.getElementById('taskDependencies').value.split(',');
        const taskAssignee = document.getElementById('taskAssignee').value;
        const taskStartTime = document.getElementById('taskStartTime').value;
        const taskEndTime = document.getElementById('taskEndTime').value;

        const task = {
            name: taskName,
            time: parseFloat(taskTime),
            dependencies: taskDependencies,
            assignee: taskAssignee,
            startTime: taskStartTime,
            endTime: taskEndTime
        };

        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks();
            taskForm.reset();
        })
        .catch(error => console.error("Error adding task:", error));
    });

    // Delete task
    window.deleteTask = function (taskName) {
        fetch('/delete_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: taskName })
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); // Refresh the task list
        })
        .catch(error => console.error("Error deleting task:", error));
    };

    // Clear all tasks
    document.getElementById('clearTasks').addEventListener('click', function () {
        fetch('/clear_tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); // Refresh the task list
        })
        .catch(error => console.error("Error clearing tasks:", error));
    });

    // Check for due tasks and send reminders
    function checkTaskReminders(tasks) {
        const notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
        if (!notificationEnabled) return;

        tasks.forEach(task => {
            if (task.endTime) {
                const endTime = new Date(task.endTime);
                const now = new Date();
                const timeDifference = endTime - now; // Difference in milliseconds

                // If the task is due in 1 hour or less
                if (timeDifference > 0 && timeDifference <= 3600000) { // 3600000 ms = 1 hour
                    sendReminder(task);
                }
            }
        });
    }

    // Send a browser notification
    function sendReminder(task) {
        if (Notification.permission === 'granted') {
            new Notification(`Task Due Soon: ${task.name}`, {
                body: `Your task "${task.name}" is due at ${task.endTime}.`,
                icon: 'https://example.com/icon.png' // Add an icon if desired
            });
        }
    }

    // Request notification permission
    function requestNotificationPermission() {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    // Call this function when the page loads
    requestNotificationPermission();

    // Initial fetch
    fetchTasks();
});
