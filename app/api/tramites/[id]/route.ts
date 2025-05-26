import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Actualizar trámite
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nombre, descripcion, requisitos, costo, tiempo_estimado, categoria, documento_url, activo } =
      await request.json()
    const tramiteId = params.id

    const { data: tramite, error } = await supabase
      .from("tramites")
      .update({
        nombre,
        descripcion,
        requisitos,
        costo: costo || 0,
        tiempo_estimado,
        categoria,
        documento_url: documento_url || null,
        activo: activo !== false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tramiteId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Trámite actualizado exitosamente",
      data: tramite,
    })
  } catch (error) {
    console.error("Error updating tramite:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar trámite
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tramiteId = params.id

    const { error } = await supabase.from("tramites").delete().eq("id", tramiteId)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Trámite eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error deleting tramite:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
