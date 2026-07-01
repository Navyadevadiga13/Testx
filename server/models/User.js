const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2
  },
   phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    // Basic regex check
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
 
  password: { 
    type: String, 
    required: true 
  },
   city: {
  type: String,
  required: true,
  trim: true
},

study_preference: {
  type: String,
  required: true,
  enum: ["India", "Abroad", "Both"]
},
  // NEW: The flag to block logins until they click the link
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
