import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskPro API",
      version: "1.0.0",
      description: "TaskPro backend API documentation"
    }
  },
  apis: ["./src/routes/*.js","./src/models/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
