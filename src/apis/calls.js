import client from "../graphql/client";


export const gqlPaginateGet = async (func, params) => {
  const data = await client.request(func);
  return data;
};


export const gqlQuey = async (func, body) => {
  const data = await client.request(func, {...body});
  return data;
};