import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "Auto-generated Swagger docs",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
