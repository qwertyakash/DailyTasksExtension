document.addEventListener('DOMContentLoaded', () => {
    // Function to create and show the notification
    function createNotification() {
        // Check if the notification already exists
        if (document.getElementById('topNotificationBar')) return;

        // Create the notification container
        const notificationBar = document.createElement('div');
        notificationBar.id = 'topNotificationBar';
        Object.assign(notificationBar.style, {
            position: 'fixed',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%) translateY(-100%)',
            width: '90%',
            maxWidth: '600px',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            padding: '15px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 0 8px 8px',
            zIndex: '10000',
            transition: 'transform 0.5s ease-in-out'
        });

        // Add content to the notification
        notificationBar.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <span style="flex-grow: 1;">📋 Don't forget to check your task list for todaysss!</span>
                <button id="closeNotificationBtn" style="
                    margin-left: 15px;
                    background-color: #f44336;
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">OK</button>
            </div>
        `;

        document.body.appendChild(notificationBar);

        // Animate the notification into view
        setTimeout(() => {
            notificationBar.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);

        // Close button functionality
        document.getElementById('closeNotificationBtn').addEventListener('click', () => {
            notificationBar.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => notificationBar.remove(), 500000); // Remove after animation
        });

        // Optionally hide after 10 seconds
        setTimeout(() => {
            if (document.getElementById('topNotificationBar')) {
                document.getElementById('topNotificationBar').style.transform = 'translateX(-50%) translateY(-100%)';
                setTimeout(() => document.getElementById('topNotificationBar').remove(), 500000);
            }
        }, 1000000);
    }

    // Check if the notification should be shown
    chrome.storage.sync.get(['reminderShownDate'], (data) => {
        const lastShownDate = data.reminderShownDate;
        const today = new Date().toLocaleDateString();
        console.log("hello inside content");
       // if (lastShownDate !== today) {
            createNotification();
            chrome.storage.sync.set({ reminderShownDate: today });
       // }
    });
});
