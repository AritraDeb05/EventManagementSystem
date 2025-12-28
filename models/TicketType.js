import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TicketType = sequelize.define('TicketType', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    saleStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    saleEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'ticket_types',
    timestamps: false,
  });

  return TicketType;
};
