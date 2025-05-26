"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Clock, DollarSign, FileText, X } from "lucide-react"

interface Tramite {
  id: number
  nombre: string
  descripcion: string
  requisitos: string
  costo: number
  tiempo_estimado: string
  categoria: string
  documento_url?: string
  activo: boolean
}

export default function TramitesPage() {
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showIniciarModal, setShowIniciarModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    observaciones: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [radicado, setRadicado] = useState("")

  const categorias = ["Licencias", "Certificados", "Permisos", "Paz y Salvos", "Otros"]

  useEffect(() => {
    fetchTramites()
  }, [])

  const fetchTramites = async () => {
    try {
      console.log("Fetching tramites...")
      const response = await fetch("/api/tramites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.success && Array.isArray(data.data)) {
        setTramites(data.data)
      } else {
        console.error("Invalid API response:", data)
        // Usar datos simulados como fallback
        setTramites([
          {
            id: 1,
            nombre: "Certificado de Residencia",
            descripcion: "Certificado que acredita la residencia actual en el municipio de Tibirita",
            requisitos:
              "Cédula de ciudadanía original y copia\nRecibo de servicios públicos no mayor a 3 meses\nFormulario de solicitud diligenciado",
            costo: 8000,
            tiempo_estimado: "1 día hábil",
            categoria: "Certificados",
            documento_url: null,
            activo: true,
          },
          {
            id: 2,
            nombre: "Licencia de Construcción Vivienda",
            descripcion: "Permiso para construcción de vivienda unifamiliar hasta 200 m²",
            requisitos:
              "Planos arquitectónicos firmados por arquitecto\nPlanos estructurales firmados por ingeniero\nEstudio de suelos\nCédula del propietario",
            costo: 250000,
            tiempo_estimado: "20 días hábiles",
            categoria: "Licencias",
            documento_url: "https://tibirita.gov.co/formularios/licencia-construccion.pdf",
            activo: true,
          },
          {
            id: 3,
            nombre: "Pago de Impuesto Predial",
            descripcion: "Liquidación y pago del impuesto predial anual",
            requisitos: "Cédula del propietario\nCertificado de libertad y tradición\nAutoavalúo catastral actualizado",
            costo: 0,
            tiempo_estimado: "Inmediato",
            categoria: "Otros",
            documento_url: "https://tibirita.gov.co/formularios/pago-predial.pdf",
            activo: true,
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching tramites:", error)

      // Usar datos simulados como fallback
      setTramites([
        {
          id: 1,
          nombre: "Certificado de Residencia",
          descripcion: "Certificado que acredita la residencia actual en el municipio de Tibirita",
          requisitos:
            "Cédula de ciudadanía original y copia\nRecibo de servicios públicos no mayor a 3 meses\nFormulario de solicitud diligenciado",
          costo: 8000,
          tiempo_estimado: "1 día hábil",
          categoria: "Certificados",
          documento_url: null,
          activo: true,
        },
        {
          id: 2,
          nombre: "Licencia de Construcción Vivienda",
          descripcion: "Permiso para construcción de vivienda unifamiliar hasta 200 m²",
          requisitos:
            "Planos arquitectónicos firmados por arquitecto\nPlanos estructurales firmados por ingeniero\nEstudio de suelos\nCédula del propietario",
          costo: 250000,
          tiempo_estimado: "20 días hábiles",
          categoria: "Licencias",
          documento_url: "https://tibirita.gov.co/formularios/licencia-construccion.pdf",
          activo: true,
        },
        {
          id: 3,
          nombre: "Pago de Impuesto Predial",
          descripcion: "Liquidación y pago del impuesto predial anual",
          requisitos: "Cédula del propietario\nCertificado de libertad y tradición\nAutoavalúo catastral actualizado",
          costo: 0,
          tiempo_estimado: "Inmediato",
          categoria: "Otros",
          documento_url: "https://tibirita.gov.co/formularios/pago-predial.pdf",
          activo: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredTramites = tramites.filter((tramite) => {
    const matchesSearch =
      tramite.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tramite.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "" || selectedCategory === "all" || tramite.categoria === selectedCategory
    return matchesSearch && matchesCategory && tramite.activo
  })

  const getCategoryColor = (categoria: string) => {
    const colors = {
      Licencias: "bg-blue-500",
      Certificados: "bg-green-500",
      Permisos: "bg-orange-500",
      "Paz y Salvos": "bg-purple-500",
      Otros: "bg-gray-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleIniciarTramite = (tramite: Tramite) => {
    setSelectedTramite(tramite)
    setShowIniciarModal(true)
    setSubmitSuccess(false)
    setFormData({ nombre: "", email: "", telefono: "", observaciones: "" })
  }

  const handleMasInformacion = (tramite: Tramite) => {
    setSelectedTramite(tramite)
    setShowInfoModal(true)
  }

  const handleSubmitTramite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTramite) return

    setIsSubmitting(true)
    try {
      // Generar número de radicado
      const numeroRadicado = `TIB-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Simular envío (aquí podrías conectar a una API real)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setRadicado(numeroRadicado)
      setSubmitSuccess(true)

      // Limpiar formulario
      setFormData({ nombre: "", email: "", telefono: "", observaciones: "" })
    } catch (error) {
      console.error("Error al enviar trámite:", error)
      alert("Error al enviar el trámite. Por favor intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModals = () => {
    setShowInfoModal(false)
    setShowIniciarModal(false)
    setSelectedTramite(null)
    setSubmitSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Trámites Municipales</h1>
          <p className="text-xl">Realiza tus trámites de forma rápida y segura</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Información General */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">📋 Información Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Horarios de Atención</h4>
                <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-600">Sábados: 8:00 AM - 12:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Documentos Requeridos</h4>
                <p className="text-gray-600">• Cédula de ciudadanía</p>
                <p className="text-gray-600">• Formulario diligenciado</p>
                <p className="text-gray-600">• Documentos específicos del trámite</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Formas de Pago</h4>
                <p className="text-gray-600">• Efectivo</p>
                <p className="text-gray-600">• Transferencia bancaria</p>
                <p className="text-gray-600">• PSE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Trámites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar por nombre o descripción</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar trámites..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por categoría</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Trámites */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando trámites...</p>
            </div>
          ) : filteredTramites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No se encontraron trámites</p>
            </div>
          ) : (
            filteredTramites.map((tramite) => (
              <Card key={tramite.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{tramite.nombre}</h3>
                        <Badge className={`${getCategoryColor(tramite.categoria)} text-white`}>
                          {tramite.categoria}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{tramite.descripcion}</p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                          <span>
                            <strong>Costo:</strong> {tramite.costo === 0 ? "Gratuito" : formatCurrency(tramite.costo)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span>
                            <strong>Tiempo:</strong> {tramite.tiempo_estimado}
                          </span>
                        </div>
                        {tramite.documento_url && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2 text-purple-500" />
                            <a
                              href={tramite.documento_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Descargar Formulario
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Requisitos:</h4>
                        <div className="text-gray-700 text-sm">
                          {tramite.requisitos.split("\n").map((req, index) => (
                            <p key={index} className="mb-1">
                              • {req}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleIniciarTramite(tramite)}
                        >
                          Iniciar Trámite
                        </Button>
                        <Button variant="outline" onClick={() => handleMasInformacion(tramite)}>
                          Más Información
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal Más Información */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {selectedTramite?.nombre}
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedTramite && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Descripción</h4>
                <p className="text-gray-700">{selectedTramite.descripcion}</p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Requisitos Detallados</h4>
                <div className="space-y-2">
                  {selectedTramite.requisitos.split("\n").map((req, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Información del Trámite</h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Costo:</strong>{" "}
                      {selectedTramite.costo === 0 ? "Gratuito" : formatCurrency(selectedTramite.costo)}
                    </p>
                    <p>
                      <strong>Tiempo estimado:</strong> {selectedTramite.tiempo_estimado}
                    </p>
                    <p>
                      <strong>Categoría:</strong> {selectedTramite.categoria}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Información de Contacto</h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Dirección:</strong> Carrera 3 # 3-45, Centro
                    </p>
                    <p>
                      <strong>Teléfono:</strong> (601) 123-4567
                    </p>
                    <p>
                      <strong>Email:</strong> alcaldia@tibirita.gov.co
                    </p>
                    <p>
                      <strong>Horarios:</strong> Lunes a Viernes 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {selectedTramite.documento_url && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Documentos</h4>
                  <a
                    href={selectedTramite.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Descargar Formulario</span>
                  </a>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendaciones</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Verifique que todos los documentos estén vigentes</li>
                  <li>• Traiga copias adicionales de los documentos</li>
                  <li>• Llegue con tiempo suficiente antes del cierre</li>
                  <li>• Para consultas, puede llamar antes de su visita</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Iniciar Trámite */}
      <Dialog open={showIniciarModal} onOpenChange={setShowIniciarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {submitSuccess ? "¡Trámite Iniciado!" : "Iniciar Trámite"}
              <Button variant="ghost" size="sm" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {submitSuccess ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Trámite Iniciado Exitosamente</h3>
                <p className="text-gray-600 mb-4">Su solicitud ha sido recibida y procesada</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Número de Radicado:</strong>
                </p>
                <p className="text-lg font-mono font-bold text-green-900 bg-white p-2 rounded border">{radicado}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Próximos pasos:</strong>
                </p>
                <ul className="space-y-1">
                  <li>• Guarde el número de radicado para seguimiento</li>
                  <li>• Prepare los documentos requeridos</li>
                  <li>• Acérquese a la alcaldía en horarios de atención</li>
                  <li>• Presente el número de radicado en ventanilla</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Tiempo estimado:</strong> {selectedTramite?.tiempo_estimado}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Costo:</strong>{" "}
                  {selectedTramite?.costo === 0 ? "Gratuito" : formatCurrency(selectedTramite?.costo || 0)}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTramite} className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Trámite: {selectedTramite?.nombre}</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedTramite?.descripcion}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Ingrese su nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                    placeholder="Número de contacto"
                  />
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Información adicional (opcional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Al enviar este formulario, recibirá un número de radicado que debe
                  presentar en la alcaldía junto con los documentos requeridos.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
                <Button type="button" variant="outline" onClick={closeModals} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
