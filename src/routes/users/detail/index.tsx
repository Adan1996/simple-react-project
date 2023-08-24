import React from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../provider/userContext";
import { SchemaForm } from "mig-schema-form";
import openApiResolved from "../../../inc/schema";
import { components } from "../../../types/openapi";
import axios from "axios";
import ajv from "../../../inc/ajv";
import { ErrorObject } from "ajv";

import "mig-schema-form/dist/index.css";

const schema = openApiResolved.components.schemas.Users;

const validate = ajv.compile(schema);

const Detail = () => {
  const { userId } = useParams();
  const { users, user, setUser, userErrors, setUserErrors } =
    React.useContext(UserContext);
  validate(user);

  const originalUsers = React.useMemo(() => {
    if (users && userId) {
      return users?.find(
        (user: components["schemas"]["Users"]) =>
          user.userId === parseInt(userId),
      );
    }
    return undefined;
  }, [userId, users]);

  React.useEffect(() => {
    if (originalUsers) {
      setUser(originalUsers);
    }
  }, [originalUsers, setUser]);

  const onChangeHandler = React.useCallback(
    (value: components["schemas"]["Users"]) => {
      setUser(value);
    },
    [setUser],
  );

  const onUpdateHandler = React.useCallback(() => {
    const newError: ErrorObject[] = validate.errors || [];
    setUserErrors(newError);
    if (newError.length) {
      return;
    }
    axios
      .request({
        method: "PUT",
        url: `http://localhost:3001/users/${userId}`,
        data: user,
      })
      .then(() => {
        window.location.href = "/";
      });
  }, [setUserErrors, user, userId]);

  return (
    <>
      <h3>Details #{userId}</h3>
      <SchemaForm
        onChange={onChangeHandler}
        errors={userErrors}
        value={user}
        schema={schema}
      />
      <button className={"btn btn-primary"} onClick={onUpdateHandler}>
        Update
      </button>
    </>
  );
};

export default React.memo(Detail);