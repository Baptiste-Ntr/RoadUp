import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/items/[id] - Récupérer un item avec ses commentaires
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmap_items")
      .select(
        `
        *,
        comments (
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (name, avatar_url)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/items/[id] - Mettre à jour un item
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, category, target_date, labels } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmap_items")
      .update({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(category !== undefined && { category }),
        ...(target_date !== undefined && { target_date }),
        ...(labels !== undefined && { labels }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/items/[id] - Supprimer un item
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("roadmap_items").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Item supprimé" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

