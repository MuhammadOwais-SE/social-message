import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {z} from "zod";
import {usernameValid} from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValid
});
// study by debounce technique
export async function GET(request: Request){
    await dbConnect();

    try {
        // to need to extract the value from the query parameter(A URL WITH key and value)
        // e.g /api/check-username?username=owais?phone=andriod
        const {searchParams} = new URL(request.url)
        // because of zod syntax we need to make object which extract the username not a variable
        const queryParam = {
            username: searchParams.get('username') // note we getting the value through the object
        }
        // validation with zod
        // we write safeParse if schema is follow we will get the value
        const result = UsernameQuerySchema.safeParse(queryParam);  
        console.log(result); // we get alot of things from it

        if(!result.success){
           const usernameErrors = result.error.format().username?._errors || []
           return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
           }, {status: 400})

        }
    //   start 19:49 video
    const {username} = result.data;
    const existingVerifyUser = await userModel.findOne({username, isVerify: true}) 

    if(existingVerifyUser){
        return Response.json({
            success: false,
            message: "Username name already taken"
        },{status: 400})
    }else{
        return Response.json({
            success: true,
            message: "Username is unique"
        }, {status: 100})
    }

    } catch (error) {
        console.log("Error checking username: ",error);
        return Response.json({
            success: false,
            message:"Error checking username"
        },
        {status: 500})
    }
}