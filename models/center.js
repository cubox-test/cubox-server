const Sequelize = require('sequelize');

module.exports = class Center extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false, 
            modelName: 'Center',
            tableName: 'centers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Center.belongsTo(db.Supervisor, {foreignKey:'supervisorId', targetkey: 'supervisorId'});
        db.Center.hasMany(db.Worker, {foreignKey:'centerId', sourceKey: 'id'});
        db.Center.hasMany(db.Project, {foreignKey:'centerId', sourceKey: 'id'});
    };
};