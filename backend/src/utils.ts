import { Region } from "./dynamo-db";

export const formatName = (name: string, region: Region) => {
  return (region.toUpperCase() + "#" + name.toUpperCase()).padEnd(24);
};

export const formatStatus = (status: string) => {
  return status.padEnd(10);
};
