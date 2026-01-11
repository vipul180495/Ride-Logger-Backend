/*import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

// Allow all origins
app.use(cors({
  origin: "*"  
}));

app.use(express.json());

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-csv", async (req, res) => {
  try {
    const { csvContent, filename } = req.body;

    // Convert CSV content to base64 for safe email attachment
    const base64Content = Buffer.from(csvContent, "utf-8").toString("base64");

    await resend.emails.send({
      from: "Ride Logger <onboarding@resend.dev>",
      to: "vipul.prajapati74@gmail.com",
      subject: `Ride Log CSV - ${filename}`,
      text: "Attached is the exported CSV file.",
      attachments: [
        {
          filename,
          type: "text/csv",        // ensures email client recognizes it as CSV
          content: base64Content,  // base64-encoded content
          encoding: "base64",      // required to decode correctly
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
});*
====================================================================================
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "5mb" })); // ensure large CSVs work

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-csv", async (req, res) => {
  try {
    const { csvContent, filename } = req.body;

    // **Important:** DO NOT convert to base64 manually
    // Resend will handle the attachment encoding properly
    await resend.emails.send({
      from: "Ride Logger <onboarding@resend.dev>",
      to: "vipul.prajapati74@gmail.com",
      subject: `Ride Log CSV - ${filename}`,
      text: "Attached is the exported CSV file.",
      attachments: [
        {
          filename,
          type: "text/csv; charset=utf-8", // tell email client it's UTF-8
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
});*/
/*
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "5mb" }));

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-csv", async (req, res) => {
  try {
    const { csvContent, filename } = req.body;

    // Convert CSV string to UTF-8 Buffer, then base64
    const buffer = Buffer.from(csvContent, "utf-8");
    const base64Content = buffer.toString("base64");

    await resend.emails.send({
      from: "Ride Logger <onboarding@resend.dev>",
      to: "vipul.prajapati74@gmail.com",
      subject: `Ride Log CSV - ${filename}`,
      text: "Attached is the exported CSV file.",
      attachments: [
        {
          filename,
          type: "text/csv; charset=utf-8",
          content: base64Content,
          encoding: "base64",   // VERY IMPORTANT
        },
      ],
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send CSV." });
  }
});

app.get("/", (req, res) => {
  res.send("Ride Logger Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
*/


import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// TEMP storage (replace with DB later)
let storedDescriptor = null;

/**
 * REGISTER FACE
 */
app.post("/register-face", (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || descriptor.length !== 128) {
    return res.status(400).json({ error: "Invalid descriptor" });
  }

  storedDescriptor = descriptor;
  console.log("Face registered");

  res.json({ success: true });
});

/**
 * VERIFY FACE
 */
app.post("/verify-face", (req, res) => {
  const { descriptor } = req.body;

  if (!storedDescriptor) {
    return res.status(400).json({ error: "No face registered" });
  }

  res.json({
    storedDescriptor
  });
});

app.listen(5000, () => {
  console.log("Face auth server running on port 5000");
});

