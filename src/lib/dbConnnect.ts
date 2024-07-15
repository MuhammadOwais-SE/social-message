import mongoose from 'mongoose';

type connectionObject = {
    isConnected? : number
}

const connection: connectionObject = {}

console.log(connection)

async function dbConnect(): Promise<void>{
    // if database is already connected then do not try to connect again. It will create choking
    if(connection.isConnected){
        console.log("Connection is already established")
        return
    }

    try{
        const db = await mongoose.connect( process.env.MONGODB_URI || '',{})
        console.log("Successfully connected to database.");
    }
    catch(error){
        console.log(error);
        process.exit(1); // immediately terminated the operation. Any remaining operations or pending callbacks will not be executed. to avoid choking in database
    }
} 

export default dbConnect();