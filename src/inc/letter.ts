export const uncamel = (data: string) => {
  const uncamelStr = data.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");

  let flat = "";
  uncamelStr.forEach((word) => {
    flat += word.charAt(0).toUpperCase() + word.slice(1) + " ";
  });
  return flat;
};
