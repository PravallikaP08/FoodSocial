const PORT = process.env.PORT || 3000;
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
