#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera la lista de prospeccion de negocios de Malinalco para enmalinalco.com."""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.utils import get_column_letter

# Paleta de marca enmalinalco
SELVA = "1C3B28"
VERDE = "3A6B47"
ORO = "C59B1C"
TERRA = "BF5028"
PARCH = "F3EEE4"
INK = "1B1409"

# Columnas:
# Negocio | Categoria | Prioridad | Canal recomendado | Instagram | Seguidores (aprox) |
# Facebook | Email | Telefono/WhatsApp | Por que es buen prospecto | Estatus | Notas
COLS = ["Negocio", "Categoria", "Prioridad", "Canal recomendado", "Instagram",
        "Seguidores aprox.", "Facebook", "Email", "Tel / WhatsApp",
        "Por que es buen prospecto", "Estatus", "Notas"]

# Prioridad A = cuenta activa con buen alcance + encaja perfecto con el directorio
# Prioridad B = contacto real (email/tel), encaja bien, verificar actividad en redes
# Prioridad C = prospecto valido pero secundario / datos de directorio viejo
leads = [
    # ---------- PRIORIDAD A: cuentas activas, alto alcance, canal = DM Instagram ----------
    ["Hostal Tribu", "Hospedaje", "A", "DM Instagram", "@tribu_malinalco", "7,087",
     "", "", "", "El hospedaje con mas alcance en IG del pueblo; publico joven viajero que ya busca Malinalco.", "Por contactar", "Verificar seguidores en vivo"],
    ["La Casa de Valentina", "Restaurantes", "A", "DM Instagram + Email", "@lacasadevalentina", "6,381",
     "", "turuturu89@hotmail.com", "554 075 5459", "Restaurante destino con la mayor comunidad en IG; vive del turista de fin de semana.", "Por contactar", "Email de directorio (verificar)"],
    ["Rancho Seco Malinalco", "Hospedaje", "A", "DM Instagram", "@ranchoseco_malinalco", "4,920",
     "", "", "", "Finca de hospedaje/eventos con gran alcance; perfil ideal para plan Cuauhtli/Ocelotl.", "Por contactar", ""],
    ["Restaurante Casa Colibri", "Restaurantes", "A", "DM Instagram + FB", "@restaurantecasacolibri", "3,052",
     "facebook.com/RestauranteCasaColibri", "", "", "Trucha y vista al pueblo, 4.9 en resenas; marca consolidada que quiere mas reservas directas.", "Por contactar", ""],
    ["Casa Pixan (Hotel Boutique)", "Hospedaje", "A", "DM Instagram + Email + FB", "@casapixan", "2,453",
     "facebook.com/casapixanmali", "casapixan@gmail.com", "729 154 9615", "Hotel boutique con spa; dueno de restaurante Los Placeres. Doble ficha posible.", "Por contactar", "Tambien casapixan@grupokalimori.org"],
    ["Pancho Villa Malinalco", "Restaurantes", "A", "DM Instagram", "@panchovilla_malinalco", "2,344",
     "", "", "", "Restaurante-bar muy visible; en los blogs de 'donde comer en Malinalco'.", "Por contactar", ""],
    ["Hotel Amate del Rio", "Hospedaje", "A", "DM Instagram", "@amatedelrio_malinalco", "2,224",
     "", "", "", "Hotel con restaurante que ya publica promociones en IG; entiende el valor de anunciarse.", "Por contactar", ""],
    ["Los Placeres (Casa Pixan)", "Restaurantes", "A", "DM Instagram", "@losplaceres.malinalco", "1,273",
     "", "", "", "Restaurante-bar en una de las casas mas antiguas del centro; alto ticket.", "Por contactar", "Mismo grupo que Casa Pixan"],
    ["Hotel MarMil", "Hospedaje", "A", "DM Instagram + Email", "@hotelmarmil", "1,027",
     "", "hotel_marmil@hotmail.com", "714 147 0344", "Hotel con temazcal/spa; perfil establecido. Encaja en Belleza y Bienestar + Hospedaje.", "Por contactar", ""],
    ["Casa Alamillo (Hotel Boutique & Spa)", "Hospedaje", "A", "Email + DM + FB", "@casaalamillo", "806",
     "facebook.com/casaalamillo", "info@casaalamillo.com", "722 335 8081", "El boutique mas premium del pueblo; sitio web propio, presupuesto para marketing. Perfil Ocelotl.", "Por contactar", "Vecino de Maiz Criollo"],
    ["Hotel y Restaurante Casa Limon", "Hospedaje", "A", "DM Instagram + Web", "@casalimonmalinalco", "594",
     "", "", "", "Hotel boutique + cocina francesa; sitio casalimon.com. Doble categoria.", "Por contactar", ""],
    ["Hotel Ixcal Malinalco", "Hospedaje", "A", "DM Instagram + Email", "@ixcalmalinalco", "287",
     "", "", "714 147 2431", "Hotel con temazcal; cuenta activa aunque pequena, facil de convencer con alcance extra.", "Por contactar", ""],

    # ---------- PRIORIDAD B: contacto real, buen encaje, verificar redes ----------
    ["Paradise Hotel Boutique & Lounge", "Hospedaje", "B", "Email + DM + FB", "@paradise.malinalco", "",
     "facebook.com/paradise.malinalco", "info@paradisemalinalco.com", "714 147 0421", "Hotel boutique con IG propia; contacto directo verificado.", "Por contactar", ""],
    ["Hotel Casa Richer", "Hospedaje", "B", "Email + Web", "", "",
     "", "info@casaricher.com", "714 147 0127", "Hotel con sitio propio (casaricher.com) y contenido de balnearios; invierte en web.", "Por contactar", ""],
    ["Hotel Pomarrosa", "Hospedaje", "B", "Email + Web", "", "",
     "", "info@hotelpomarrosa.com", "714 147 2238", "Hotel con sitio propio; contacto corporativo, buen candidato a plan medio.", "Por contactar", ""],
    ["Hotel Casa de Campo", "Hospedaje", "B", "Email", "", "",
     "", "casadecampomalinalco@gmail.com", "714 147 2128", "Hotel establecido con correo de Gmail (mas confiable que hotmail viejo).", "Por contactar", ""],
    ["Hotel Casa D'Lobo", "Hospedaje", "B", "Email", "", "",
     "", "contacto@casadelobo.com.mx", "714 147 2053", "Boutique con jardin y bar, 9.2 en Booking; dominio propio.", "Por contactar", ""],
    ["Hotel Las Cupulas", "Hospedaje", "B", "Email", "", "",
     "", "angelica.teran@lascupulas.com.mx", "714 147 0644", "Correo con nombre de contacto real; facilita el seguimiento.", "Por contactar", ""],
    ["Hotel Canto de Aves", "Hospedaje", "B", "Email", "", "",
     "", "cantodeaves@hotmail.com", "714 147 2472", "Hotel listado en Booking; verificar actividad.", "Por contactar", "Email de directorio (verificar)"],
    ["Hotel Tepehuakan", "Hospedaje", "B", "Email", "", "",
     "", "hotel_tepehuakan@hotmail.com", "714 147 0242", "Hospedaje del centro; contacto disponible.", "Por contactar", "Email de directorio (verificar)"],
    ["Hotel Villas Malinalco", "Hospedaje", "B", "Email", "", "",
     "", "hoteljardinvm@hotmail.com", "714 147 1425", "Hotel con jardin; contacto disponible.", "Por contactar", "Email de directorio (verificar)"],
    ["Cabanas Don Diego", "Hospedaje", "B", "Email", "", "",
     "", "hotel_dondiego@hotmail.com", "714 147 2296", "Cabanas familiares; buen encaje plan Malinalli.", "Por contactar", "Email de directorio (verificar)"],
    ["Malifiesta (Restaurante)", "Restaurantes", "B", "Email + Web", "", "",
     "", "info@malifiesta.com", "714 147 1201", "Restaurante con sitio propio (malifiesta.com); invierte en presencia online.", "Por contactar", ""],
    ["Casa Vieja", "Restaurantes", "B", "Email", "", "",
     "", "lacasa_vieja@outlook.com", "722 160 9147", "Restaurante tradicional del centro.", "Por contactar", "Tambien aromeroj_05@hotmail.com"],
    ["Civarys (trucha y mojarra)", "Restaurantes", "B", "Email", "", "",
     "", "vjperez1@hotmail.com", "714 147 0936", "Especialista en trucha, gancho gastronomico de Malinalco.", "Por contactar", "Email de directorio (verificar)"],
    ["El Pecado", "Restaurantes", "B", "Email + FB", "", "",
     "facebook.com/El-Pecado", "elpecador.01@hotmail.com", "714 147 0157", "Restaurante con FB propio.", "Por contactar", ""],
    ["Restaurant La Cascada", "Restaurantes", "B", "Email", "", "",
     "", "viento_ehecatl@hotmail.com", "553 025 8190", "Restaurante con entorno natural.", "Por contactar", "Email de directorio (verificar)"],
    ["Carajillo Bistro Cafe", "Restaurantes", "B", "Email", "", "",
     "", "mauri_zarco@yahoo.com.mx", "714 147 1920", "Cafe-bistro del centro; publico de cafe de especialidad.", "Por contactar", "Email de directorio (verificar)"],
    ["La Galeria Arte + Cafe", "Cultura", "B", "Email", "", "",
     "", "elrefugioartecafe2010@hotmail.com", "714 147 2279", "Cafe + galeria en Plaza Principal; cruza Restaurantes y Cultura.", "Por contactar", "IG @galeartecafe (verificar)"],
    ["Yasashi Sushi (a domicilio)", "Restaurantes", "B", "WhatsApp + FB", "", "",
     "facebook.com/yasashisushi", "", "722 889 4347", "Sushi a domicilio; el delivery necesita visibilidad local.", "Por contactar", ""],
    ["Galeria Andres Medina", "Cultura", "B", "Email + FB", "", "",
     "Galeria Estudio Andres Medina", "andresmedina.art@gmail.com", "714 147 0905", "Galeria de artista local; encaja en Cultura/artesanias.", "Por contactar", "Tambien artemedina_06@hotmail.com"],
    ["Museo Vivo Los Bichos", "Cultura", "B", "Email", "", "",
     "", "losbichosdemalinalco@prodigy.net.mx", "714 147 2242", "Atraccion familiar destacada en la portada del sitio; alto interes turistico.", "Por contactar", ""],
    ["Ollinyotl Centro Holistico", "Belleza y Bienestar", "B", "Email + Web", "", "",
     "", "ollinyotl.malinalco@gmail.com", "714 147 2015", "Temazcal, spa y retiros; sitio ollinyotl.com.mx. Perfil wellness fuerte.", "Por contactar", ""],
    ["Malibiker MTB", "Ecoturismo", "B", "Email + FB", "", "",
     "facebook.com/malibiker.mtb", "jaimecoatzin@gmail.com", "55 4895 0105", "Ciclismo de montana; actividad estrella de ecoturismo.", "Por contactar", ""],
    ["Vigias de Malinalco", "Ecoturismo", "B", "Email + FB", "", "",
     "facebook.com/vigias.d.malinalco", "vigiasdelpatrimonio.malinalco@gmail.com", "722 105 6612", "Recorridos de patrimonio; aliado natural del directorio cultural.", "Por contactar", ""],
    ["El Solar Malinalco Club", "Ecoturismo", "B", "Email", "", "",
     "", "escueladenatacionmalinalco@gmail.com", "722 364 3054", "Club con alberca/natacion; cruza Balnearios y Ecoturismo.", "Por contactar", ""],
    ["Malinalco Bienes Raices", "Servicios", "B", "Email + Web", "", "",
     "", "info@malinalcobienesraices.com", "714 147 0310", "Inmobiliaria con presupuesto de marketing; compra visibilidad de forasteros.", "Por contactar", ""],

    # ---------- PRIORIDAD C: prospectos validos, buscar handle o datos de directorio viejo ----------
    ["Casa Diablitos (Mixologia)", "Restaurantes", "C", "Buscar IG / DM", "", "",
     "", "", "", "Cocteleria de moda (93/100 en resenas); publico nocturno. Buscar su IG.", "Por investigar", "Vicente Guerrero 8"],
    ["Los Caudillos", "Restaurantes", "C", "Buscar IG / DM", "", "",
     "", "", "", "Cocina malinalquense, 4.5 con 94 resenas. Buscar su IG.", "Por investigar", ""],
    ["El Pochote", "Restaurantes", "C", "Buscar IG / DM", "", "",
     "", "", "", "Pizza/hamburguesas casual; buen volumen. Buscar su IG.", "Por investigar", "Av. Juarez, Sta. Maria"],
    ["Terraza Xolo", "Restaurantes", "C", "Buscar IG / DM", "", "",
     "", "", "", "Tacos y micheladas con vista; buscar contacto.", "Por investigar", ""],
    ["Maiz Criollo", "Restaurantes", "C", "Buscar IG / DM", "", "",
     "", "", "", "Alta cocina mexicana de autor junto a Casa Alamillo; alto ticket. Buscar contacto.", "Por investigar", ""],
    ["Balneario El Molino", "Balnearios", "C", "Buscar IG / Tel", "", "",
     "", "", "", "Criadero de trucha + balneario; atractivo familiar. Buscar su perfil.", "Por investigar", "Camino a Las Truchas, La Soledad"],
    ["Paraje Real / Sanctuary Spa", "Belleza y Bienestar", "C", "Web + Buscar IG", "", "",
     "", "", "", "Hotel con spa y temazcal (parajerealmalinalco.com), 4.9 en resenas.", "Por investigar", ""],
    ["Galeria Artesanal de Malinalco", "Cultura", "C", "FB / DM", "", "",
     "facebook.com/.../61556321870803", "", "", "Tienda de arte de artistas locales; encaja en Cultura/artesanias.", "Por investigar", ""],
    ["Galeria Rene Martin", "Cultura", "C", "Visita / Tel", "", "",
     "", "", "", "Taller familiar 30+ anos (madera, barro, rebozos) en Barrio Santa Maria.", "Por investigar", ""],
    ["Hotel Marmil - ver Prioridad A", "Hospedaje", "C", "", "", "", "", "", "", "", "Duplicado de referencia"],
    ["Arc-en-Ciel Sanacion Holistica", "Belleza y Bienestar", "C", "Email", "", "",
     "", "arcenciel.malinalco@gmail.com", "722 531 5823", "Sanacion holistica; nicho wellness en crecimiento.", "Por investigar", ""],
    ["Yolitia / Botiquin del Campo", "Belleza y Bienestar", "C", "Email + Web", "", "",
     "", "info@yolitia.org", "714 147 2338", "Productos y cabanas de bienestar (botiquindelcampo.com).", "Por investigar", ""],
    ["Keller Asesorias (Inmobiliaria)", "Servicios", "C", "Email", "", "",
     "", "kellerasociados@gmail.com", "714 147 0028", "Inmobiliaria local; prospecto de servicios con presupuesto.", "Por investigar", ""],
]

# quitar la fila duplicada de referencia
leads = [r for r in leads if not r[0].startswith("Hotel Marmil - ver")]

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Prospectos Malinalco"

# --- Titulo ---
ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(COLS))
t = ws.cell(row=1, column=1, value="Prospeccion de negocios  ·  enmalinalco.com")
t.font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
t.fill = PatternFill("solid", fgColor=SELVA)
t.alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws.row_dimensions[1].height = 34

ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=len(COLS))
s = ws.cell(row=2, column=1, value="Lista para invitar al Programa Fundadores  ·  Prioridad A = DM Instagram primero  ·  Seguidores y emails son referencia: VERIFICAR antes de enviar")
s.font = Font(name="Calibri", size=10, italic=True, color=INK)
s.fill = PatternFill("solid", fgColor=PARCH)
s.alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws.row_dimensions[2].height = 22

# --- Header ---
HEADER_ROW = 3
thin = Side(style="thin", color="D8CFBE")
for j, name in enumerate(COLS, start=1):
    c = ws.cell(row=HEADER_ROW, column=j, value=name)
    c.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor=VERDE)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
    c.border = Border(left=thin, right=thin, top=thin, bottom=thin)
ws.row_dimensions[HEADER_ROW].height = 30

# --- Data ---
prio_fill = {
    "A": PatternFill("solid", fgColor="E7F0E9"),  # verde claro
    "B": PatternFill("solid", fgColor="FBF3DE"),  # oro claro
    "C": PatternFill("solid", fgColor="F3EEE4"),  # pergamino
}
prio_font = {
    "A": Font(bold=True, color=SELVA),
    "B": Font(bold=True, color="8A6D10"),
    "C": Font(bold=True, color="7A6A50"),
}
r = HEADER_ROW + 1
for row in leads:
    prio = row[2]
    for j, val in enumerate(row, start=1):
        c = ws.cell(row=r, column=j, value=val)
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
        c.border = Border(left=thin, right=thin, top=thin, bottom=thin)
        c.font = Font(name="Calibri", size=10, color=INK)
        if prio in prio_fill:
            c.fill = prio_fill[prio]
        if j == 3 and prio in prio_font:  # columna Prioridad
            c.font = prio_font[prio]
            c.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[r].height = 30
    r += 1

last_row = r - 1

# --- Anchos de columna ---
widths = [30, 18, 9, 22, 24, 13, 30, 30, 16, 46, 14, 30]
for j, w in enumerate(widths, start=1):
    ws.column_dimensions[get_column_letter(j)].width = w

# --- AutoFilter + congelar ---
ws.auto_filter.ref = f"A{HEADER_ROW}:{get_column_letter(len(COLS))}{last_row}"
ws.freeze_panes = f"A{HEADER_ROW+1}"

# --- Hoja 2: guia de uso / leyenda ---
ws2 = wb.create_sheet("Como usar")
guide = [
    ("Como usar esta lista", True),
    ("", False),
    ("1. Empieza por Prioridad A (verde): son cuentas activas con mayor alcance en Instagram.", False),
    ("   El mejor canal para estas es el DM de Instagram, no el correo.", False),
    ("2. Prioridad B (oro): tienen contacto real (email/tel). Varios correos vienen de un", False),
    ("   directorio antiguo (hotmail/yahoo/prodigy): verifica que sigan vigentes antes de enviar.", False),
    ("3. Prioridad C (pergamino): prospectos validos a los que falta encontrar su handle o telefono.", False),
    ("", False),
    ("Seguidores aprox.: son capturas del buscador sin fecha. Abre el perfil y confirma el numero", False),
    ("real antes de decidir el orden de ataque. No los tomes como exactos.", False),
    ("", False),
    ("Flujo sugerido de contacto:", True),
    ("  - Instagram/Facebook: DM personalizado + el banner cuadrado (1080x1080).", False),
    ("  - Email: asunto corto + banner horizontal + link directo a enmalinalco.com/registro.", False),
    ("  - Siempre menciona algo real de SU negocio (su trucha, su vista, su temazcal).", False),
    ("  - No envies el mismo texto en masa: personaliza 1 linea por negocio.", False),
    ("", False),
    ("Gancho principal: Programa Fundadores - 50 cupos, 30% de descuento 3 meses, sin permanencia.", True),
    ("", False),
    ("Estatus sugeridos: Por contactar / Enviado / Respondio / En negociacion / Cerrado / No.", False),
]
for i, (txt, bold) in enumerate(guide, start=1):
    c = ws2.cell(row=i, column=1, value=txt)
    c.font = Font(name="Calibri", size=12 if (bold and i == 1) else 11, bold=bold,
                  color=SELVA if bold else INK)
ws2.column_dimensions["A"].width = 100

import os
out = os.path.join(os.path.dirname(__file__), "Prospeccion_Malinalco_enmalinalco.xlsx")
wb.save(out)
print("Guardado:", out)
print("Total de prospectos:", len(leads))
