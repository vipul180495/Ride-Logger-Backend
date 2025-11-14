import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(re_NbQi6b4m_HEwsDayRh7PWzyfbuzaC1Pcb);

app.post("/send-csv", async (req, res) => {
  try {
    const { csvContent, filename } = req.body;

    await resend.emails.send({
      from: "Ride Logger <onboarding@resend.dev>",
      to: "vipul.prajapati74@gmail.com",
      subject: `Ride Log CSV - ${filename}`,
      text: "Attached is the exported CSV file.",
      attachments: [
        {
          filename,
          content: csvContent,
        },
      ],
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.get("/", (req, res) => {
  res.send("Ride Logger Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});




