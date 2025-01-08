export function sql(parts: TemplateStringsArray, ...variables: unknown[]) {
  return parts.reduce<{ sql: string; args: string[] }>((acc, part, i) => {
    acc.sql = acc.sql + part + "?";
    acc.args.push(String(variables[i]));
    return acc;
  }, { sql: "", args: [] })
}