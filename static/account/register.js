document.addEventListener("DOMContentLoaded", function() {
    const text = "Sign Up In Bashify ..."; // متنی که تایپ خواهد شد
    let index = 0;
    const speed = 75; // سرعت تایپ

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("typing-text").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
});