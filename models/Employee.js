// MongoDB model 
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id:{type:Number, required :true},
  age: { type: Number, required: true },
  class: String,
  subjects: [String],
  attendance: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);