'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    date: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {});
  Record.associate = (models) => {
    // associations can be defined here
    Record.belongsTo(models.User)
  };
  return Record;
};