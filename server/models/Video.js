const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Video = sequelize.define("Video", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  channel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  keyPoints: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  // Each topic: { title, summary, notes[] }
  topics: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  isEducational: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  tags: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
}, {
  tableName: "videos",
  timestamps: true,
});

// A video belongs to a user
Video.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Video, { foreignKey: "userId" });

module.exports = Video;