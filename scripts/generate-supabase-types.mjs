import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const output = execSync(
  "npm exec -- supabase gen types typescript --local --schema public",
  {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  },
);

writeFileSync("lib/supabase/database.types.ts", output, "utf8");
