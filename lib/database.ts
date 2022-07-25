import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";


export interface DatabaseProps {
    tableName: string
}

export class Database extends Construct {
    
    table: ITable;


    constructor(scope: Construct, id: string, props: DatabaseProps) {
        super(scope, id);
      
         this.table = this.createTable(props.tableName);

    }

    //  DynamoDb Table Creation
    //  PK: id -
    private createTable(tableName: string) : ITable {
      const table = new Table(this, tableName, {
        partitionKey: {
          name: 'id',
          type: AttributeType.STRING
        },
        tableName: tableName,
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST
      });
      return table;
    }

}

