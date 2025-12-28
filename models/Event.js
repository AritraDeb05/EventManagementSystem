import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    venueId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'cancelled', 'postponed', 'completed'),
      defaultValue: 'scheduled',
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'events',
    timestamps: true,
  });

  return Event;
};
