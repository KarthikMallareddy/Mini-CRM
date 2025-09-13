import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

describe("Auth API", () => {
  beforeAll(async () => {
    // Optionally connect to test DB
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "testuser@example.com", password: "testpass123" });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  });
});
