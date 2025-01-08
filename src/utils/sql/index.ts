export function sql(parts: TemplateStringsArray, ...variables: unknown[]) {
  const statement = parts.reduce<{ sql: string; args: string[] }>((acc, part, i) => {
    const argument = variables[i];
    acc.sql += part;
    if (argument !== undefined) {
      acc.sql += "?";
      acc.args.push(String(argument));
    }
    return acc;
  }, { sql: "", args: [] });
  console.log({statement})
  return statement;
}