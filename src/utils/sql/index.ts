export function sql(parts: TemplateStringsArray, ...variables: unknown[]) {
  const statement =  parts.reduce<{ sql: string; args: (string | number)[] }>((acc, part, i) => {
    const argument = variables[i];
    acc.sql += part;
    if (typeof argument === "string" || typeof argument === "number") {
      acc.sql += "?";
      acc.args.push(argument);
    } else if (typeof argument === "object" && argument !== null && "raw" in argument && typeof argument.raw === "string") {
      acc.sql += argument.raw;
    } else if (argument === undefined) {
      // Nothing
    } else {
      throw new Error("Not supported", { cause: argument })
    }
    return acc;
  }, { sql: "", args: [] });
  return statement;
}