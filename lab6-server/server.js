const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const Mailjet = require("node-mailjet")

dotenv.config()

const app = express()
const port = 3000

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
)

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "Заповніть всі поля" })
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Некоректний email" })
    }

    try {
        await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAIL_FROM_EMAIL,
                        Name: process.env.MAIL_FROM_NAME
                    },
                    To: [
                        {
                            Email: process.env.MAIL_TO_EMAIL,
                            Name: process.env.MAIL_TO_NAME
                        }
                    ],
                    Subject: subject,
                    TextPart:
                        "Ім'я: " + name + "\n" +
                        "Email: " + email + "\n" +
                        "Повідомлення: " + message
                }
            ]
        })

        res.json({ message: "Відправлено" })
    } catch (error) {
        res.status(500).json({ message: "Помилка" })
    }
})

app.listen(port, () => {
    console.log("Server started on http://localhost:3000")
})