const Sequelize = require('sequelize');

module.exports = class Project extends Sequelize.Model {
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
            modelName: 'Project',
            tableName: 'projects',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Project.hasMany(db.Job, {foreignKey: 'projectId', sourceKey: 'id'});
        db.Project.hasMany(db.Worker, {foreignKey:'projectId', sourceKey: 'id'});
        db.Project.belongsTo(db.Center, {foreignKey:'centerId', sourceKey: 'id'});
        db.Project.belongsTo(db.State, {foreignKey:'stateId', targetKey: 'id'});
    };
};