import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
import { v4 as uuidv4 } from 'uuid';

export const handler = async function(event: any) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    let body;
    
    try {
      switch (event.httpMethod) {
        case "GET":
          if (event.pathParameters != null) {
            body = await getById(event.pathParameters.id); // GET product/{id}
          } else {
            body = await getAll(); // GET product
          }
          break;
        case "POST":
          body = await create(event); // POST /product
          break;
        case "DELETE":
          body = await remove(event.pathParameters.id); // DELETE /product/{id}
          break;
        case "PUT":
            body = await update(event); // PUT /product/{id}
          break;
        default:
          throw new Error(`Unsupported route: "${event.httpMethod}"`);
      }

      console.log(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: body
        })
      };

    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message,
          errorStack: e.stack,
        })
      };
    }
};

const getById = async (id: string) => {
  console.log("getById");

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id })
    };

    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log(Item);
    return (Item) ? unmarshall(Item) : {};

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const getAll = async () => {
  console.log("getAll");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME
    };

    const { Items } = await ddbClient.send(new ScanCommand(params));

    console.log(Items);
    return (Items) ? Items.map((item) => unmarshall(item)) : {};

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const create = async (event: any) => {
  console.log(`createProduct function. event : "${event}"`);
  try {
    const productRequest = JSON.parse(event.body);
    // set productid
    const id = uuidv4();
    productRequest.id = id;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(productRequest || {})
    };

    const createResult = await ddbClient.send(new PutItemCommand(params));

    console.log(createResult);
    return createResult;

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const remove = async (id: string) => {
  console.log(`deleteProduct function. productId : "${id}"`);

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id }),
    };

    const deleteResult = await ddbClient.send(new DeleteItemCommand(params));

    console.log(deleteResult);
    return deleteResult;
  } catch(e) {
    console.error(e);
    throw e;
  }
}

const update = async (event: any) => {
  console.log(`updateProduct function. event : "${event}"`);
  try {
    const requestBody = JSON.parse(event.body);
    const objKeys = Object.keys(requestBody);
    console.log(`updateProduct function. requestBody : "${requestBody}", objKeys: "${objKeys}"`);    

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: event.pathParameters.id }),
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
          ...acc,
          [`:value${index}`]: requestBody[key],
      }), {})),
    };

    const updateResult = await ddbClient.send(new UpdateItemCommand(params));

    console.log(updateResult);
    return updateResult;
  } catch(e) {
    console.error(e);
    throw e;
  }

}
