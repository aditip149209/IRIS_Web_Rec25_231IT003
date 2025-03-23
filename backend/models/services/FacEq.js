import db from "..";
import { sequelize } from "../../utils/database";
import { Op } from "sequelize";

const InsertNewFac = async (Sport, Name, Location, Type ) => {
    try{
        const newFac = await db.Facility.create({
            name: Name,
            sport: Sport,
            location: Location,
            type: Type
        });
        return newFac;
    }
    catch(err){
        return err;
    }
};


const InsertNewEquipment = async (Name, Sport, StockCount) => {
    try{
        const newEq = await db.Equipment.create({
            Ename: Name,
            Sport: Sport,
            StockCount: StockCount
        });
        return newEq;
    }
    catch(err){
        return err;
    }
};


const deleteEquipment = async (EqId) => {
    const check = await db.Equipment.findOne({
        where: {EqId: EqId}
    });
    if(check){
        await db.Equipment.destroy({
            where: {EqId: EqId}
        });
        return "Equipment deleted";
    }
    else{
        return "Equipment not found";
    }
};

const deleteFacility = async (Fid) => {
    const check = await db.Facility.findOne({
        where: {Fid: Fid}
    });
    if(check){
        await db.Facility.destroy({
            where: {Fid: Fid}
        });
        return "Facility deleted";
    }
    else{
        return "Facility not found";
    }
};

const updateEquipment = async (EqId, Name, Sport, StockCount, StatusReserved, StatusAvailable, StatusBooked) => {
    const check = await db.Equipment.findOne({
        where: {EqId: EqId}
    });
    if(check){
        await db.Equipment.update({
            Ename: Name,
            Sport: Sport,
            StockCount: StockCount,
            StatusReserved: StatusReserved,
            StatusAvailable: StatusAvailable,
            StatusBooked: StatusBooked
        }, {where: {EqId: EqId}});
        return "Equipment updated";
    }
    else{
        return "Equipment not found";
    }
};

const updateFacility = async (Fid, Name, Sport, Location, Type, Status) => {    
    const check = await db.Facility.findOne({
        where: {Fid: Fid}
    });
    if(check){
        await db.Facility.update({
            name: Name,
            sport: Sport,
            location: Location,
            type: Type,
            status: Status
        }, {where: {Fid: Fid}});
        return "Facility updated";
    }
    else{
        return "Facility not found";
    }
};

export {InsertNewEquipment, InsertNewFac, deleteEquipment, deleteFacility};



