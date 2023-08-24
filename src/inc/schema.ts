import openapi from "../openapi.json";
import { oas31 } from "openapi3-ts";

function resolve(
  schema: oas31.SchemaObject | oas31.ReferenceObject,
): oas31.SchemaObject {
  const { items, properties, $ref, allOf } = schema as oas31.SchemaObject &
    oas31.ReferenceObject;
  if ($ref) {
    // e.g. #/components/schemas/Role
    const path = $ref.substring(2).split("/");
    let result: any = openapi;
    let pointer = path.shift();
    while (pointer) {
      result = result[pointer];
      pointer = path.shift();
    }
    // console.log(path);
    return resolve(result);
  }

  if (allOf) {
    return allOf.map(resolve).reduce(
      (prev, schema) => ({
        ...prev,
        properties: {
          ...prev.properties,
          ...schema.properties,
        },
        required: [...(prev.required || []), ...(schema.required || [])],
      }),
      {
        type: "object",
        properties: {},
        required: [],
      },
    );
  }

  if (items) {
    return {
      ...schema,
      items: resolve(items),
    };
  }
  if (properties) {
    return {
      ...schema,
      properties: Object.keys(properties).reduce<any>((prev, propName) => {
        prev[propName] = resolve(properties[propName]);
        return prev;
      }, {}),
    };
  }
  return schema as oas31.SchemaObject;
}

const openApiResolved = {
  ...openapi,
  components: {
    ...openapi.components,
    schemas: Object.entries(openapi.components.schemas).reduce<{
      [schema: string]: oas31.SchemaObject;
    }>((prev, [schemaName, schema]) => {
      prev[schemaName] = resolve(schema as oas31.SchemaObject);
      return prev;
    }, {}),
  },
};

export default openApiResolved;
