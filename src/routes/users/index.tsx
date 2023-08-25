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

  const getUserData = React.useCallback(() => {
    axios
      .request({
        method: "GET",
        url: `http://localhost:3001/users`,
      })
      .then((res) => {
        setUsers(res.data);
      });
  }, [setUsers]);

  React.useEffect(() => {
    if (!users) {
      setUsers(null);
      getUserData();
    }

    return () => {
      if (userErrors?.length) {
        setUserErrors([]);
      }
    };
  }, [userErrors, setUsers, users, setUserErrors, getUserData]);

  const benefits = React.useCallback((data: components["schemas"]["Users"]) => {
    switch (true) {
      case data.point! >= 2000:
        return <div>Gold</div>;
        break;
      case data.point! >= 1000:
        return <div>Silver</div>;
        break;
      case data.point! >= 500:
        return <div>Bronze</div>;
        break;
      default:
        return <div></div>;
    }
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
      return user.status === "active"
        ? "status status-active"
        : "status status-non-active";
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
