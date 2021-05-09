import dotenv from "dotenv";
dotenv.config();

module.exports = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if (!token || token !== process.env.BETA_CLIENT_KEY) {
        res.status(401).json({
            error: 'Invalid authentication key.'
        })
    } else {
        next();
    }
}