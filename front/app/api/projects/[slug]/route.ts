import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ slug: string }> };

// GET /api/projects/[slug] - Récupère un projet avec ses items
export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Utilise la fonction RPC optimisée
    const { data, error } = await supabase.rpc("get_project_with_items", {
      project_slug: slug,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/projects/[slug] - Mettre à jour un projet
export async function PUT(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, description, is_public, image_url } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(is_public !== undefined && { is_public }),
        ...(image_url !== undefined && { image_url }),
      })
      .eq("slug", slug)
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

// DELETE /api/projects/[slug] - Supprimer un projet
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("projects").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Projet supprimé" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


