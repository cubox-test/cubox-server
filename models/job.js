const Sequelize = require('sequelize');

module.exports = class Job extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true
            },
        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'Job',
            tableName: 'jobs',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Job.belongsTo(db.State, {foreignKey:'stateId', targetKey: 'id'});
        db.Job.belongsTo(db.Worker, { foreignKey: 'workerId', targetKey: 'workerId'});
        db.Job.belongsTo(db.Center, {foreignKey:'centerId', targetKey: 'id'});
    };
};