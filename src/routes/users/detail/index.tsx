import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../provider/userContext";
import { SchemaForm } from "mig-schema-form";
import openApiResolved from "../../../inc/schema";
import { components } from "../../../types/openapi";
import axios from "axios";
import ajv from "../../../inc/ajv";
import { ErrorObject } from "ajv";

const schema = openApiResolved.components.schemas.Users;

const validate = ajv.compile(schema);

const Detail = () => {
  const { userId } = useParams();
  const { users, setUsers, userErrors, setUserErrors } =
    React.useContext(UserContext);
  const navigate = useNavigate();

  const originalUsers = React.useMemo(() => {
    if (users && userId) {
      return users?.find(
        (user: components["schemas"]["Users"]) =>
          user.userId === parseInt(userId),
      );
    }
    return;
  }, [userId, users]);

  const onChangeHandler = React.useCallback(
    (value: components["schemas"]["Users"]) => {
      const newObj = {
        ...originalUsers,
        ...value,
      };

      setUsers(
        users?.map((el) => {
          return el.userId === parseInt(userId!) ? { ...el, ...newObj } : el;
        }),
      );
    },
    [originalUsers, setUsers, userId, users],
  );

  const onUpdateHandler = React.useCallback(() => {
    validate(originalUsers);
    const newError: ErrorObject[] = validate.errors || [];

    if (newError.length) {
      setUserErrors(newError);
      return;
    }

    axios
      .request({
        method: "PUT",
        url: `http://localhost:3001/users/${userId}`,
        data: originalUsers,
      })
      .then(() => {
        navigate("/");
      });
  }, [navigate, originalUsers, setUserErrors, userId]);

  return (
    <>
      <h3>Details #{userId}</h3>
      <SchemaForm
        onChange={onChangeHandler}
        errors={userErrors}
        value={originalUsers}
        schema={schema}
      />
      <button className={"btn btn-primary"} onClick={onUpdateHandler}>
        Update
      </button>
    </>
  );
};

export default React.memo(Detail);
