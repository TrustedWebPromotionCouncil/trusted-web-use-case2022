import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import { Database } from "./schema";

dotenv.config();

const supabaseUrl = "https://ojawoqehgnspeyjqlzye.supabase.co";
export const supabase = createClient<Database>(supabaseUrl, process.env.SUPABASE_PROJECT_SERVICE_KEY);
