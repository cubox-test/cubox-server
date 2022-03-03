const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            userId: {
                type: Sequelize.STRING(70),
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(15),
                allowNull : false,
            },
            nickName: {
                type: Sequelize.STRING(20),
                allowNull : false,
                unique : true,
            },
            unique_key: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            useragent: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            signed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            foreigner: {
                type: Sequelize.BOOLEAN,
            },
            age: {
                type: Sequelize.INTEGER(2),
            }
        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt 생성(true)
            underscored: false, 
            modelName: 'User',
            tableName: 'users',
            paranoid: false, // deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.User.belongsTo(db.Role, { foreignKey: 'roleId', targetKey: 'id'});
        db.User.hasMany(db.Supervisor, {foreignKey:'userId', sourceKey: 'userId'});
        db.User.hasMany(db.Worker, {foreignKey:'userId', sourceKey: 'userId'});
    };
};