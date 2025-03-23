const adminBoard = (req,res) => {
    return res.status(200).json({
        message: "this is the admin endpoint",
    });
};

const addEquipment = (req,res) => {
    return res.status(200).json({
        message: "you have reached the add endpoint"
    });
};

const updateEquipment = (req,res) => {
    return res.status(200).json({
        message: "you have reached the update endpoint"
    });
};

const deleteEquipment = (req,res) => {
    return res.status(200).json({
        message: "you have reached the delete endpoint"
    });
};


const showAnalytics = (req, res) => {
    return res.status(200).json({
        message: "you have reached the analytics endpoint"
    });
};


export {adminBoard, addEquipment, updateEquipment, deleteEquipment, showAnalytics};