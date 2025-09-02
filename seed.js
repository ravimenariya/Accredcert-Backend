const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("./models/blogs"); // Adjust the path to your Blog model file

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const blogs = [
  {
    title: "Understanding Node.js",
    description: "A beginner's guide to the server-side JavaScript runtime.",
    body: "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.",
    category: "Programming",
    imageUrl:
      "https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png?w=500&fm=webp",
    status: "Published",
    author: "Jane Doe",
  },
  {
    title: "AI in Everyday Life",
    description:
      "How artificial intelligence is transforming our daily routines.",
    body: "From smart assistants to personalized recommendations, AI is becoming an integral part of our lives, automating tasks and offering new efficiencies.",
    category: "Technology",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGQGCBZxveoyTAoOJQfOKSr2KLFiKqK-vTHg&s",
    status: "Published",
    author: "Alex Miller",
  },
  {
    title: "The Future of Web 3.0",
    description:
      "Decentralized applications and the next generation of the internet.",
    body: "Web 3.0 aims to create a decentralized internet built on blockchain technology, giving users more control over their data and digital identities.",
    category: "Future Tech",
    imageUrl:
      "https://exeedcollege.com/wp-content/uploads/2023/07/web3-scaled.jpg",
    status: "Coming Soon",
    author: "Alex Miller",
  },
  {
    title: "An Introduction to Quantum Computing",
    description: "Exploring the fundamentals of a revolutionary field.",
    body: "Quantum computing harnesses the principles of quantum mechanics to perform complex calculations at speeds far beyond classical computers, promising to solve previously unsolvable problems.",
    category: "Science",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4OzAWEUBsji4-Apxx4G_W5-Thznr2WxyBA&s",
    status: "Coming Soon",
    author: "Jane Doe",
  },
  {
    title: "The Power of Express.js",
    description: "Building robust web applications with Express.",
    body: "Express.js is a back-end web application framework for Node.js. It simplifies the development of web applications and APIs.",
    category: "Web Development",
    imageUrl: "https://www.softude.com/wp-content/uploads/36.webp",
    status: "Published",
    author: "John Smith",
  },
  {
    title: "Getting Started with MongoDB",
    description: "A quick introduction to NoSQL databases.",
    body: "MongoDB is a document-oriented NoSQL database used for high volume data storage. Instead of using tables and rows, MongoDB utilizes collections and documents.",
    category: "Databases",
    imageUrl:
      "https://webimages.mongodb.com/_com_assets/cms/kuzt9r42or1fxvlq2-Meta_Generic.png",
    status: "Draft",
    author: "Jane Doe",
  },
];

// Function to seed the database
const importData = async () => {
  try {
    await Blog.deleteMany(); // Clear existing data to prevent duplicates
    await Blog.insertMany(blogs);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy all data
const destroyData = async () => {
  try {
    await Blog.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the script
const runSeeder = async () => {
  await connectDB();
  if (process.argv[2] === "-d") {
    destroyData();
  } else {
    importData();
  }
};

runSeeder();
