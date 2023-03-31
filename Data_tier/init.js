mongo

// create a new database
use runners-crisps

// create a codes collection
db.createCollection("codes")

// create the users collection
db.createCollection("users")

// schema for the "users" collection
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "address", "best_player"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
        address: { bsonType: "string" },
        best_player: { bsonType: "string" }
      }
    }
  },
  validationAction: "error"
});

// insert an example code
db.codes.insertOne({
  code: "ABCDEF1234"
})

// insert example data into the users collection
db.users.insertOne({
  name: "John Doe",
  email: "johndoe@example.com",
  address: "123 Main St.",
  best_player: "Lionel Messi"
})
