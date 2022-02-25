const Sequelize = require('sequelize');

module.exports = class Supervisor extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            supervisorId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'Supervisor',
            tableName: 'supervisors',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Supervisor.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId'});
        db.Supervisor.hasMany(db.Center, { foreignKey: 'supervisorId', sourceKey: 'supervisorId'});
    };
};