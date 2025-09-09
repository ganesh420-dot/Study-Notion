const mongoose = require("mongoose")
require("dotenv").config()

const MONGO_URI = process.env.MONGO_URI // must match exactly

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ DB Connection Success"))
    .catch((err) => {
      console.error("❌ DB Connection Failed")
      console.error(err)
      process.exit(1)
    })
}
