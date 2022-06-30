// USER MODEL IS DATA OUR APP IS EXPECTING TO STORE OR RECEIVE WHEN REFERENCING USERS FROM DATABASE

// Import mongoose
const {Schema, model} = require("mongoose");

const UserSchema = new Schema(
    //define what kind of data we are expecting
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
); 

// export the model
const User = model("User", UserSchema);
module.exports = User;