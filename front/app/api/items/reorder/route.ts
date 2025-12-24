import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST /api/items/reorder - Réordonner les items (drag & drop)
export async function POST(request: Request) {
  try {
    const { project_id, status, item_ids } = await request.json();

    if (!project_id || !status || !item_ids || !Array.isArray(item_ids)) {
      return NextResponse.json(
        { error: "project_id, status et item_ids sont requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Utilise la fonction RPC optimisée
    const { error } = await supabase.rpc("reorder_items", {
      p_project_id: project_id,
      p_status: status,
      p_item_ids: item_ids,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Items réordonnés" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

