const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../Config/config.json')[env];
const User = require('./user');
const Role = require('./role');
const Center = require('./center');
const Supervisor = require('./supervisor');
const Worker = require('./worker');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.User = User;
db.Role = Role;
db.Center = Center;
db.Worker = Worker;
db.Supervisor = Supervisor;

User.init(sequelize);
Role.init(sequelize);
Center.init(sequelize);
Worker.init(sequelize);
Supervisor.init(sequelize);

User.associate(db);
Role.associate(db);
Center.associate(db);
Worker.associate(db);
Supervisor.associate(db);

module.exports = db;