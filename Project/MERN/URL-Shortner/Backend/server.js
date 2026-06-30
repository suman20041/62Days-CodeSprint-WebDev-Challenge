import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is running on 5000...")
})

import connectDb from "./src/db/db.js";

await connectDb();