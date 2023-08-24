import React from "react";
import { components } from "../types/openapi";
import { ErrorObject } from "ajv";

function emptyFn() {
  console.log("Not implemented");
}

interface IUserContext {
  users?: components["schemas"]["Users"][] | null;
  setUsers: (
    users: components["schemas"]["Users"][] | null | undefined,
  ) => void;
  user?: components["schemas"]["Users"];
  setUser: (user: components["schemas"]["Users"]) => void;
  userErrors?: ErrorObject[];
  setUserErrors: React.Dispatch<React.SetStateAction<ErrorObject[]>>;
}

export const UserContext = React.createContext<IUserContext>({
  setUsers: emptyFn,
  setUser: emptyFn,
  setUserErrors: emptyFn,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = React.useState<
    components["schemas"]["Users"][] | null
  >();
  const [user, setUser] = React.useState<components["schemas"]["Users"]>();
  const [userErrors, setUserErrors] = React.useState<ErrorObject[]>([]);

  return (
    <UserContext.Provider
      value={{ users, setUsers, user, setUser, userErrors, setUserErrors }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
