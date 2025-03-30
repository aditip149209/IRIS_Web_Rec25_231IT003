import db from "../index.js";


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
            StockCount: StockCount,
            StatusAvailable: StockCount
        });
        return newEq;
    }
    catch(err){
        return err;
    }
};

const deleteEquip = async (Ename) => {
    const check = await db.Equipment.findOne({
        where: {Ename}
    });
    if(check){
        await db.Equipment.destroy({
            where: {Ename}
        });
        return "Equipment deleted";
    }
    else{
        return "Equipment not found";
    }
};

const deleteFac = async (Fname) => {
    const check = await db.Facility.findOne({
        where: {name: Fname}
    });
    if(check){
        await db.Facility.destroy({
            where: {name: Fname}
        });
        return "Facility deleted";
    }
    else{
        return "Facility not found";
    }
};

const updateEq = async (Name, StockCount, StatusReserved, StatusAvailable, StatusBooked) => {
    const check = await db.Equipment.findOne({
        where: {Ename: Name}
    });
    if(check){
        await db.Equipment.update({
            Ename: Name,
            StockCount: StockCount,
            StatusReserved: StatusReserved,
            StatusAvailable: StatusAvailable,
            StatusBooked: StatusBooked
        }, {where: {Ename : Name}});
        return "Equipment updated";
    }
    else{
        return "Equipment not found";
    }
};

const updateFac = async (Fid, Name, Sport, Location, Type, Status) => {    
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

export {InsertNewEquipment, InsertNewFac, deleteEquip, deleteFac, updateEq, updateFac};



