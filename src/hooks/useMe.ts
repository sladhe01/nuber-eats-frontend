import { gql } from "../__generated__";
import { useQuery } from "@apollo/client";

const ME_QUERY = gql(`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
  `);

export const useMe = () => {
  return useQuery(ME_QUERY);
};
