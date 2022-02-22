const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(4),
                allowNull : false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
                // unique: true,
            },
            unique_key: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true,
            }
        }, {
            sequelize,
            timestamps: false, // createdAt, updatedAt, deleteAt 생성(true)
            underscored: false, 
            modelName: 'User',
            tableName: 'users',
            paranoid: false, // createdAt, updatedAt, deletedAt 생성(true)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        // 테이블 관계 생성
    };
};