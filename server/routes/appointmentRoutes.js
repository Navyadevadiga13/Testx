const router = require("express").Router();
const nodemailer = require("nodemailer");

/* Create transporter once */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post("/request", async (req, res) => {

  try {

    const { email, fullname, contact, date } = req.body;

    /* Validate request */

    if (!email || !fullname || !contact || !date) {
      return res.status(400).json({
        msg: "fullname, email, contact and date are required"
      });
    }

    /* Validate contact number (10 digits) */

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(contact)) {
      return res.status(400).json({
        msg: "Please enter a valid 10 digit contact number"
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "navyadevadiga1234@gmail.com",
      subject: "New TOEFL Speaking Test Appointment Request",

      text: `
New TOEFL Speaking Appointment Request

Name: ${fullname}
Email: ${email}
Contact: ${contact}
Preferred Date: ${date}

Please contact the student to confirm the test slot.
`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "Appointment request email sent successfully"
    });

  } catch (err) {

    console.error("EMAIL ERROR:", err);

    res.status(500).json({
      msg: "Failed to send email",
      error: err.message
    });

  }

});

module.exports = router;