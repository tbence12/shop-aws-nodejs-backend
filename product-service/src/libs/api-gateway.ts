export const formatJSONResponse = (response: any, statusCode: number = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
}
