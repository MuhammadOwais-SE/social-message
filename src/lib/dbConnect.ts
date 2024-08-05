import mongoose from 'mongoose';
// import dotenv from 'dotenv';

type connectionObject = {
    isConnected? : number
}

const connection: connectionObject = {}

console.log("Connection object:", connection)

async function dbConnect(): Promise<void>{
    // if database is already connected then do not try to connect again. It will create choking
    if(connection.isConnected){
        console.log("Connection is already established")
        return;
    }

    try{
        const db = await mongoose.connect( process.env.MONGODB_URI || '',{})
        console.log("Successfully connected to database.");
        // to show the state that the database is connected.
        connection.isConnected = db.connections[0].      
        readyState    
        console.log("DB connected successfully")
    }
    catch(error){
        console.log(error);
        process.exit(1); // immediately terminated the operation. Any remaining operations or pending callbacks will not be executed. to avoid choking in database
    }
} 

export default dbConnect;