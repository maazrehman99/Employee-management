// Import necessary modules for query resolvers
const { GraphQLError } = require('graphql');
const Employee = require('../models/Employee');

// Define GraphQL query resolvers for employee management
const queries = {
  // Fetch a paginated and sorted list of all employees (admin-only)
  employees: async (_, { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { user }) => {
    if (user.role !== 'ADMIN') {  // Check admin access
      throw new GraphQLError('Admin access required');
    }

    // Calculate skip and sort options based on provided arguments
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch employees and total count concurrently
    const [employees, totalCount] = await Promise.all([
      Employee.find().sort(sortOptions).skip(skip).limit(limit).lean(),
      Employee.countDocuments()
    ]);

    // Return paginated result with additional page information
    return {
      employees,
      totalCount,
      hasNextPage: skip + employees.length < totalCount
    };
  },

  // Fetch a specific employee by ID (admin-only)
  employee: async (_, { id }, { user }) => {
    if (user.role !== 'ADMIN') {  // Check admin access
      throw new GraphQLError('Admin access required');
    }

    const employee = await Employee.findById(id);  // Find employee by ID
    if (!employee) {  // Check if employee exists
      throw new GraphQLError('Employee not found');
    }
    return employee;
  },

  // Fetch the profile of the currently authenticated employee
  myProfile: async (_, __, { user }) => {
    if (!user.id) {  // Ensure user is authenticated
      throw new GraphQLError('Authentication required');
    }

    const employee = await Employee.findById(user.id);  // Find employee by user ID
    if (!employee) {  // Check if employee exists
      throw new GraphQLError('Employee not found');
    }
    return employee;
  },

  // Fetch attendance records of the currently authenticated employee
  myAttendance: async (_, __, { user }) => {
    if (!user.id) {  // Ensure user is authenticated
      throw new GraphQLError('Authentication required');
    }

    const employee = await Employee.findById(user.id);  // Find employee by user ID
    if (!employee) {  // Check if employee exists
      throw new GraphQLError('Employee not found');
    }
    return employee.attendance;
  }
};


module.exports = queries;
