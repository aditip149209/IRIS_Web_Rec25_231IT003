import { sequelize } from "./utils/database.js";
import db from "./models/index.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import Sequelize from "sequelize";

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: Deletes existing data!

        console.log("Database synced!");

        // Seed Users
        const usersData = [
            { UName: "Aditi Sharma", Email: "aditi@example.com", Password: "Password1!", Branch: "CSE", Role: "Student" },
            { UName: "Rohan Mehta", Email: "rohan@example.com", Password: "Password2!", Branch: "ECE", Role: "Student" },
            { UName: "Ananya Singh", Email: "ananya@example.com", Password: "Password3!", Branch: "Mechanical", Role: "Student" },
            { UName: "Admin User", Email: "admin@example.com", Password: "AdminPassword1!", Branch: "Admin", Role: "Admin" }
        ];

        // Hash passwords in parallel
        const users = await Promise.all(usersData.map(async (user) => ({
            ...user,
            Password: await hashPassword(user.Password),
        })));

        const createdUsers = await db.Users.bulkCreate(users);
        console.log("Users seeded!");

        // Seed Facilities
        const facilities = [
            { name: "Basketball Court", sport: "Basketball", type: "court", location: "Block A - 2nd Floor", status: "available" },
            { name: "Football Field", sport: "Football", type: "field", location: "Block B - Ground", status: "available" },
            { name: "Tennis Court", sport: "Tennis", type: "court", location: "Block C - 1st Floor", status: "maintenance" },
            { name: "Gymnasium", sport: "Gym", type: "gym", location: "Sports Complex", status: "available" },
            { name: "Swimming Pool", sport: "Swimming", type: "pool", location: "Block D", status: "reserved" }
        ];

        const createdFacilities = await db.Facility.bulkCreate(facilities);
        console.log("Facilities seeded!");

        // Seed Equipment
        const equipment = [
            { Ename: "Basketball", Sport: "Basketball", Status: "available", StockCount: 10, UsageCount: 5 },
            { Ename: "Football", Sport: "Football", Status: "available", StockCount: 8, UsageCount: 3 },
            { Ename: "Tennis Racket", Sport: "Tennis", Status: "available", StockCount: 15, UsageCount: 7 },
            { Ename: "Gym Weights", Sport: "Gym", Status: "available", StockCount: 20, UsageCount: 10 },
            { Ename: "Swimming Goggles", Sport: "Swimming", Status: "available", StockCount: 12, UsageCount: 4 }
        ];

        const createdEquipment = await db.Equipment.bulkCreate(equipment);
        db.Equipment.update({ StatusAvailable : Sequelize.literal('StockCount')
        }, { where: { } });
        console.log("Equipment seeded!");

        // Seed Bookings
        const bookings = [
            { studentId: createdUsers[0].Uid, Sport: "Basketball", facilityId: createdFacilities[0].Fid, date: "2025-03-25", startTime: "10:00:00", endTime: "11:00:00", status: "approved" },
            { studentId: createdUsers[1].Uid, Sport: "Football", facilityId: createdFacilities[1].Fid, date: "2025-03-26", startTime: "16:00:00", endTime: "17:30:00", status: "approved" },
            { studentId: createdUsers[2].Uid, Sport: "Tennis", facilityId: createdFacilities[2].Fid, date: "2025-03-27", startTime: "08:00:00", endTime: "09:00:00", status: "pending" },
            { studentId: createdUsers[0].Uid, Sport: "Gym Workout", facilityId: createdFacilities[3].Fid, date: "2025-03-28", startTime: "18:00:00", endTime: "19:00:00", status: "approved" }
        ];

        await db.Bookings.bulkCreate(bookings);
        console.log("Bookings seeded!");

        // Seed Booking Equipment
        const bookingEquipment = [
            { StudentID: createdUsers[0].Uid, EqId: createdEquipment[0].EqId, Quantity: 2, StartDate: "2025-03-25", EndDate: "2025-03-26", Status: "ongoing" },
            { StudentID: createdUsers[1].Uid, EqId: createdEquipment[1].EqId, Quantity: 1, StartDate: "2025-03-26", EndDate: "2025-03-27", Status: "ongoing" },
            { StudentID: createdUsers[2].Uid, EqId: createdEquipment[2].EqId, Quantity: 3, StartDate: "2025-03-27", EndDate: "2025-03-28", Status: "ongoing" }
        ];

        await db.BookingEquipment.bulkCreate(bookingEquipment);
        console.log("Booking Equipment seeded!");

        // Seed Notifications
        const notifications = [
            { Uid: createdUsers[0].Uid, Message: "Your basketball booking is confirmed.", Status: "unread" },
            { Uid: createdUsers[1].Uid, Message: "Your football booking is confirmed.", Status: "unread" },
            { Uid: createdUsers[2].Uid, Message: "Your tennis booking is pending approval.", Status: "unread" }
        ];

        await db.Notification.bulkCreate(notifications);
        console.log("Notifications seeded!");

        // Seed Penalties
        const penalties = [
            { Uid: createdUsers[0].Uid, Reason: "noshow", PenaltyType: "warning", StartDate: "2025-03-01", EndDate: "2025-03-07" },
            { Uid: createdUsers[1].Uid, Reason: "other", PenaltyType: "temporary_ban", StartDate: "2025-03-10", EndDate: "2025-03-20" }
        ];

        await db.Penalties.bulkCreate(penalties);
        console.log("Penalties seeded!");

        // Seed Waitlist
        const waitlist = [
            { Uid: createdUsers[0].Uid, EqId: createdEquipment[3].EqId, CreationTime: "2025-03-24" },
            { Uid: createdUsers[1].Uid, EqId: createdEquipment[4].EqId, CreationTime: "2025-03-25" }
        ];

        await db.Waitlist.bulkCreate(waitlist);
        console.log("Waitlist seeded!");

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();

export default seedDatabase;
