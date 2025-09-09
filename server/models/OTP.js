const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5 minutes
  },
})

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    console.log("Attempting to send email to:", email)
    console.log("OTP:", otp)

    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    )

    console.log("Email sent successfully: ", mailResponse)
    return mailResponse
  } catch (error) {
    console.error("Error occurred while sending email: ", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    })
    throw error
  }
}

// Define a pre-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New OTP document about to be saved to database")
  console.log("Email:", this.email, "OTP:", this.otp)

  // Only send an email when a new document is created
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp)
      console.log("Email sent successfully via pre-save hook")
    } catch (error) {
      console.error("Failed to send email in pre-save hook:", error)
      // Don't prevent saving the document, just log the error
      // If you want to prevent saving when email fails, uncomment the next line:
      // return next(error);
    }
  }
  next()
})

const OTP = mongoose.model("OTP", OTPSchema)
module.exports = OTP
