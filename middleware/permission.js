// grab the access token from the request and verify it with jwt.verify, check for a user and it its attached to a user then authorize

const User = require('../models/User');
const jwt = require('jsonwebtoken');


const requiresAuth = async (req, res, next) => {
    // grab token
    const token = req.cookies["access-token"];
    // create isAuthed by default false, if token can ve verified the isAuthed will return true
    let isAuthed = false;

    if(token){
        // if there is a token, logic here...
        try {
            const {userId} = jwt.verify(token, process.env.JWT_SECRET)

            try {
                const user = await User.findById(userId);

                if(user) {
                    const userToReturn = { ...user._doc};
                    delete userToReturn.password;
                    req.user = userToReturn;
                    isAuthed = true;
                }
            } catch {
                isAuthed = false;
            }

        } catch {
            isAuthed = false

        }
    } 

    if(isAuthed) {
        // if isAuthed variable equals true, then we continue
        return next()

    } else {
        return res.status(401).send("Unauthorised")
    }
}

mocukde.exports = requiresAuth