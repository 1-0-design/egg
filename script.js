document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const eggsContainer = document.querySelector('.eggs-container');
    const textarea = document.querySelector('textarea');
    const sendButton = document.querySelector('.send-button');
    const voiceButton = document.querySelector('.voice-button');
    const chatMessages = document.querySelector('.chat-messages');
    const resultView = document.querySelector('.result-view');
    
    // Example of adding a new egg when sending a message
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Create a new egg for the task
        createEgg(message);
        
        // Add assistant response
        setTimeout(() => {
            addMessage('I\'m working on your request. This may take a moment...', 'assistant');
        }, 500);
        
        // Clear input
        textarea.value = '';
    });
    
    // Handle enter key in textarea
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Function to add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to create a new egg
    function createEgg(prompt) {
        // Create a short summary (first 20 chars)
        const summary = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;
        
        // Create egg element
        const eggDiv = document.createElement('div');
        eggDiv.classList.add('egg', 'processing');
        
        eggDiv.innerHTML = `
            <div class="egg-content">
                <div class="egg-summary">${summary}</div>
                <div class="egg-preview">
                    <img src="placeholder-favicon.png" alt="Website Favicon" class="favicon">
                    <div class="preview-window">
                        <div class="placeholder-preview">Processing...</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to show full result when clicked
        eggDiv.addEventListener('click', () => {
            showResult(prompt, eggDiv.classList.contains('completed'));
        });
        
        // Add to container
        eggsContainer.prepend(eggDiv);
        
        // Simulate processing completion after some time
        setTimeout(() => {
            completeEgg(eggDiv);
        }, 5000); // 5 seconds for demo
    }
    
    // Function to mark egg as completed
    function completeEgg(eggElement) {
        eggElement.classList.remove('processing');
        eggElement.classList.add('completed');
        
        // Replace content with summary and checkmark
        const summary = eggElement.querySelector('.egg-summary').textContent;
        eggElement.innerHTML = `
            <div class="egg-content">
                <div class="egg-summary">${summary}</div>
                <div class="checkmark">✓</div>
            </div>
        `;
        
        // Add completion message to chat
        addMessage('I\'ve completed your request! Click the egg to view the full results.', 'assistant');
    }
    
    // Function to show the full-screen result
    function showResult(prompt, isCompleted) {
        if (!isCompleted) {
            alert('This task is still processing. Please wait for it to complete.');
            return;
        }
        
        // Set the title
        document.querySelector('.result-title').textContent = prompt.length > 30 ? 
            prompt.substring(0, 30) + '...' : prompt;
        
        // Add some example content
        document.querySelector('.result-content').innerHTML = `
            <h2>Results for: ${prompt}</h2>
            <p>Here's the detailed information you requested. This is a placeholder that would show the complete results from the AI assistant.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, nec aliquam nisl nisl nec.</p>
        `;
        
        // Show the result view
        resultView.style.display = 'flex';
        
        // Add close button functionality
        document.querySelector('.close-button').addEventListener('click', () => {
            resultView.style.display = 'none';
        });
        
        // Add share button functionality
        document.querySelector('.share-button').addEventListener('click', () => {
            const dummyLink = `https://egg.app/share/${Math.random().toString(36).substring(2, 10)}`;
            navigator.clipboard.writeText(dummyLink)
                .then(() => alert(`Link copied to clipboard: ${dummyLink}`))
                .catch(err => console.error('Failed to copy: ', err));
        });
    }
    
    // Handle existing eggs in the interface
    document.querySelectorAll('.egg').forEach(egg => {
        egg.addEventListener('click', () => {
            const summary = egg.querySelector('.egg-summary').textContent;
            showResult(summary, egg.classList.contains('completed'));
        });
    });
});