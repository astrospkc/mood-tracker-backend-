import mongoose from "mongoose";
const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connection to mongo is successfull");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default connectToMongo;
