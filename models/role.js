const Sequelize = require('sequelize');

module.exports = class Role extends Sequelize.Model {
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
            modelName: 'Role',
            tableName: 'roles',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Role.hasMany(db.User, {foreignKey:'roleId', sourceKey: 'id'});
    };
};