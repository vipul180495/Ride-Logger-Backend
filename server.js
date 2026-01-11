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

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// TEMP storage for registered faces (replace with DB in production)
let pendingRegistrations = []; // { email, descriptor }
let approvedDescriptors = [];  // Float32Array descriptors

// --- Configure Nodemailer ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vipul.prajapati74@gmail.com", // your Gmail
    pass: "ixcu hdxp ucey tgrw"           // Gmail App Password
  }
});

// --- Send approval email ---
const sendApprovalEmail = (email, index) => {
  const mailOptions = {
    from: "vipul.prajapati74@gmail.com",
    to: "vipul.prajapati74@gmail.com", // admin receives the request
    subject: "New Face Registration Request",
    text: `User ${email} wants to register a face.
Approve here: https://ride-logger-backend-2.onrender.com/approve-face/${index}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Approval email sent:", info.response);
  });
};

// --- Register face request ---
app.post("/register-face", (req, res) => {
  const { email, descriptor } = req.body;

  if (!email || !descriptor || descriptor.length !== 128)
    return res.status(400).json({ error: "Invalid data" });

  // Save pending registration
  pendingRegistrations.push({ email, descriptor });
  const index = pendingRegistrations.length - 1;

  // Send admin approval email
  sendApprovalEmail(email, index);

  res.json({ success: true, message: "Face registration request sent for approval" });
});

// --- Admin approves face ---
app.get("/approve-face/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || !pendingRegistrations[index]) return res.send("Invalid request");

  const { descriptor } = pendingRegistrations[index];
  approvedDescriptors.push(new Float32Array(descriptor));

  // Remove from pending
  pendingRegistrations.splice(index, 1);

  res.send("✅ Face approved! User can now unlock the app.");
});

// --- Verify face ---
app.post("/verify-face", (req, res) => {
  const { descriptor } = req.body;
  if (!descriptor) return res.status(400).json({ error: "No descriptor provided" });

  const fd = new Float32Array(descriptor);

  let matched = false;
  for (const saved of approvedDescriptors) {
    const distance = require("face-api.js").euclideanDistance(fd, saved);
    if (distance < 0.6) {
      matched = true;
      break;
    }
  }

  if (matched) res.json({ success: true });
  else res.status(401).json({ error: "Face not recognized" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


