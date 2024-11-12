# Employee Management System

A GraphQL-based employee management backend system built with Express.js and Apollo Server. This system provides role-based access control, employee management, and attendance tracking functionality.

## Features

### Authentication & Authorization
- Role-based access control (Admin and Employee roles)
- JWT-based authentication
- Secure password handling
- Protected routes and mutations

### Employee Management
- Create and update employee records (Admin only)
- View employee details
- List all employees with pagination and sorting (Admin only)
- Employee self-service portal
- Track employee attendance

### Technical Features
- GraphQL API with Apollo Server
- MongoDB database integration
- Pagination and sorting
- Error handling and logging
- Performance optimizations

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/maazrehman99/Employee-management.git
```

2. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Add your environment variables:
```
JWT_SECRET=
MONGODB_URI=
PORT=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

3. Install dependencies and start the server:
```bash
npm install
npm start
```

## Usage Guide

### Admin Operations

1. **Admin Login**
```graphql
mutation {
  adminLogin(username: "admin-username-here", password: "admin-password-here") {
    token
    user {
      role
    }
  }
}
```

2. **Add Employee** (Requires Admin Token)
- Add token to headers: `Authorization: Bearer <admin-token-here>`
```graphql
mutation {
  addEmployee(input: {
    name: "Test Employee1"
    email: "test1@example.com"
    password: "password123"
    age: 25
    id: 1
    class: "Test Class"
    subjects: ["Test Subject"]
  }) {
    id
    name
  }
}
```

3. **Update Employee** (Requires Admin Token)
```graphql
mutation {
  updateEmployee(
    id: "employee-id-here",
    input: {
      name: "Updated Name"
      email: "updated@example.com"
      age: 26
      class: "Updated Class"
      subjects: ["Updated Subject"]
    }
  ) {
    id
    name
    email
    age
    class
    subjects
  }
}
```
Note: This operation will return errors if:
- User is not an admin: `"message": "Admin access required"`
- Employee ID doesn't exist: `"message": "Employee not found"`

4. **Get Employees with Pagination and Sorting**
```graphql
query($sortBy: String, $sortOrder: String) {
  employees(page: 1, limit: 10, sortBy: $sortBy, sortOrder: $sortOrder) {
    employees {
      id
      name
    }
    totalCount
  }
}
```

5. **Get Single Employee**
```graphql
query($employeeId: ID!) {
  employee(id: $employeeId) {
    name
    email
  }
}
```

### Employee Operations

1. **Employee Login**
```graphql
mutation {
  login(input: { 
    email: "employee-email-here", 
    password: "employee-password-here" 
  }) {
    token
    user {
      id
      role
    }
  }
}
```

2. **View Own Profile**
```graphql
query {
  myProfile {
    id
    name
    email
    attendance {
      date
      status
    }
  }
}
```

## Access Control
- Employee attempts to perform admin actions (like adding or updating employees) will result in an error:
  ```
  "message": "Admin access required"
  ```
- Employees can only access their own information and perform authorized actions.