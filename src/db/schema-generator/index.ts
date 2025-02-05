import { z } from "zod";

export namespace model {

  const flags = {
    primaryKey: new WeakSet<z.ZodType>(),
    foreignKey: new WeakSet<z.ZodType>(),
    autoIncrement: new WeakSet<z.ZodType>(),
  }

  const customs = new WeakMap<z.ZodType, string>();

  export function apply<T extends z.ZodType>(schema: T, params: {
    flags?: Array<keyof typeof flags>;
    custom?: string;
  }) {
    if (params?.flags) {
      for (const flag of params.flags) {
        flags[flag as keyof typeof flags].add(schema);
      }
    }
    if (params.custom !== undefined) {
      customs.set(schema, params.custom);
    }
    return schema;
  }

  export function pkey() {
    return apply(z.number(), { flags: ["primaryKey", "autoIncrement"] })
  }

  export function fkey(table: string, column: string, options: { onDelete: "CASCADE" }) {
    return apply(z.number(), {
      custom: `REFERENCES ${table}(${column}) ON DELETE ${options.onDelete}`,
    })
  }

  export function isPrimaryKey(schema: z.ZodType) {
    return flags.primaryKey.has(schema);
  }

  export function isAutoIncrement(schema: z.ZodType) {
    return flags.autoIncrement.has(schema);
  }

  export function getCustom(schema: z.ZodType) {
    return customs.get(schema);
  }

}

function validatorType(validator: z.ZodType) {
  if (validator instanceof z.ZodNumber) {
    return ["INTEGER"] as const;
  } else if (validator instanceof z.ZodString) {
    return ["TEXT"] as const;
  } else if (validator instanceof z.ZodEnum) {
    const enums = (validator._def.values as string[]).map((value) => `'${value}'`).join(",");
    return ["TEXT", { checkIn: enums }] as const;
  } else if (
    validator instanceof z.ZodOptional ||
    validator instanceof z.ZodNullable
  ) {
    return validatorType(validator._def.innerType);
  } else {
    throw new Error(`unknown validator ${JSON.stringify(validator)}`)
  }
}

function validatorToColumn(column: string, validator: z.ZodTypeAny) {
  const builder: string[] = [column];

  const [type, options] = validatorType(validator);
  builder.push(type);

  if (!validator.isNullable()) {
    builder.push("NOT NULL");
  }

  if (model.isPrimaryKey(validator)) {
    builder.push("PRIMARY KEY");
  }

  if (model.isAutoIncrement(validator)) {
    builder.push("AUTOINCREMENT");
  }

  if (options?.checkIn) {
    builder.push(`CHECK( "${column}" IN (${options.checkIn}) )`);
  }

  const custom = model.getCustom(validator);
  if (custom) {
    builder.push(custom);
  }

  return builder.join(" ");
}

export function createTableFromSchema(table: string, schema: z.ZodObject<z.ZodRawShape>) {
  const builder: string[] = []
  for (const [column, validator] of Object.entries(schema.shape)) {
    builder.push(validatorToColumn(column, validator));
  }
  const sql = `CREATE TABLE "${table}" (
    ${builder.join(",\n")}
  )`;
  return sql;
}