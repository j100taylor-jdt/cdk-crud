import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from './database';
import { Microservice } from './microservice';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkCrudStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const tableName = 'mytable'

    const db = new Database(this, tableName+'1', {tableName});
    
    new Microservice(this, tableName + 'Microservice', {
      table: db.table,
      tableName
    });
  }
}
