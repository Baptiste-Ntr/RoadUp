import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// PUT /api/collaborators/[id] - Modifier le rôle d'un collaborateur
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!role || !["viewer", "editor", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "role invalide (viewer, editor, admin)" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("project_collaborators")
      .update({ role })
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

// DELETE /api/collaborators/[id] - Retirer un collaborateur
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("project_collaborators")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Collaborateur retiré" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

