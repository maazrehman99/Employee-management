
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { GraphQLError } = require('graphql');

// `authDirectiveTransformer`: a function to transform a GraphQL schema by applying authentication rules
// Takes a schema and a directive name as parameters
const authDirectiveTransformer = (schema, directiveName) => {
  // `mapSchema` iterates over schema fields, allowing us to modify field configurations based on the directive
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Retrieves the specified directive from the field configuration
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      
      if (authDirective) {  // Apply logic only if the directive exists
        const { requires } = authDirective;  // Get the access level required from the directive argument
        const { resolve = defaultFieldResolver } = fieldConfig;  // Fallback to default resolver if none specified

        // Overriding the field resolver to include authentication checks
        fieldConfig.resolve = async function (source, args, context, info) {
          const user = context.user;  // Retrieve the user info from context

          // Check for authenticated user; throw error if not authenticated
          if (!user) {
            throw new GraphQLError('Not authenticated', {
              extensions: { code: 'UNAUTHENTICATED' }
            });
          }

          // If 'ADMIN' role is required, check if user has admin rights; throw error if unauthorized
          if (requires === 'ADMIN' && user.role !== 'ADMIN') {
            throw new GraphQLError('Admin access required', {
              extensions: { code: 'FORBIDDEN' }
            });
          }

          // If 'EMPLOYEE' role is required, ensure user is either an employee or admin; throw error if unauthorized
          if (requires === 'EMPLOYEE' && user.role !== 'EMPLOYEE' && user.role !== 'ADMIN') {
            throw new GraphQLError('Employee access required', {
              extensions: { code: 'FORBIDDEN' }
            });
          }

          // If checks pass, execute the original resolver function
          return resolve(source, args, context, info);
        };
        
        return fieldConfig;  // Return modified field configuration with authentication checks
      }
    }
  });
};


module.exports = authDirectiveTransformer;
