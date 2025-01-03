document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const dateDisplay = document.getElementById('date');
    const clearAllBtn = document.getElementById('clearAllBtn'); // Clear all button reference
    const deleteAllBtn = document.getElementById('deleteAllBtn'); // Delete all button reference

    // Set today's date in the title
    const today = new Date().toLocaleDateString();
    dateDisplay.innerText = `Today's Date: ${today}`;
    
    // Load tasks from local storage
    chrome.storage.sync.get(['tasks'], function (data) {
        const tasks = data.tasks || [];
        renderTasks(tasks);
    });

    // Add task functionality
    addTaskBtn.addEventListener('click', function () {
        const taskName = prompt("Enter the task:");
        if (taskName) {
            chrome.storage.sync.get(['tasks'], function (data) {
                const tasks = data.tasks || [];
                tasks.push({ name: taskName, checked: false });
                chrome.storage.sync.set({ tasks: tasks });
                renderTasks(tasks);
            });
        }
    });

    // Clear all tasks functionality (remove all checkmarks)
    clearAllBtn.addEventListener('click', function () {
        chrome.storage.sync.get(['tasks'], function (data) {
            const tasks = data.tasks || [];
            tasks.forEach(task => task.checked = false); // Uncheck all tasks
            chrome.storage.sync.set({ tasks: tasks });
            renderTasks(tasks); // Re-render the task list after clearing checkmarks
        });
    });

    // Delete all tasks functionality
    deleteAllBtn.addEventListener('click', function () {
        chrome.storage.sync.set({ tasks: [] }); // Clear all tasks from storage
        renderTasks([]); // Re-render the task list (empty list)
    });

    // Render the tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.sort((a, b) => a.checked - b.checked);

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.checked ? 'checked' : ''} data-index="${index}" />
                <span style="text-decoration: ${task.checked ? 'line-through' : 'none'};">${task.name}</span>
                <button class="deleteBtn" data-index="${index}">Delete</button>
            `;

            // Task checkbox change handler
            li.querySelector('input').addEventListener('change', function () {
                task.checked = this.checked;
                chrome.storage.sync.set({ tasks: tasks });
                renderTasks(tasks); // Re-render the list after the checkbox change
            });

            // Delete button click handler for individual task
            li.querySelector('.deleteBtn').addEventListener('click', function () {
                tasks.splice(index, 1); // Remove the task from the array
                chrome.storage.sync.set({ tasks: tasks });
                renderTasks(tasks); // Re-render the task list after deletion
            });

            taskList.appendChild(li);
        });
    }
});
