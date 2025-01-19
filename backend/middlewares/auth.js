import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try{
        // const {token}=req.cookies;
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Please login!",
                success: false,
            });
        }

        const decodedObj = jwt.verify(token, process.env.SECRET_KEY);
        if(!decodedObj){
            return res.status(401).json({
                message: "Authentication Denied.",
                success: false,
            });
        }
        const {userId} = decodedObj;
        req.id = userId;
        next();
    }
    catch(err){
        console.log(err);        
    }
}

export default userAuth;