const authorizeRoles = (...allowedRoles) => {

    return async (req, res, next) => {
        try {
    
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }


            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Access Denied" });
            }

            next();
            
        } catch (err) {
            console.error("Authorization error:", err);
            res.status(500).json({ 
                message: "Server error during authorization" 
            });
        }
    };
};

export default authorizeRoles;