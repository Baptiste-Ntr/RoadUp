import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/projects - Récupère tous les projets de l'utilisateur
export async function GET() {
  try {
    const supabase = await createClient();

    // Utilise la fonction RPC optimisée
    const { data, error } = await supabase.rpc("get_user_projects");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/projects - Créer un nouveau projet
export async function POST(request: Request) {
  try {
    const { name, description, is_public = true } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du projet est requis" },
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

    // Vérifier les limites du plan
    const { data: limits } = await supabase.rpc("check_plan_limits", {
      p_user_id: user.id,
    });
    if (limits && !limits.can_create_project) {
      return NextResponse.json(
        { error: "Limite de projets atteinte pour votre plan" },
        { status: 403 }
      );
    }

    // Générer un slug unique
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .concat("-", Date.now().toString(36));

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        slug,
        description,
        is_public,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


