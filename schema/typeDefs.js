// GraphQL type definitions 
const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    email: String!
    age: Int!
    class: String
    subjects: [String]
    attendance: [Attendance]!
    createdAt: String!
  }

  type Attendance {
    date: String!
    status: String!
  }

  type AuthPayload {
    token: String!
    user: UserType!
  }

  type UserType {
    id: ID
    role: String!
    email: String
  }

  type PaginatedEmployees {
    employees: [Employee]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input EmployeeInput {
    name: String!
    email: String!
    password: String!
    id: ID
    age: Int!
    class: String
    subjects: [String]
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    id: ID!
    class: String
    subjects: [String]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    employees(
      page: Int
      limit: Int
      sortBy: String
      sortOrder: String
    ): PaginatedEmployees! @auth(requires: ADMIN)
    
    employee(id: ID!): Employee @auth(requires: ADMIN)
    
    myProfile: Employee @auth(requires: EMPLOYEE)
    myAttendance: [Attendance]! @auth(requires: EMPLOYEE)
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
    adminLogin(username: String!, password: String!): AuthPayload!
    
    addEmployee(input: EmployeeInput!): Employee! @auth(requires: ADMIN)
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee! @auth(requires: ADMIN)
    markAttendance(employeeId: ID!, date: String!, status: String!): Attendance! @auth(requires: ADMIN)
  }

  directive @auth(requires: Role!) on FIELD_DEFINITION

  enum Role {
    ADMIN
    EMPLOYEE
  }
`;

module.exports = typeDefs;