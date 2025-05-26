"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Star } from "lucide-react"

interface SitioTuristico {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  ubicacion: string
  horarios: string
  precio: string
  calificacion: number
  imagen: string
  destacado: boolean
}

export default function SitiosTuristicosPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRating, setSelectedRating] = useState("")

  const sitiosTuristicos: SitioTuristico[] = [
    {
      id: 1,
      nombre: "La Chorrera",
      descripcion:
        "Majestuosa cascada de 30 metros de altura, perfecta para el ecoturismo y la fotografía. Un lugar mágico rodeado de vegetación nativa donde podrás conectar con la naturaleza.",
      categoria: "Naturaleza",
      ubicacion: "Vereda Arrayanes",
      horarios: "8:00 AM - 5:00 PM",
      precio: "Entrada libre",
      calificacion: 5,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: true,
    },
    {
      id: 2,
      nombre: "Iglesia de San Antonio",
      descripcion:
        "Hermosa iglesia colonial del siglo XVII, patrimonio arquitectónico del municipio. Sus muros guardan siglos de historia y tradición religiosa.",
      categoria: "Patrimonio",
      ubicacion: "Centro del municipio",
      horarios: "6:00 AM - 6:00 PM",
      precio: "Entrada libre",
      calificacion: 4,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: true,
    },
    {
      id: 3,
      nombre: "Pictogramas Muiscas",
      descripcion:
        "Antiguos pictogramas dejados por la cultura Muisca, testimonio de la rica herencia precolombina de nuestro territorio.",
      categoria: "Arqueología",
      ubicacion: "Vereda Checua",
      horarios: "9:00 AM - 4:00 PM",
      precio: "$5,000 por persona",
      calificacion: 4,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: false,
    },
    {
      id: 4,
      nombre: "Paraíso Termal",
      descripcion:
        "Aguas termales naturales con propiedades medicinales, ideales para la relajación y el bienestar. Un oasis de tranquilidad en medio de la montaña.",
      categoria: "Bienestar",
      ubicacion: "Vereda El Hato",
      horarios: "8:00 AM - 8:00 PM",
      precio: "$15,000 por persona",
      calificacion: 5,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: true,
    },
    {
      id: 5,
      nombre: "Casa Museo",
      descripcion:
        "Museo que preserva la historia local y exhibe objetos tradicionales de la cultura campesina y muisca de la región.",
      categoria: "Cultura",
      ubicacion: "Centro del municipio",
      horarios: "9:00 AM - 5:00 PM",
      precio: "$3,000 por persona",
      calificacion: 4,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: false,
    },
    {
      id: 6,
      nombre: "Sendero Ecológico La Ramada",
      descripcion:
        "Sendero de 3 km que atraviesa bosque nativo, perfecto para caminatas ecológicas y avistamiento de aves.",
      categoria: "Naturaleza",
      ubicacion: "Vereda La Ramada",
      horarios: "7:00 AM - 5:00 PM",
      precio: "Entrada libre",
      calificacion: 4,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: false,
    },
    {
      id: 7,
      nombre: "Mirador del Valle",
      descripcion:
        "Punto panorámico con vista espectacular del valle de Tibirita y los municipios vecinos. Ideal para el amanecer y atardecer.",
      categoria: "Naturaleza",
      ubicacion: "Vereda Pueblo Viejo",
      horarios: "24 horas",
      precio: "Entrada libre",
      calificacion: 5,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: true,
    },
    {
      id: 8,
      nombre: "Centro Artesanal",
      descripcion:
        "Espacio donde los artesanos locales exhiben y venden sus productos tradicionales: tejidos, cerámicas y trabajos en madera.",
      categoria: "Cultura",
      ubicacion: "Centro del municipio",
      horarios: "8:00 AM - 6:00 PM",
      precio: "Entrada libre",
      calificacion: 3,
      imagen: "/placeholder.svg?height=300&width=400",
      destacado: false,
    },
  ]

  const categorias = ["Naturaleza", "Patrimonio", "Arqueología", "Bienestar", "Cultura"]

  const filteredSitios = sitiosTuristicos.filter((sitio) => {
    const matchesCategory = selectedCategory === "" || sitio.categoria === selectedCategory
    const matchesRating = selectedRating === "" || sitio.calificacion >= Number.parseInt(selectedRating)
    return matchesCategory && matchesRating
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getCategoryColor = (categoria: string) => {
    const colors = {
      Naturaleza: "bg-green-500",
      Patrimonio: "bg-blue-500",
      Arqueología: "bg-orange-500",
      Bienestar: "bg-purple-500",
      Cultura: "bg-red-500",
    }
    return colors[categoria as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sitios Turísticos de Tibirita</h1>
          <p className="text-xl">Descubre la belleza natural y cultural de nuestro municipio</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrar Sitios Turísticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Calificación mínima</label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquier calificación</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4+ estrellas</SelectItem>
                    <SelectItem value="3">3+ estrellas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resultados</label>
                <div className="flex items-center h-10 px-3 bg-gray-100 rounded-md">
                  <span className="text-sm text-gray-600">{filteredSitios.length} sitios encontrados</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destacados */}
        {selectedCategory === "" && selectedRating === "" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sitios Destacados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sitiosTuristicos
                .filter((sitio) => sitio.destacado)
                .map((sitio) => (
                  <Card key={sitio.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getCategoryColor(sitio.categoria)} text-white`}>{sitio.categoria}</Badge>
                        <div className="flex">{renderStars(sitio.calificacion)}</div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{sitio.nombre}</h3>
                      <p className="text-gray-600 text-sm">{sitio.descripcion.substring(0, 100)}...</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Sites */}
        <div className="grid gap-6">
          {filteredSitios.map((sitio) => (
            <Card key={sitio.id} className="hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-64 md:h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-l-lg"></div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-2xl font-semibold text-gray-800">{sitio.nombre}</h3>
                        <Badge className={`${getCategoryColor(sitio.categoria)} text-white`}>{sitio.categoria}</Badge>
                        {sitio.destacado && <Badge className="bg-yellow-500">Destacado</Badge>}
                      </div>
                      <div className="flex items-center mb-3">
                        {renderStars(sitio.calificacion)}
                        <span className="ml-2 text-sm text-gray-600">({sitio.calificacion}/5)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{sitio.descripcion}</p>

                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span>{sitio.ubicacion}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{sitio.horarios}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-green-500">💰</span>
                      <span>{sitio.precio}</span>
                    </div>
                  </div>

                  <Button className="bg-green-600 hover:bg-green-700">Ver en el Mapa</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSitios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron sitios turísticos con los filtros seleccionados</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedRating("any")
              }}
              className="mt-4"
              variant="outline"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
