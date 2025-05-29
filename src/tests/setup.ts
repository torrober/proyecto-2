import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  try {
    // Use a separate test database
    const testMongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (!testMongoUri) {
      throw new Error("MongoDB URI not found in environment variables");
    }
    
    // Add test database suffix
    const testUri = testMongoUri.includes("?") ? 
      testMongoUri.replace("?", "_test?") : 
      `${testMongoUri}_test`;

    // Connect to MongoDB
    await mongoose.connect(testUri);
    
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Failed to connect to MongoDB");
    }

    // Clear database before all tests
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
});

afterEach(async () => {
  try {
    // Clean up after each test
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      await Promise.all(
        collections.map(collection => collection.deleteMany({}))
      );
    }
  } catch (error) {
    console.error("Cleanup failed:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Drop database and close connection after all tests
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error("Teardown failed:", error);
    throw error;
  }
});
