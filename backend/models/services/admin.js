import db from "..";
import { Op } from "sequelize";
import {fn, col} from "sequelize";

//booking over a time period 
const totalBookingsOverTime = async (timeframe = 'day') => {
    let groupBy = timeframe === 'month' ? 
        fn('DATE_FORMAT', col('date'), '%Y-%m') : 
        sequelize.fn('DATE', col('date'));

    const bookings = await db.Bookings.findAll({
        attributes: [
            [groupBy, 'time_period'],
            [fn('COUNT', col('id')), 'total_bookings']
        ],
        group: ['time_period'],
        order: [['time_period', 'ASC']]
    });
    return bookings;
};

const getPeakHours = async () => {
    const hours = await db.Bookings.findAll({
        attributes: [
            [fn('HOUR', col('startTime')), 'hour'],
            [fn('COUNT', col('id')), 'booking_count']
        ],
        group: ['hour'],
        order: [['booking_count', 'DESC']]
    });

    return hours;
};

const mostActiveUsers = async () => {
    const users = await db.Bookings.findAll({
        attributes: [
            'studentId',
            [fn('COUNT', col('id')), 'total_bookings']
        ],
        group: ['studentId'],
        order: [['total_bookings', 'DESC']],
        limit: 5  
    });

    return users;
};

const userTypeBookings = async () => {
    const result = await db.Users.findAll({
        attributes: [
            'Role',
            [fn('COUNT', col('Uid')), 'booking_count']
        ],
        include: [{ model: Bookings, attributes: [] }],
        group: ['Role']
    });

    return result;
};

const mostBookedEquipment = async () => {
    const result = await db.BookingEquipment.findAll({
        attributes: [
            'EqId',
            [fn('COUNT', col('BookingEquipID')), 'booking_count']
        ],
        group: ['EqId'],
        order: [['booking_count', 'DESC']],
        limit: 5
    });

    return result;
};

const equipmentUtilization = async () => {
    const result = await db.Equipment.findAll({
        attributes: [
            'Ename',
            [sequelize.literal('(StatusBooked + StatusReserved) / StockCount'), 'utilization_rate']
        ]
    });

    return result;
};


const addAnnouncements = async (text) => {
    const announcement = await db.Announcement.create({
        Body: text        
    })
    return announcement;
}

export default {addAnnouncements, totalBookingsOverTime, equipmentUtilization, getPeakHours, mostActiveUsers, mostBookedEquipment, userTypeBookings}


