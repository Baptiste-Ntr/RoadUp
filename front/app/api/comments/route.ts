import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/comments?item_id=xxx - Récupérer les commentaires d'un item
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get("item_id");

    if (!item_id) {
      return NextResponse.json(
        { error: "item_id est requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        user_id,
        profiles:user_id (name, avatar_url)
      `
      )
      .eq("item_id", item_id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/comments - Créer un commentaire
export async function POST(request: Request) {
  try {
    const { item_id, content } = await request.json();

    if (!item_id || !content) {
      return NextResponse.json(
        { error: "item_id et content sont requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        item_id,
        content,
        user_id: user.id,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (name, avatar_url)
      `
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


