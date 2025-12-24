import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// PUT /api/comments/[id] - Modifier un commentaire
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "content est requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .update({ content })
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

// DELETE /api/comments/[id] - Supprimer un commentaire
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Commentaire supprimé" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

