import "dotenv/config";

export function requireEnv(...keys: string[]): void {
  const missingKeys = keys.filter((key) => {
    const value = process.env[key];
    return value === undefined || value.trim() === "";
  });

  if (missingKeys.length > 0) {
    throw new Error(`Environment variable not found: ${missingKeys.join(", ")}`);
  }
}
