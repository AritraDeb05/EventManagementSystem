import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('organizer', 'attendee', 'admin'),
      defaultValue: 'attendee',
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'));
          user.passwordHash = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'));
          user.passwordHash = await bcrypt.hash(user.password, salt);
        }
      }
    },
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
  };

  return User;
};
