import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    
    const {token} = req.cookies;
    
    if (!token) {
      return res.json({ success: false, msg: "Not Authorized" });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            
            req.user = { userId: tokenDecode.id };
            
        } else {
            return res.json({ success: false, msg: "Not Authorized" });
        }
        next();
    } catch (error) {
        console.log(error.message);
        
        res.json({ success: false, msg: error.message });
    }
}
export default  authUser;