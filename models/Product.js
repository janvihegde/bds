const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: String,
  description: String,

  status: {
    type: String,
    enum: ["new", "designer_uploaded", "pending_approval", "approved", "rejected"],
    default: "new"
  },

  rejectionReason: { type: String, default: "" },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  briefs: [
    {
      fileName: String,     // Name of file OR Title of link
      filePath: String,     // Cloudinary URL OR External Link
      fileType: {           // To tell frontend if it's a file or link
        type: String, 
        enum: ['file', 'link'], 
        default: 'file' 
      },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],

  finalDesigns: [
    {
      fileName: String,
      filePath: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      uploadedAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
