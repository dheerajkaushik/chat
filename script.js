// --- DOM Elements ---
const loginScreen = document.getElementById('login-screen');

// 🛑 FIX 1: Use the new ID for the main two-column wrapper
const mainChatWrapper = document.getElementById('main-chat-wrapper'); 

// The following elements are now inside the mainChatWrapper, but their IDs are still valid
const usernameInput = document.getElementById('username-input');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
// NOTE: I am assuming you want the room name to display in the main chat header
const roomNameDisplay = document.getElementById('room-name-main'); 
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

// --- State ---
let username = '';
let room = '';
let pieSocket;
let chatChannel;

// --- WebSocket Configuration ---
// Replace with your actual credentials from PieSocket
const PIESOCKET_CLUSTER_ID = 'free.blr2'; 
const PIESOCKET_API_KEY = '31Z20obdYkLXhVrOUXVEVkBxviWJLWOqxeZZaLQ5';

// --- Functions ---

/**
 * Formats basic markdown-like syntax into HTML.
 * Supports **bold** and *italics*.
 */
function formatMessage(text) {
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
    return html;
}

/**
 * Scrolls the chat messages container to the bottom.
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Displays a message in the chat window.
 */
function displayMessage(data) {
    // Check 1: Ensure data is valid and has a text property
    if (!data || typeof data.text !== 'string') {
        console.warn("Received message data is incomplete or invalid.", data);
        return; 
    }
    
    // Check 2: Only proceed if this is a message we want to display (chat or system)
    if (data.type !== 'chat' && data.type !== 'system') {
        return; // Ignore other PieSocket events
    }
    
    const messageElement = document.createElement('div');
    
    // System messages for joins/leaves
    if (data.type === 'system') {
        messageElement.className = 'system-message';
        messageElement.innerHTML = `<p>${data.text}</p>`;
    } else { // Regular chat messages
        const isSent = data.username === username;
        messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const formattedText = formatMessage(data.text);
        
        // Using the structure designed for the new CSS
        messageElement.innerHTML = `
            <div class="message-bubble-wrapper">
                <div class="meta">
                    <span class="username">${data.username}</span>
                    <span class="timestamp">${data.timestamp}</span>
                </div>
                <div class="text-bubble">
                    <div class="text">${formattedText}</div>
                </div>
            </div>
            <div class="user-avatar-in-chat">
                <i class="fa-solid fa-user"></i> 
            </div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Handles the 'Join Chat' button click.
 */
joinBtn.addEventListener('click', () => {
    const enteredUsername = usernameInput.value.trim();
    const enteredRoom = roomInput.value.trim();

    if (enteredUsername === '' || enteredRoom === '') {
        alert('Please enter both a username and a room name.');
        return;
    }

    username = enteredUsername;
    room = enteredRoom;

    // Switch screens: This is where the error was happening
    loginScreen.classList.add('hidden');
    mainChatWrapper.classList.remove('hidden'); // This variable is now correctly defined
    
    // Update the room name in the new main chat header
    roomNameDisplay.textContent = room; 

    connectToWebSocket();
});

/**
 * Connects to the PieSocket WebSocket channel.
 */
function connectToWebSocket() {
    pieSocket = new PieSocket({
        clusterId: PIESOCKET_CLUSTER_ID,
        apiKey: PIESOCKET_API_KEY,
        notifySelf: true, 
        // Authentication
        auth: {
            username: username
        }
    });

    // Subscribe to the channel (our chat room)
    const channel = pieSocket.subscribe(room);
    chatChannel = channel;
    
    // Event: Connection successful
    channel.on('open', () => {
        console.log('WebSocket connection established!');
        console.log('Chat Channel is READY:', chatChannel);
    });
    
    // Event: A new message is received
    channel.on('message', (event) => {
        console.log('--- MESSAGE RECEIVED ---'); 
        console.log('Raw PieSocket Event:', event); 
        
        try {
            // Step 1: Parse the initial PieSocket event object
            const outerData = JSON.parse(event.data); 
            
            let innerData;

            // Step 2: Check if the message is nested inside an 'event' property (double-encoding issue)
            if (outerData && outerData.event) {
                innerData = JSON.parse(outerData.event);
            } else {
                innerData = outerData;
            }

            console.log('Final Parsed Custom Data:', innerData);
            
            // Pass the correctly parsed data to your display function
            displayMessage(innerData); 
            
        } catch (e) {
            console.error('Error processing received event data:', e);
        }
    });
}

/**
 * Sends a chat message.
 */
function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText === '') return;
    if (!chatChannel) {
         console.error('Chat channel not active. Cannot send message.');
         return;
    }

    const messageData = {
        type: 'chat',
        username: username,
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Publish the message to the channel
    chatChannel.publish(JSON.stringify(messageData));

    // Clear input and focus
    messageInput.value = '';
    messageInput.focus();
}

// --- Event Listeners ---
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Prevents sending if Shift+Enter is pressed for a newline
        event.preventDefault(); // Stop the default 'Enter' newline behavior
        sendMessage();
        console.log("message sent");
    }
});