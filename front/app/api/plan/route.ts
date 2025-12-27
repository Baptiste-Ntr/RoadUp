import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/plan - Récupérer les limites et l'état du plan de l'utilisateur
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Utilise la fonction RPC optimisée
    const { data, error } = await supabase.rpc("check_plan_limits", {
      p_user_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


