
require('dotenv').config();

// Configuration variables
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000,
    ADMIN_CREDENTIALS: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
    }
};
