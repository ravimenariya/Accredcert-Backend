const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('./models/certificate');

dotenv.config();

const dummyCertificates = [
  {
    certificateNumber: "FDAA1234B",
    customerName: "Global Foods Inc.",
    email: "contact@globalfoods.com",
    issueDate: new Date("2023-01-15"),
    expiryDate: new Date("2026-01-14"),
    category: "Food Manufacturing"
  },
  {
    certificateNumber: "FDAB5678C",
    customerName: "HealthPlus Supplements",
    email: "info@healthplus.com",
    issueDate: new Date("2022-08-20"),
    expiryDate: new Date("2025-08-19"),
    category: "Dietary Supplements"
  },
  {
    certificateNumber: "FDAC9012D",
    customerName: "Organic Farms Ltd.",
    email: "support@organicfarms.com",
    issueDate: new Date("2023-03-10"),
    expiryDate: new Date("2026-03-09"),
    category: "Food Production"
  },
  {
    certificateNumber: "FDAE3456F",
    customerName: "SafeDrinks LLC",
    email: "contact@safedrinks.com",
    issueDate: new Date("2021-11-05"),
    expiryDate: new Date("2024-11-04"),
    category: "Beverage Manufacturing"
  },
  {
    certificateNumber: "FDAF7890G",
    customerName: "NutriFoods Corp.",
    email: "hello@nutrifoods.com",
    issueDate: new Date("2022-05-22"),
    expiryDate: new Date("2025-05-21"),
    category: "Food Processing"
  },
  {
    certificateNumber: "FDAG2345H",
    customerName: "VitaHealth Labs",
    email: "info@vitahealthlabs.com",
    issueDate: new Date("2023-02-28"),
    expiryDate: new Date("2026-02-27"),
    category: "Pharmaceuticals"
  },
  {
    certificateNumber: "FDAH6789J",
    customerName: "FreshHarvest Co.",
    email: "support@freshharvest.com",
    issueDate: new Date("2022-09-18"),
    expiryDate: new Date("2025-09-17"),
    category: "Food Manufacturing"
  },
  {
    certificateNumber: "FDAI0123K",
    customerName: "PureWell Foods",
    email: "contact@purewell.com",
    issueDate: new Date("2023-06-01"),
    expiryDate: new Date("2026-05-31"),
    category: "Food Production"
  },
  {
    certificateNumber: "FDAJ4567L",
    customerName: "Global Pharma Ltd.",
    email: "info@globalpharma.com",
    issueDate: new Date("2021-12-12"),
    expiryDate: new Date("2024-12-11"),
    category: "Pharmaceuticals"
  },
  {
    certificateNumber: "FDAK8901M",
    customerName: "HealthyLife Supplements",
    email: "support@healthylife.com",
    issueDate: new Date("2022-07-30"),
    expiryDate: new Date("2025-07-29"),
    category: "Dietary Supplements"
  }
];


async function insertBlogs() {
 
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB");

    // Delete all existing certificates first
    const deleteResult = await Certificate.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing certificates`);

    // Insert dummy certificates
    await Certificate.insertMany(dummyCertificates);
    console.log("Dummy certificates inserted!");

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.error("Error inserting certificates:", err);
  }


}

module.exports=insertBlogs;
