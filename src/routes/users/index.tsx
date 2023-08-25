import React from "react";
import { SchemaTable, IColumnConfig } from "mig-schema-table";
import { components } from "../../types/openapi";
import openApiResolved from "../../inc/schema";
import { UserContext } from "../../provider/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Select from "react-select";
import { oas31 } from "openapi3-ts";
import { uncamel } from "../../inc/letter";

const schema = openApiResolved.components.schemas.Users;

const Users = () => {
  const { users, setUsers } = React.useContext(UserContext);
  const [selectedStatus, setSelectedStatus] =
    React.useState<components["schemas"]["Users"]["status"]>("active");
  const navigate = useNavigate();
  const properties = schema.properties!.status as oas31.SchemaObject;

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
  }, [setUsers, users, getUserData]);

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
        width: 100,
        title: "Benefits",
        renderCell: (rowData) => {
          return benefits(rowData);
        },
      },
      username: {
        order: 2,
        width: 210,
      },
      age: {
        order: 3,
        width: 100,
      },
      email: {
        order: 4,
        width: 210,
      },
      point: {
        order: 5,
        width: 100,
      },
      gender: {
        order: 6,
        width: 100,
      },
      savings: {
        order: 7,
        width: 100,
      },
      status: {
        order: 8,
        width: 110,
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

  const customElement = React.useMemo(() => {
    return (
      <Select
        isClearable
        onChange={(option) => setSelectedStatus(option ? option.value : "")}
        options={properties.enum?.map((option) => ({
          value: option,
          label: uncamel(option),
        }))}
      />
    );
  }, [properties.enum]);

  const dataWithOrWithoutFilter = React.useMemo(() => {
    if (!users) {
      return [];
    }
    return !selectedStatus
      ? users
      : users.filter((el) => el.status.includes(selectedStatus));
  }, [selectedStatus, users]);

  return (
    <>
      <SchemaTable<components["schemas"]["Users"]>
        data={dataWithOrWithoutFilter || []}
        config={config}
        onRowClick={onRowClick}
        schema={schema}
        getRowClassName={onRowClassName}
        width={window.innerWidth}
        customElement={customElement}
      />
    </>
  );
};

export default React.memo(Users);
