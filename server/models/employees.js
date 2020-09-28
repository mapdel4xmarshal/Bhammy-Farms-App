
const { Model, DataTypes } = require('sequelize');

class Employees extends Model {
  static get tblName() {
    return 'employees';
  }

  static get modelName() {
    return 'Employee';
  }

  static get schema() {
    return {
      employee_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false
      },
      employment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_manager: {
        type: DataTypes.BOOLEAN,
        default:false
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING
      },
      day_off: {
        type: DataTypes.SMALLINT
      },
      comment: {
        type: DataTypes.TEXT
      }
    };
  }

  static associate({ Party, Salary, Deductible, House, Location, BankDetail, Absence }) {
    Employees.party = Employees.belongsTo(Party, { foreignKey: 'party_id' });
    Employees.salaries = Employees.hasMany(Salary, { as: 'salaries', foreignKey: 'employee_id' });
    Employees.loans = Employees.hasMany(Deductible, { as: 'deductibles', foreignKey: 'employee_id' });
    Employees.absences = Employees.hasMany(Absence, { foreignKey: 'employee_id' });
    Employees.bankDetail = Employees.hasMany(BankDetail, { as: 'bankDetail', foreignKey: 'employee_id' });
    Employees.house = Employees.belongsTo(House, { foreignKey: { name: 'house_id', allowNull: true }, constraints: false });
    Employees.location = Employees.belongsTo(Location, { foreignKey: { name: 'location_id', allowNull: true }, constraints: false });
  }
}

module.exports = (sequelize) => {
  Employees.init(Employees.schema, {
    sequelize,
    modelName: Employees.modelName,
    tableName: Employees.tblName,
    underscored: true
  });

  return Employees;
};
