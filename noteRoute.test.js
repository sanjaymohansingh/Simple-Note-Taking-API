// noteRoutes.test.js
const request = require("supertest");
const app = require("./server");
const mongoose = require("mongoose");

beforeAll(async () => {
  // Connect to the database before running tests
  await mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from the database after running tests
  await mongoose.disconnect();
});

describe("API Endpoint Tests", () => {
  let noteId;

  it("should create a new note", async () => {
    const response = await request(app).post("/api/notes").send({
      title: "Test Note",
      content: "This is a test note.",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    noteId = response.body._id;
  });

  it("should retrieve all notes", async () => {
    const response = await request(app).get("/api/notes");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should retrieve a single note by ID", async () => {
    const response = await request(app).get(`/api/notes/${noteId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", noteId);
  });

  it("should update a note", async () => {
    const response = await request(app).put(`/api/notes/${noteId}`).send({
      title: "Updated Test Note",
      content: "This is an updated test note.",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", noteId);
    expect(response.body.title).toBe("Updated Test Note");
  });

  it("should delete a note", async () => {
    const response = await request(app).delete(`/api/notes/${noteId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", noteId);
  });
});
