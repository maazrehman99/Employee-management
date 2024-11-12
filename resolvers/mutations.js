
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const { JWT_SECRET, ADMIN_CREDENTIALS } = require('../config');

// Define GraphQL mutations for authentication and employee management
const mutations = {
  // Admin login mutation
  adminLogin: async (_, { username, password }) => {
    // Validate admin credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      throw new GraphQLError('Invalid admin credentials');
    }
    // Generate JWT with 'ADMIN' role
    const token = jwt.sign({ role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
    return { token, user: { role: 'ADMIN' } };
  },

  // Employee login mutation
  login: async (_, { input: { email, password } }) => {
    const employee = await Employee.findOne({ email });  // Find employee by email
    if (!employee || employee.password !== password) {  // Check credentials
      throw new GraphQLError('Invalid credentials');
    }
    // Generate JWT with 'EMPLOYEE' role
    const token = jwt.sign({ id: employee.id, role: 'EMPLOYEE' }, JWT_SECRET, { expiresIn: '24h' });
    return { token, user: { id: employee.id, role: 'EMPLOYEE', email } };
  },

  // Add a new employee (admin-only)
  addEmployee: async (_, { input }, { user }) => {
    if (user.role !== 'ADMIN') {  // Ensure user is admin
      throw new GraphQLError('Admin access required');
    }
    try {
      const employee = new Employee(input);  // Create new employee
      await employee.save();  // Save to database
      return employee;
    } catch (error) {
      if (error.code === 11000) {  // Handle duplicate email error
        throw new GraphQLError('Email already exists');
      }
      throw error;
    }
  },

  // Update an employee's details (admin-only)
  updateEmployee: async (_, { id, input }, { user }) => {
    if (user.role !== 'ADMIN') {  // Ensure user is admin
      throw new GraphQLError('Admin access required');
    }
    const employee = await Employee.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!employee) {  // Check if employee exists
      throw new GraphQLError('Employee not found');
    }
    return employee;
  },

  // Mark employee attendance (admin-only)
  markAttendance: async (_, { employeeId, date, status }, { user }) => {
    if (user.role !== 'ADMIN') {  // Ensure user is admin
      throw new GraphQLError('Admin access required');
    }
    const employee = await Employee.findById(employeeId);  // Find employee by ID
    if (!employee) {  // Check if employee exists
      throw new GraphQLError('Employee not found');
    }
    // Add attendance record and save
    const attendance = { date: new Date(date), status };
    employee.attendance.push(attendance);
    await employee.save();
    return attendance;
  }
};

// Export mutations
module.exports = mutations;
