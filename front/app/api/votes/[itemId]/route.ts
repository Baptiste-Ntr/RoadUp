import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ itemId: string }> };

// POST /api/votes/[itemId] - Toggle vote (ajoute ou retire)
export async function POST(_request: Request, { params }: Params) {
  try {
    const { itemId } = await params;
    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Utilise la fonction RPC optimisée
    const { data: hasVoted, error } = await supabase.rpc("toggle_vote", {
      p_item_id: itemId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        voted: hasVoted,
        message: hasVoted ? "Vote ajouté" : "Vote retiré",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


