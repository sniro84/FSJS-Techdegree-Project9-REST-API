/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> Model: User <<<
******************************************/

const Sequelize = require('sequelize');

module.exports = (sequelize) => { 
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: `Please provide a value for 'firstName'`
                },
                notNull:{
                    msg: `Please provide a value for 'firstName'`
                } 
            }  
        }, 
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: `Please provide a value for 'lastName'`
                },
                notNull:{
                    msg: `Please provide a value for 'lastName'`
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: `Please provide a value for 'emailAddress'`
                },
                notNull:{
                    msg: `Please provide a value for 'emailAddress'`
                }
            }
        },
        password: {
            type : Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: `Please provide a value for 'password'`
                },
                notNull:{
                    msg: `Please provide a value for 'password'`
                }
            }
        }    
    } , { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };

    module.exports = User;
    return User;
};

