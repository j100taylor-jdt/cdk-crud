import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from './database';
import { Microservice } from './microservice';
import { ApiGateway } from './gateway';

export class CdkCrudStack extends Stack {
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const modelName = 'Person'

    const db = new Database(this, modelName+'Database', {tableName: modelName + 'Table'});
    
    const microservice = new Microservice(this, modelName + 'Microservice', {
      table: db.table,
      modelName
    });
    
    new ApiGateway(this, 'apiGateway', {
      microservice: microservice.crudMicroservice,
      modelName
    })
  }
}
