import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envRaw = fs.readFileSync(".env", "utf8");
const envMap = {};

for (const line of envRaw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
  const idx = trimmed.indexOf("=");
  const key = trimmed.slice(0, idx).trim();
  let value = trimmed.slice(idx + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  envMap[key] = value;
}

const url = envMap.VITE_SUPABASE_URL;
const key = envMap.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("ERROR: Missing Supabase URL or publishable key in .env");
  process.exit(1);
}

const supabase = createClient(url, key);
const timestamp = Date.now();
const email = `student.test.${timestamp}@rhema.local`;
const password = "Test@12345!";

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name: "Test",
      last_name: "Student",
      phone: "+237600000000",
      program: "certificate",
    },
  },
});

if (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}

console.log(`EMAIL:${email}`);
console.log(`PASSWORD:${password}`);
console.log(`USER_ID:${data.user?.id ?? ""}`);
console.log(`EMAIL_CONFIRMED:${data.user?.email_confirmed_at ? "yes" : "no"}`);
