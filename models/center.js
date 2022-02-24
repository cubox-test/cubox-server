const Sequelize = require('sequelize');

module.exports = class Center extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            description: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'Center',
            tableName: 'centers',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Center.hasMany(db.Supervisor, {foreignKey:'SupervisorId', sourceKey: 'id'});
        db.Center.hasMany(db.Worker, {foreignKey:'SupervisorId', sourceKey: 'id'});
    };
};