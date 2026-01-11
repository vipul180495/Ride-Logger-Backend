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
//====================================================================================
/*
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// TEMP storage (replace with DB later)
let storedDescriptor = null;


app.post("/register-face", (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || descriptor.length !== 128) {
    return res.status(400).json({ error: "Invalid descriptor" });
  }

  storedDescriptor = descriptor;
  console.log("Face registered");

  res.json({ success: true });
});

app.post("/verify-face", (req, res) => {
  const { descriptor } = req.body;

  if (!storedDescriptor) {
    return res.status(400).json({ error: "No face registered" });
  }

  res.json({
    storedDescriptor
  });
});

/*app.listen(5000, () => {
  console.log("Face auth server running on port 5000");
});*//*
// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Face auth server running on port ${PORT}`);
});*/

//==================================================================================================
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import * as faceapi from "face-api.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-memory storage
let pendingRegistrations = []; // { email, descriptor }
let approvedDescriptors = [];

// --- Nodemailer ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

transporter.verify((err) => {
  if (err) console.error("❌ Email transporter error:", err);
  else console.log("✅ Email server ready");
});

// --- Send approval email ---
const sendApprovalEmail = (email, index) => {
  transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL_PASS,
    subject: "New Face Registration Request",
    text: `User ${email} wants to register a face.

Approve here:
https://ride-logger-backend-2.onrender.com/approve-face/${index}`
  }, (err, info) => {
    if (err) console.error("❌ Email send error:", err);
    else console.log("✅ Approval email sent:", info.response);
  });
};

// --- Register face ---
app.post("/register-face", (req, res) => {
  const { email, descriptor } = req.body;

  if (!email || !descriptor || descriptor.length !== 128) {
    return res.status(400).json({ error: "Invalid data" });
  }

  pendingRegistrations.push({ email, descriptor });
  const index = pendingRegistrations.length - 1;

  sendApprovalEmail(email, index);

  res.json({ success: true });
});

// --- Approve face ---
app.get("/approve-face/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (!pendingRegistrations[index]) return res.send("Invalid request");

  const { descriptor } = pendingRegistrations[index];
  approvedDescriptors.push(new Float32Array(descriptor));
  pendingRegistrations.splice(index, 1);

  res.send("✅ Face approved! User can now unlock the app.");
});

// --- Verify face ---
app.post("/verify-face", (req, res) => {
  const { descriptor } = req.body;
  if (!descriptor) return res.status(400).json({ error: "No descriptor" });

  const input = new Float32Array(descriptor);

  for (const saved of approvedDescriptors) {
    const distance = faceapi.euclideanDistance(input, saved);
    if (distance < 0.6) return res.json({ success: true });
  }

  res.status(401).json({ error: "Face not recognized" });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);


