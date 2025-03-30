import db from "../models/index.js";
import { InsertNewEquipment, updateEq, deleteEquip, updateFac, deleteFac, InsertNewFac } from "../models/services/FacEq.js";

const adminBoard = (req,res) => {
    return res.status(200).json({
        message: "this is the admin endpoint",
    });
};

const addEquipment = async (req, res) => {
    const { name, sport, stockcount } = req.body;

    if (!name || !sport || !stockcount) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    if (typeof stockcount !== "number" || stockcount <= 0) {
        return res.status(400).json({
            message: "Stock count must be a positive number",
        });
    }

    try {
        const check = await db.Equipment.findOne({
            where: { Ename: name, Sport: sport }, // Check for duplicate name and sport
        });
        if (check) {
            return res.status(400).json({
                message: "Equipment already exists for this sport",
            });
        }

        const createdEquipment = await InsertNewEquipment(name, sport, stockcount);
        return res.status(200).json({
            message: "Equipment added",
            createdEquipment,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error adding new equipment",
            error: err.message,
        });
    }
};

const updateEquipment = async (req, res) => {
    const { Name, StockCount, StatusReserved, StatusAvailable, StatusBooked } = req.body;

    if (!Name || !StockCount || StatusReserved === undefined || StatusAvailable === undefined || StatusBooked === undefined) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    if (typeof StockCount !== "number" || StockCount <= 0) {
        return res.status(400).json({
            message: "Stock count must be a positive number",
        });
    }

    if (StatusReserved + StatusAvailable + StatusBooked > StockCount) {
        return res.status(400).json({
            message: "The sum of reserved, available, and booked statuses cannot exceed the stock count",
        });
    }

    try {
        const equipment = await db.Equipment.findOne({ where: { Ename: Name } });
        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found",
            });
        }

        const updates = await updateEq(Name, StockCount, StatusReserved, StatusAvailable, StatusBooked);
        return res.status(200).json({
            message: "Equipment updated",
            updates,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error updating the equipment",
            error: err.message,
        });
    }
};

const deleteEquipment = async (req, res) => {
    const  name  = req.query.name;

    if (!name) {
        return res.status(400).json({
            message: "Please provide the equipment name",
        });
    }

    try {
        const equipment = await db.Equipment.findOne({ where: { Ename: name } });
        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found",
            });
        }

        const deleteEq = await deleteEquip(name);
        return res.status(200).json({
            message: "Equipment has been deleted",
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error deleting the equipment",
            error: err.message,
        });
    }
};


const showAnalytics = async (req, res) => {
    return res.status(200).json({
        message: "you have reached the analytics endpoint"
    });
};

const showEquipment = async (req, res) => {
    try{
        const equips = await db.Equipment.findAll({
            attributes: ['EqId','Ename','StatusAvailable','StatusReserved','StatusBooked','StockCount']
        })
    
        return res.status(200).json({
            message: "Here are the equipments",
            equips });
    }  
    catch(err){
        return res.status(500).json({
            message: "There was an error",
            error: err
        });
    }   
};


const addFacility = async (req, res) => {
    const { sport, name, location, type } = req.body;

    if (!sport || !name || !location || !type) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    const validTypes = ["court", "field", "gym", "pool"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({
            message: `Invalid facility type. Valid types are: ${validTypes.join(", ")}`,
        });
    }

    try {
        const check = await db.Facility.findOne({ where: { name, sport } });
        if (check) {
            return res.status(400).json({
                message: "Facility already exists for this sport",
            });
        }

        const createdFacility = await InsertNewFac(sport, name, location, type);
        return res.status(200).json({
            message: "Facility added",
            createdFacility,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error adding new facility",
            error: err.message,
        });
    }
};

const updateFacility = async (req, res) => {
    const {name, status} = req.body;
    if(!name || !status){
        return res.status(400).json({
            message: "name/status field is empty, pls ensure it is filled"
        })
    }
    try{
        const updateFac = await db.Facility.update({status},{
            where: {name:name},
        })
    }
    catch(error){
        return res.status(500).json({
            message: "server error rip"
        })
    }
};

const deleteFacility = async (req, res) => {
    const fname = req.query.name;

    if (!fname) {
        return res.status(400).json({
            message: "Please provide the facility ID",
        });
    }

    try {
        const facility = await db.Facility.findOne({ where: { name: fname } });
        if (!facility) {
            return res.status(404).json({
                message: "Facility not found",
            });
        }

        const deleteF = await deleteFac(fname);
        return res.status(200).json({
            message: "Facility has been deleted",
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error deleting the facility",
            error: err.message,
        });
    }
};

const showFacility = async (req, res) => {
    
    try{
        const facilities = await db.Facility.findAll({
            attributes: ['name']
        })
        return res.status(200).json({
            message: "Here are the facilities",
            facilities
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error",
            error: err
        });
    }
};

const showEquipmentCount = async(req, res) =>{
    const ename = req.query.ename;
    if(!ename){
        return res.status(400).json({
            message: "select an equipment"
        })
    }
    try{
        const counts = await db.Equipment.findOne({
            where: {Ename: ename},
            attributes: ['StatusAvailable', 'StatusBooked', 'StatusReserved', 'StockCount']
        })
        return res.status(200).json({
            message: `returned counts of ${ename}`,
            counts
        })
    }
    catch{
        return res.status(500).json({
            message: "internal server error here"
        })

    }
    
}

const totalBookings = async (req, res) => {

}

const mostActive = async(req, res) =>{

}

const popularEquipmentNFacilities = async (req, res) => {

}

const getPeakHours = async (req, res) => {

}

export {showEquipmentCount, adminBoard, addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility, totalBookings, mostActive, popularEquipmentNFacilities, getPeakHours};