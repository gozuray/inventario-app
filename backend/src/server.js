import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 API en puerto ${PORT}`)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
