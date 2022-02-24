const Sequelize = require('sequelize');

module.exports = class Worker extends Sequelize.Model {
    static init(sequelize){
        return super.init({

        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'Worker',
            tableName: 'workers',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Worker.belongsTo(db.Supervisor, {foreignKey:'SupervisorId', targetKey: 'id'});
        db.Worker.belongsTo(db.Role, { foreignKey: 'roleId', targetKey: 'id'});
        db.Worker.belongsTo(db.Center, { foreignKey: 'centerId', targetKey: 'id'});
    };
};