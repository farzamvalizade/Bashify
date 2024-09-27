document.addEventListener("DOMContentLoaded", function() {
    const text = "Welcome to Bashify"; // Text to type
    let index = 0;
    const speed = 75; // Typing speed

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("typing-text").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
});
