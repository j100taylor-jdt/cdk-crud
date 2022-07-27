import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from './database';
import { Microservice } from './microservice';
import { ApiGateway } from './gateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkCrudStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const tableName = 'mytable'

    const db = new Database(this, tableName+'1', {tableName});
    
    const microservice = new Microservice(this, tableName + 'Microservice', {
      table: db.table,
      tableName
    });
    
    new ApiGateway(this, 'apiGateway', {
      microservice: microservice.crudMicroservice,
      tableName
    })
  }
}
