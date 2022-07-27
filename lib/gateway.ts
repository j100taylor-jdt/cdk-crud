import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayProps {
    microservice: IFunction,
    tableName: string

}

export class ApiGateway extends Construct {    

    constructor(scope: Construct, id: string, props: ApiGatewayProps) {
        super(scope, id);

        this.createApi(props.microservice, props.tableName);

    }

    private createApi(microservice: IFunction, tableName: string) {


      const apigw = new LambdaRestApi(this, tableName + 'Api', {
        restApiName: 'Product Service',
        handler: microservice,
        proxy: false
      });
  
      const product = apigw.root.addResource('product');
      product.addMethod('GET'); // GET /product
      product.addMethod('POST');  // POST /product
      
      const singleProduct = product.addResource('{id}'); // product/{id}
      singleProduct.addMethod('GET'); // GET /product/{id}
      singleProduct.addMethod('PUT'); // PUT /product/{id}
      singleProduct.addMethod('DELETE'); // DELETE /product/{id}
    }

}