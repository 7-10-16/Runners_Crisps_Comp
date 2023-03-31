{
  $jsonSchema: {
    bsonType: "object",
    required: [ "name", "email", "age", "createdAt", "updatedAt" ],
    properties: {
      name: {
        bsonType: "string",
      },
      email: {
        bsonType: "string",
        pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$",
      },
      age: {
        bsonType: "int",
        minimum: 18,
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      }
    }
  }
}
