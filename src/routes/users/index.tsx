import React from "react";
import { SchemaTable, IColumnConfig } from "mig-schema-table";
import { components } from "../../types/openapi";
import openApiResolved from "../../inc/schema";
import { UserContext } from "../../provider/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const schema = openApiResolved.components.schemas.Users;

const Users = () => {
  const { users, setUsers, userErrors, setUserErrors } =
    React.useContext(UserContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userErrors?.length) {
      setUserErrors([]);
    }

    if (users === undefined) {
      setUsers(null);
      axios
        .request({
          method: "GET",
          url: `http://localhost:3001/users`,
        })
        .then((res) => {
          setUsers(res.data);
        });
    }
  }, [userErrors, setUsers, users, setUserErrors]);

  const benefits = React.useCallback((data: components["schemas"]["Users"]) => {
    return data.point! >= 2000 ? (
      <div>Gold</div>
    ) : data.point! >= 1000 ? (
      <div>Silver</div>
    ) : data.point! >= 500 ? (
      <div>Bronze</div>
    ) : (
      <></>
    );
  }, []);

  const config = React.useMemo<{
    [propName: string]: IColumnConfig<components["schemas"]["Users"]>;
  }>(
    () => ({
      userId: {
        order: 1,
        title: "Benefits",
        renderCell: (rowData) => {
          return benefits(rowData);
        },
      },
    }),
    [benefits],
  );

  const onRowClick = React.useCallback(
    (data: components["schemas"]["Users"]) => {
      navigate(`/user/${data.userId}`);
    },
    [navigate],
  );

  const onRowClassName = React.useCallback(
    (user: components["schemas"]["Users"]) => {
      const className = [];

      className.push("status");
      className.push(
        user.status === "active" ? " status-active" : " status-non-active",
      );

      return className.join(" ");
    },
    [],
  );

  return (
    <SchemaTable<components["schemas"]["Users"]>
      data={users || []}
      config={config}
      onRowClick={onRowClick}
      schema={schema}
      getRowClassName={onRowClassName}
      width={window.innerWidth}
    />
  );
};

export default React.memo(Users);