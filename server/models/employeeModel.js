import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);


export default Employee;
