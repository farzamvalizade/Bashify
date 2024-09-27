document.addEventListener('DOMContentLoaded', function() {
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const username = '{{ user.username }}'; // Ensure this is correctly injected

    terminalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const command = terminalInput.value.trim();
        if (command) {
            terminalOutput.innerHTML += `<p><span>$</span> ${command}</p>`;
            terminalInput.value = '';

            fetch(`/account/api/execute-command/?username=${encodeURIComponent(username)}&command=${encodeURIComponent(command)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.output) {
                        terminalOutput.innerHTML += `<p>${data.output}</p>`;
                    } else {
                        terminalOutput.innerHTML += `<p>Command not found: ${command}</p>`;
                    }
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    });
});
