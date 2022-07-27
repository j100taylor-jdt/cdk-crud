import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface MicroservicesProps {
    table: ITable,
    modelName: string
}

export class Microservice extends Construct {

  public readonly crudMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: MicroservicesProps) {
    super(scope, id);

    this.crudMicroservice = this.createFunction(props.table, props.modelName + 'Table');

  }

  private createFunction(table: ITable, tableName: string) : NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: table.tableName
      },
      runtime: Runtime.NODEJS_14_X
    }

    const lambdaFunction = new NodejsFunction(this, tableName + 'LambdaFunction', {
      entry: join(__dirname, `/../src/crud/index.ts`),
      ...nodeJsFunctionProps,
    });

    table.grantReadWriteData(lambdaFunction); 
    
    return lambdaFunction;
  }

}