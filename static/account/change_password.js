document.addEventListener("DOMContentLoaded", function() {
    const text = "Change your Password .."; // متنی که تایپ خواهد شد
    let index = 0;
    const speed = 100; // سرعت تایپ

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("typing-text").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
});