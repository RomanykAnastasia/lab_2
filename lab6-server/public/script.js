const feedbackForm = document.getElementById("feedbackForm")
const statusText = document.getElementById("status")

feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
    }

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        statusText.textContent = result.message

        if (response.ok) {
            feedbackForm.reset()
        }
    } catch (error) {
        statusText.textContent = "Помилка з'єднання із сервером"
    }
})