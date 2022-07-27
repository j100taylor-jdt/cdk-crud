import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayProps {
    microservice: IFunction,
    modelName: string

}

export class ApiGateway extends Construct {    

    constructor(scope: Construct, id: string, props: ApiGatewayProps) {
        super(scope, id);

        this.createApi(props.microservice, props.modelName);

    }

    private createApi(microservice: IFunction, modelName: string) {


      const apigw = new LambdaRestApi(this, modelName + 'Api', {
        restApiName: modelName + ' Service',
        handler: microservice,
        proxy: false
      });
  
      const root = apigw.root.addResource(modelName);
      root.addMethod('GET'); 
      root.addMethod('POST');  
      
      const single = root.addResource('{id}'); 
      single.addMethod('GET'); 
      single.addMethod('PUT'); 
      single.addMethod('DELETE'); 
    }

}