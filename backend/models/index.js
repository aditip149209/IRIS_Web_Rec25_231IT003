import { sequelize } from "../utils/database.js";
import { DataTypes } from "sequelize";

// Define models
const Users = sequelize.define('Users', {
    Uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UName: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, unique: true, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Branch: { type: DataTypes.STRING, allowNull: false, defaultValue: 'None' },
    Role: { type: DataTypes.ENUM('Student', 'Admin'), allowNull: false, defaultValue: 'Student' }
});

const Equipment = sequelize.define('Equipment', {
    EqId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Ename: { type: DataTypes.STRING, allowNull: false, unique: true },
    Sport: { type: DataTypes.STRING, allowNull: false },
    StatusAvailable: { type: DataTypes.INTEGER},
    StatusBooked: { type: DataTypes.INTEGER, defaultValue: 0 },
    StatusReserved: { type: DataTypes.INTEGER, defaultValue: 0 },
    StockCount: { type: DataTypes.INTEGER, allowNull: false },
    UsageCount: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const BookingEquipment = sequelize.define('BookingEquipment', {
    BookingEquipID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    StudentID: { type: DataTypes.INTEGER, references: { model: Users, key: "Uid" } },
    EqId: { type: DataTypes.INTEGER, references: { model: Equipment, key: "EqId" } },
    Quantity: { type: DataTypes.INTEGER, allowNull: false },
    StartDate: { type: DataTypes.DATE, allowNull: false },
    EndDate: { type: DataTypes.DATE, allowNull: false },
    Status: { type: DataTypes.ENUM('ongoing', 'returned', 'lost', 'late', 'damaged'), allowNull: false, defaultValue: 'ongoing' }
});

const Facility = sequelize.define('Facility', {
    Fid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    sport: {type: DataTypes.STRING, allowNull:false },
    type: { type: DataTypes.ENUM("court", "field", "gym", "pool"), allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('available', 'booked', 'maintenance', 'reserved'), allowNull: false, defaultValue: 'available' }
});

const Bookings = sequelize.define('Bookings', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    Sport: { type: DataTypes.STRING, allowNull: false },
    facilityId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" }
});

const Notification = sequelize.define('Notification', {
    Nid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Message: { type: DataTypes.TEXT, allowNull: false },
    Status: { type: DataTypes.ENUM('unread', 'read'), defaultValue: 'unread' }
}, { timestamps: true });

const Penalties = sequelize.define('Penalties', {
    Pid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'Uid' } },
    Reason: { type: DataTypes.ENUM('noshow', 'other'), allowNull: false, defaultValue: 'noshow' },
    PenaltyType: { type: DataTypes.ENUM('warning', 'temporary_ban', 'permanent_ban'), defaultValue: 'warning' },
    StartDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    EndDate: { type: DataTypes.DATE }
});

const Waitlist = sequelize.define('Waitlist', {
    Wid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'Uid' } },
    EqId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Equipment, key: 'EqId' } },
    CreationTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Define associations
Users.hasMany(BookingEquipment, { foreignKey: "Uid" });
BookingEquipment.belongsTo(Users, { foreignKey: "Uid" });

Equipment.hasMany(BookingEquipment, { foreignKey: "EqId", onDelete: "CASCADE" });
BookingEquipment.belongsTo(Equipment, { foreignKey: "EqId" });

Users.hasMany(Penalties, { foreignKey: 'Uid' });
Penalties.belongsTo(Users, { foreignKey: 'Uid' });

Users.hasMany(Bookings, { foreignKey: 'Uid' });
Bookings.belongsTo(Users, { foreignKey: 'Uid' });

Facility.hasMany(Bookings, { foreignKey: 'Fid' });
Bookings.belongsTo(Facility, { foreignKey: 'Fid' });

Users.hasMany(Notification, { foreignKey: 'Uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Notification.belongsTo(Users, { foreignKey: 'Uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Users.hasMany(Waitlist, { foreignKey: 'Uid' });
Waitlist.belongsTo(Users, { foreignKey: 'Uid' });

Equipment.hasMany(Waitlist, { foreignKey: 'EqId' });
Waitlist.belongsTo(Equipment, { foreignKey: 'EqId' });

const db = { sequelize, Users, Equipment, BookingEquipment, Facility, Bookings, Notification, Penalties, Waitlist };
export default db;


