document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const dateDisplay = document.getElementById('date');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const timers = new Map(); // Track timers
    const today = new Date().toLocaleDateString();

    dateDisplay.innerText = `Today's Date: ${today}`;

    chrome.storage.sync.get(['tasks'], function (data) {
        const tasks = data.tasks || [];
        renderTasks(tasks);
    });

    addTaskBtn.addEventListener('click', function () {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter task';
        inputField.className = 'inline-task-input';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'inline-task-save';

        saveBtn.addEventListener('click', function () {
            const taskName = inputField.value.trim();
            if (taskName) {
                chrome.storage.sync.get(['tasks'], function (data) {
                    const tasks = data.tasks || [];
                    tasks.push({ name: taskName, checked: false, elapsedTime: 0, isRunning: false, startTime: null });
                    chrome.storage.sync.set({ tasks });
                    renderTasks(tasks);
                });
            }
            inputField.remove();
            saveBtn.remove();
        });

        taskList.appendChild(inputField);
        taskList.appendChild(saveBtn);
    });

    clearAllBtn.addEventListener('click', function () {
        chrome.storage.sync.get(['tasks'], function (data) {
            const tasks = data.tasks || [];
            tasks.forEach(task => task.checked = false);
            chrome.storage.sync.set({ tasks });
            renderTasks(tasks);
        });
    });

    deleteAllBtn.addEventListener('click', function () {
        chrome.storage.sync.set({ tasks: [] });
        renderTasks([]);
    });

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.sort((a, b) => a.checked - b.checked);

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.checked ? 'checked' : ''} data-index="${index}" />
                <span class="task-name" style="text-decoration: ${task.checked ? 'line-through' : 'none'};">${task.name}</span>
                <div>
                    <span class="timer">${formatTime(task.elapsedTime)}</span>
                    <button class="timerToggleBtn" data-index="${index}">${task.isRunning ? '⏸️' : '▶️'}</button>
                    <button class="editBtn" data-index="${index}">✏️</button>
                    <button class="deleteBtn" data-index="${index}">🗑️</button>
                </div>
            `;

            li.querySelector('input').addEventListener('change', function () {
                task.checked = this.checked;
                chrome.storage.sync.set({ tasks });
                renderTasks(tasks);
            });

            li.querySelector('.deleteBtn').addEventListener('click', function () {
                clearInterval(timers.get(index)); // Ensure timer is stopped
                timers.delete(index);
                tasks.splice(index, 1);
                chrome.storage.sync.set({ tasks });
                renderTasks(tasks);
            });

            const editBtn = li.querySelector('.editBtn');
            editBtn.addEventListener('click', function () {
                const taskNameSpan = li.querySelector('.task-name');
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = task.name;
                editInput.className = 'edit-task-input';

                const saveEditBtn = document.createElement('button');
                saveEditBtn.textContent = 'Save';
                saveEditBtn.className = 'save-edit-btn';

                saveEditBtn.addEventListener('click', function () {
                    const newName = editInput.value.trim();
                    if (newName) {
                        task.name = newName;
                        chrome.storage.sync.set({ tasks });
                        renderTasks(tasks);
                    }
                });

                taskNameSpan.replaceWith(editInput);
                editBtn.replaceWith(saveEditBtn);
            });

            const timerToggleBtn = li.querySelector('.timerToggleBtn');

            timerToggleBtn.addEventListener('click', function () {
                if (task.isRunning) {
                    clearInterval(timers.get(index));
                    timers.delete(index);
                    task.isRunning = false;
                } else {
                    if (!task.startTime) task.startTime = Date.now() - task.elapsedTime * 1000;
                    timers.set(index, setInterval(() => {
                        const now = Date.now();
                        task.elapsedTime = Math.floor((now - task.startTime) / 1000);
                        li.querySelector('.timer').textContent = formatTime(task.elapsedTime);
                        chrome.storage.sync.set({ tasks });
                    }, 1000));
                    task.isRunning = true;
                }
                chrome.storage.sync.set({ tasks });
                timerToggleBtn.textContent = task.isRunning ? '⏸️' : '▶️';
            });

            taskList.appendChild(li);
        });
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}h ${mins}m ${secs}s`;
    }

    const downloadReportBtn = document.createElement('button');
    downloadReportBtn.textContent = 'Download Weekly Report';
    downloadReportBtn.style.marginTop = '10px';
    downloadReportBtn.addEventListener('click', function () {
        chrome.storage.sync.get(['tasks'], function (data) {
            const tasks = data.tasks || [];
            const reportData = tasks.map(task => `${task.name}, Time Spent: ${formatTime(task.elapsedTime)}`).join('\n');
            const blob = new Blob([reportData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Weekly_Report_${today}.txt`;
            link.click();
            URL.revokeObjectURL(url);
        });
    });

    document.body.appendChild(downloadReportBtn);
});
