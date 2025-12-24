import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1>RoadUp</h1>
      {user ? (
        <p>Connecté en tant que : {user.email}</p>
      ) : (
        <p>Non connecté</p>
      )}
    </div>
  );
}
