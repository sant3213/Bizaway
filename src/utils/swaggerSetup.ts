
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from '../config/swaggerConfig.js';

const swaggerDocs = swaggerJsDoc(swaggerConfig);

export const setupSwagger = (app: any): void => {  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
