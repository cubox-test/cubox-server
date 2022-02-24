const Sequelize = require('sequelize');

module.exports = class Supervisor extends Sequelize.Model {
    static init(sequelize){
        return super.init({

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
        db.Supervisor.hasMany(db.Worker, {foreignKey:'SupervisorId', sourceKey: 'id'});
        db.Supervisor.belongsTo(db.Role, { foreignKey: 'roleId', targetKey: 'id'});
        db.Supervisor.belongsTo(db.Center, { foreignKey: 'centerId', targetKey: 'id'});
    };
};