import cron from 'node-cron';
import db from '../models';
import sendMail from './mailer.js';
import { Op } from 'sequelize';

const sendPendingNotif = async () => {
    try{
        const now = new Date();

        const notifications = await db.Notification.findAll({
            where: {
                status: 'pending',
                sendTime: { [db.Op.lte]: now }
            }
        });

        for(const notification of notifications) {
            const user = await db.Users.findByPk(notification.Uid);
            if(user) {
                await sendMail(user.Email, "Notification", notification.Message);
                await notification.update({ status: 'sent' });
            }
        }
    }
    catch(err){
        console.error("Error logging notification", err);
    }
}

cron.schedule("* * * * *", sendPendingNotif);

export default sendPendingNotif;

