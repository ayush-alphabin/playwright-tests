// Database query optimization
const optimizedQueries = {
  getUserData: `
    SELECT u.*, p.preferences 
    FROM users u 
    LEFT JOIN preferences p ON u.id = p.user_id 
    WHERE u.id = ?
  `,
  
  getBatchUsers: `
    SELECT * FROM users WHERE id IN (?)
  `
};

module.exports = optimizedQueries;
