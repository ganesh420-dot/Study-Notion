const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    console.log("Mail configuration:")
    console.log("MAIL_HOST:", process.env.MAIL_HOST)
    console.log("MAIL_USER:", process.env.MAIL_USER)
    console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS)

    // Create transporter with more explicit configuration
    // FIXED: Changed createTransporter to createTransport
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // Use 587 for TLS
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development only
      },
    })

    // Verify transporter configuration
    console.log("Verifying transporter...")
    await transporter.verify()
    console.log("Transporter verified successfully")

    // Send email
    console.log("Sending email to:", email)
    let info = await transporter.sendMail({
      from: `"StudyNotion | CodeHelp" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Email info:", info)
    return info
  } catch (error) {
    console.error("Error in mailSender:")
    console.error("Error message:", error.message)
    console.error("Error code:", error.code)
    console.error("Full error:", error)

    // More specific error handling
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Check your email and app password.")
    } else if (error.code === "ENOTFOUND") {
      console.error("SMTP server not found. Check MAIL_HOST.")
    } else if (error.code === "ECONNECTION") {
      console.error(
        "Connection failed. Check your internet connection and SMTP settings."
      )
    }

    throw error
  }
}

module.exports = mailSender
