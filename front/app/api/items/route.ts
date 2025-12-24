import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST /api/items - Créer un nouvel item de roadmap
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      project_id,
      title,
      description,
      status = "planned",
      priority = "p2",
      category,
      target_date,
      labels = [],
    } = body;

    if (!project_id || !title) {
      return NextResponse.json(
        { error: "project_id et title sont requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Récupérer la dernière position pour ce status
    const { data: lastItem } = await supabase
      .from("roadmap_items")
      .select("position")
      .eq("project_id", project_id)
      .eq("status", status)
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const position = (lastItem?.position ?? 0) + 1;

    const { data, error } = await supabase
      .from("roadmap_items")
      .insert({
        project_id,
        title,
        description,
        status,
        priority,
        category,
        target_date,
        labels,
        position,
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

