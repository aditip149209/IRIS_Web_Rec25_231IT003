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
        await sequelize.sync({ force: true });

        console.log("Database synced!");

        const usersData = [
            ...Array.from({ length: 20 }, (_, i) => ({
                UName: `Student ${i + 1}`,
                Email: `student${i + 1}@example.com`,
                Password: `StudentPass${i + 1}!`,
                Branch: ["CSE", "ECE", "Mechanical", "Civil", "Electrical"][i % 5],
                Role: "Student"
            })),
            ...Array.from({ length: 5 }, (_, i) => ({
                UName: `Admin ${i + 1}`,
                Email: `admin${i + 1}@example.com`,
                Password: `AdminPass${i + 1}!`,
                Branch: "Admin",
                Role: "Admin"
            }))
        ];

        const users = await Promise.all(usersData.map(async (user) => ({
            ...user,
            Password: await hashPassword(user.Password),
        })));

        const createdUsers = await db.Users.bulkCreate(users);
        console.log("Users seeded!");

        const facilities = [
            { name: "Basketball Court", sport: "Basketball", type: "court", location: "Block A - 2nd Floor", status: "available" },
            { name: "Football Field", sport: "Football", type: "field", location: "Block B - Ground", status: "available" },
            { name: "Tennis Court", sport: "Tennis", type: "court", location: "Block C - 1st Floor", status: "maintenance" },
            { name: "Gymnasium", sport: "Gym", type: "gym", location: "Sports Complex", status: "available" },
            { name: "Swimming Pool", sport: "Swimming", type: "pool", location: "Block D", status: "reserved" },
            { name: "Badminton Court", sport: "Badminton", type: "court", location: "Block E - 3rd Floor", status: "available" },
            { name: "Cricket Ground", sport: "Cricket", type: "field", location: "Block F - Ground", status: "available" },
            { name: "Table Tennis Hall", sport: "Table Tennis", type: "indoor", location: "Sports Complex - 1st Floor", status: "available" },
            { name: "Archery Range", sport: "Archery", type: "range", location: "Outdoor Arena", status: "maintenance" },
            { name: "Volleyball Court", sport: "Volleyball", type: "court", location: "Block G - Roof", status: "available" }
        ];

        const createdFacilities = await db.Facility.bulkCreate(facilities);
        console.log("Facilities seeded!");


        const equipment = [
            { Ename: "Basketball", Sport: "Basketball", StatusAvailable: 10, StockCount: 10, UsageCount: 5 },
            { Ename: "Football", Sport: "Football", StatusAvailable: 8, StockCount: 8, UsageCount: 3 },
            { Ename: "Tennis Racket", Sport: "Tennis", StatusAvailable: 15, StockCount: 15, UsageCount: 7 },
            { Ename: "Gym Weights", Sport: "Gym", StatusAvailable: 20, StockCount: 20, UsageCount: 10 },
            { Ename: "Swimming Goggles", Sport: "Swimming", StatusAvailable: 12, StockCount: 12, UsageCount: 4 },
            { Ename: "Badminton Shuttle", Sport: "Badminton", StatusAvailable: 30, StockCount: 30, UsageCount: 15 },
            { Ename: "Cricket Bat", Sport: "Cricket", StatusAvailable: 5, StockCount: 5, UsageCount: 2 },
            { Ename: "Table Tennis Paddle", Sport: "Table Tennis", StatusAvailable: 25, StockCount: 25, UsageCount: 10 },
            { Ename: "Archery Bow", Sport: "Archery", StatusAvailable: 6, StockCount: 6, UsageCount: 3 },
            { Ename: "Volleyball", Sport: "Volleyball", StatusAvailable: 10, StockCount: 10, UsageCount: 5 }
        ];

        const createdEquipment = await db.Equipment.bulkCreate(equipment);
        console.log("Equipment seeded!");

        const timeSlots = ["06:00:00", "07:00:00", "08:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00"];

        const bookings = createdUsers.slice(0, 15).map((user, index) => {
            const startTime = timeSlots[index % timeSlots.length]; 
            const endTime = `${(parseInt(startTime.split(":")[0]) + 1).toString().padStart(2, '0')}:00:00`; 
        
            return {
                studentId: user.Uid,
                Sport: facilities[index % facilities.length].sport,
                facilityId: createdFacilities[index % createdFacilities.length].Fid,
                date: `2025-03-${15 + Math.floor(index / timeSlots.length)}`,
                startTime,
                endTime,
                status: ["approved", "pending", "rejected"][index % 3]
            };
        });        

        await db.Bookings.bulkCreate(bookings);
        console.log("Bookings seeded!");


        const bookingEquipment = createdUsers.slice(0, 10).map((user, index) => ({
            StudentID: user.Uid,
            EqId: createdEquipment[index % 10].EqId,
            Quantity: Math.floor(Math.random() * 5) + 1,
            StartDate: `2025-03-${15 + index}`,
            EndDate: `2025-03-${16 + index}`,
            Status: "ongoing"
        }));

        await db.BookingEquipment.bulkCreate(bookingEquipment);
        console.log("Booking Equipment seeded!");

        const notifications = bookings.slice(0, 10).map((booking, index) => ({
            Uid: booking.studentId,
            BookingId: booking.studentId,
            Message: `Your booking for ${booking.Sport} is ${booking.status}.`,
            Status: "pending"
        }));

        await db.Notification.bulkCreate(notifications);
        console.log("Notifications seeded!");


        const penalties = createdUsers.slice(0, 5).map((user, index) => ({
            Uid: user.Uid,
            Reason: ["noshow", "other"][index],
            PenaltyType: ["warning", "temporary_ban", "permanent_ban"][index],
            StartDate: "2025-03-01",
            EndDate: "2025-03-07"
        }));

        await db.Penalties.bulkCreate(penalties);
        console.log("Penalties seeded!");

        const waitlist = createdUsers.slice(0, 5).map((user, index) => ({
            Uid: user.Uid,
            EqId: createdEquipment[index % 10].EqId,
            FacId: createdFacilities[index % 10].Fid,
            Date: "2025-03-24",
            startTime: "10:00:00",
            endTime: "11:00:00",
            CreationTime: "2025-03-24"
        }));

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
