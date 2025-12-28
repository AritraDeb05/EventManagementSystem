import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EventSpeaker = sequelize.define('EventSpeaker', {
    eventId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    speakerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'speakers',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'event_speakers',
    timestamps: false,
  });

  return EventSpeaker;
};
