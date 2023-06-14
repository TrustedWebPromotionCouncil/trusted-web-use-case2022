import { supabase } from "../lib/db/db";

export const resetDB = async () => {
  await supabase.from("credential").delete().gte("id", 0);
  await supabase.from("transaction").delete().gte("id", 0);
};
