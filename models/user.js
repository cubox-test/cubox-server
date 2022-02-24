const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            userId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
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
                type: Sequelize.STRING(5),
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
            timestamps: true, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'User',
            tableName: 'users',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.User.belongsTo(db.Role, { foreignKey: 'roleId', targetKey: 'id'});
    };
};