import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Speaker = sequelize.define('Speaker', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    socialMediaLink: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'speakers',
    timestamps: false,
  });

  return Speaker;
};
