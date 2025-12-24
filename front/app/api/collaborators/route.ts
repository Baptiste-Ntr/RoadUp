import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/collaborators?project_id=xxx - Récupérer les collaborateurs d'un projet
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id est requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("project_collaborators")
      .select(
        `
        id,
        role,
        created_at,
        user_id,
        profiles:user_id (id, name, avatar_url)
      `
      )
      .eq("project_id", project_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/collaborators - Ajouter un collaborateur
export async function POST(request: Request) {
  try {
    const { project_id, user_id, role = "viewer" } = await request.json();

    if (!project_id || !user_id) {
      return NextResponse.json(
        { error: "project_id et user_id sont requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("project_collaborators")
      .insert({
        project_id,
        user_id,
        role,
      })
      .select(
        `
        id,
        role,
        created_at,
        profiles:user_id (id, name, avatar_url)
      `
      )
      .single();

    if (error) {
      // Gestion du cas où le collaborateur existe déjà
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ce collaborateur existe déjà" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

