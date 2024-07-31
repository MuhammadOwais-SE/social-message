import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date
}

export interface User extends Document {
    username: String,
    email: String,
    password: String,
    verifyCode: String,
    verifyCodeExpiry: Date,
    isVerify: boolean,
    isAcceptingMsg: boolean,
    messages: Message[]
}

const messageSchema: Schema<Message> = new Schema ({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


const UserSchema: Schema<User> = new Schema ({
    username: {
        type: String,
        required: [true, "User is required"]
    },
    email: { 
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email"] // added from regex email validation
    },
    password: { 
        type: String,
        required: [true, "Please enter a valid password"]
    },    
    verifyCode: { 
        type: String,
        required: [true, "Please enter the correct code"]
    },
    verifyCodeExpiry: { 
        type: Date,
        required: [true, "verfiy code expiry is required"]
    },
    isVerify: { 
        type: Boolean,
        default: false 
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]

})
// now for exporting the model.
// Next.js run at edage time. so next.js does not know that is my application boot for the first time or not. 
// so model should not be created again 
// in node.js once sever is loaded, it is run.
// so it method is different from node.js

// first expression is due to when model is already created  || second expression for creating the model for the first time.
const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
                                    // here "as " (typescript declare) 
                                    
export default userModel;  