import { createClient } from "redis";

export const client = createClient({
  url: `redis://localhost:6379`,
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const connect = async () => {
  await client.connect();
  console.log('Redis Client connected to redis')
};
