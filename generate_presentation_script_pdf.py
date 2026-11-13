import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

PDF_FILENAME = "Coastal_Erosion_Project_Presentation_Script.pdf"

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page count,
    running header, and running footer.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Suppress running header/footer on cover/title page
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#475569"))
            self.drawString(40, 792 - 30, "Coastal AI: Comprehensive Presentation Script & Viva Defense Manual")
            self.drawRightString(612 - 40, 792 - 30, "Udupi Coastline Project | SMVITM CSE")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 792 - 34, 612 - 40, 792 - 34)

            # Footer
            self.setFont("Helvetica", 8)
            self.drawString(40, 25, "Major Project Phase 4 | Group 21 | Department of Computer Science & Engineering")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(612 - 40, 25, page_text)
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 35, 612 - 40, 35)
        self.restoreState()

def build_pdf():
    pdf_path = os.path.join(os.getcwd(), PDF_FILENAME)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    primary_navy = colors.HexColor("#0f2b48")
    secondary_teal = colors.HexColor("#0d9488")
    accent_blue = colors.HexColor("#1d4ed8")
    dark_slate = colors.HexColor("#1e293b")
    body_charcoal = colors.HexColor("#334155")
    bg_light = colors.HexColor("#f8fafc")
    bg_callout = colors.HexColor("#f0fdf4")
    border_callout = colors.HexColor("#22c55e")
    bg_script = colors.HexColor("#f1f5f9")
    border_script = colors.HexColor("#0284c7")
    danger_red = colors.HexColor("#dc2626")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_navy,
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=secondary_teal,
        alignment=1,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=dark_slate,
        alignment=1
    )

    h1_style = ParagraphStyle(
        'ChapterH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_navy,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=accent_blue,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'SubSectionH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=dark_slate,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=body_charcoal,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'CustomBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=body_charcoal,
        leftIndent=12,
        spaceAfter=3
    )

    script_box_style = ParagraphStyle(
        'ScriptBoxText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#0f172a")
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#14532d")
    )

    tip_text = ParagraphStyle(
        'TipText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#b45309")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=dark_slate
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold'
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=table_cell_style,
        alignment=1
    )

    caption_style = ParagraphStyle(
        'CaptionStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#64748b"),
        alignment=1,
        spaceAfter=6
    )

    story = []

    # Helper function for Section Dividers
    def make_divider():
        return HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0"), spaceBefore=8, spaceAfter=8)

    # Helper function for Slide / Speaking Script Box
    def make_speech_box(slide_num, title, visual_desc, what_to_say, key_points, tip):
        box_data = [
            [Paragraph(f"<b>SLIDE {slide_num}: {title.upper()}</b>", ParagraphStyle('SH', fontName='Helvetica-Bold', fontSize=10, textColor=primary_navy))],
            [Paragraph(f"<b>Visual on Screen:</b> {visual_desc}", ParagraphStyle('SV', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor("#475569")))],
            [Paragraph(f"<b>What to Say Aloud (Word-for-Word Script):</b><br/>{what_to_say}", script_box_style)],
            [Paragraph(f"<b>Key Takeaways:</b> {key_points}", bullet_style)],
            [Paragraph(f"<b>Presenter Tip:</b> {tip}", tip_text)]
        ]
        t = Table(box_data, colWidths=[532])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_script),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ('LINELEFT', (0, 0), (0, -1), 3.5, border_script),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        return t

    # Helper function for Callout Box
    def make_callout(title, text):
        box_data = [
            [Paragraph(f"<b>{title}</b>", ParagraphStyle('CT', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#166534")))],
            [Paragraph(text, callout_text)]
        ]
        t = Table(box_data, colWidths=[532])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_callout),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#86efac")),
            ('LINELEFT', (0, 0), (0, -1), 3.5, border_callout),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        return t

    # Helper function for Q&amp;A Box
    def make_qa_box(q_num, question, answer, practical_tip=""):
        content = [
            Paragraph(f"<b>Q{q_num}: {question}</b>", ParagraphStyle('QH', fontName='Helvetica-Bold', fontSize=9, textColor=accent_blue)),
            Spacer(1, 3),
            Paragraph(f"<b>Answer:</b> {answer}", body_style)
        ]
        if practical_tip:
            content.append(Spacer(1, 2))
            content.append(Paragraph(f"<i>Examiner Insight / Quick Tip:</i> {practical_tip}", tip_text))

        t = Table([[content]], colWidths=[532])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('LINELEFT', (0, 0), (0, -1), 3.0, accent_blue),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 9),
            ('RIGHTPADDING', (0, 0), (-1, -1), 9),
        ]))
        return t

    # Helper to insert image if exists
    def safe_image(path, target_width=500, caption=""):
        elements = []
        if os.path.exists(path):
            try:
                from PIL import Image as PILImage
                with PILImage.open(path) as img:
                    w, h = img.size
                    aspect = h / float(w)
                    target_height = target_width * aspect
                    if target_height > 260: # Limit height
                        target_height = 260
                        target_width = target_height / aspect
                    elements.append(Image(path, width=target_width, height=target_height))
                    if caption:
                        elements.append(Paragraph(caption, caption_style))
            except Exception as e:
                pass
        return elements

    # ==================== COVER &amp; HEADER BANNER ====================
    story.append(Spacer(1, 10))
    story.append(Paragraph("COASTAL EROSION DETECTION, ANALYSIS, AND FORECASTING USING MACHINE LEARNING AND REMOTE SENSING", title_style))
    story.append(Paragraph("Master Project Presentation Script, Technical Guide &amp; Viva Defense Manual<br/><i>Study Area: Udupi District Coastline, Karnataka, India (~100 km)</i>", subtitle_style))
    story.append(make_divider())

    meta_table_data = [
        [
            Paragraph("<b>Institution:</b> Shri Madhwa Vadiraja Institute of Technology &amp; Management (SMVITM), Bantakal", meta_style),
            Paragraph("<b>Department:</b> Computer Science and Engineering", meta_style)
        ],
        [
            Paragraph("<b>Academic Year:</b> 2026-2027 | <b>Group No:</b> 21 | <b>Semester:</b> VIII (Phase 4)", meta_style),
            Paragraph("<b>Live App:</b> <a href='https://major-project-coastal-ai.vercel.app/'><u>major-project-coastal-ai.vercel.app</u></a>", meta_style)
        ],
        [
            Paragraph("<b>Project Team:</b> Roshni (4MW23CS122), Maithri Shetty (4MW23CS063)", meta_style),
            Paragraph("<b>Co-Authors:</b> Raksha (4MW23CS111), Rashmi Salvankar (4MW23CS115)", meta_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[266, 266])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # ==================== CHAPTER 1: THE PROJECT AT A GLANCE ====================
    story.append(Paragraph("1. Executive Overview: The Project at a Glance", h1_style))
    story.append(Paragraph(
        "This document is designed to give you total mastery and 100% confidence over your final year engineering project. "
        "Whether you are presenting your slides to an external evaluator, answering tough questions during your viva voce, or explaining your work to peers, "
        "this guide explains <b>Why we did it</b>, <b>What we did</b>, and <b>How we did it</b> in crystal-clear, intuitive language.",
        body_style
    ))

    story.append(make_callout(
        "The 2-Minute Elevator Pitch (Memorize This!)",
        "<i>\"Our project tackles the severe coastal erosion threatening the 100-kilometer coastline of Udupi, Karnataka. "
        "Traditional shoreline surveys require expensive field crews and manual GPS tracing that cannot be repeated frequently, while standard optical satellite images fail during the monsoon due to heavy cloud cover and breaking surf. "
        "To solve this, we built an automated, end-to-end AI pipeline: First, we fused 7-band Sentinel-2 optical imagery with 2-channel Sentinel-1 Synthetic Aperture Radar (SAR), which penetrates clouds and sees through storms. "
        "We trained a DeepLabV3+ neural network that segments the land-water boundary with an 85.48% validation Dice coefficient. "
        "Second, we corrected for tidal displacement using localized beach slope physics and measured historical shoreline movement across 1,944 baseline transects spaced 50 meters apart. "
        "Third, we used XGBoost machine learning to prove that monsoon wave exposure is the primary environmental catalyst of coastal retreat, and we projected future shoreline boundaries up to 2029—discovering that 7.65 km of coast is under critical threat with 7.88 hectares of land loss expected. "
        "Finally, we deployed the entire system into an interactive, full-stack Web-GIS dashboard for government engineers and coastal planners.\"</i>"
    ))
    story.append(Spacer(1, 10))

    # The Three Pillars Table
    three_pillars_data = [
        [
            Paragraph("<b>WHY WE DID IT</b><br/>(The Problem &amp; Motivation)", table_header_style),
            Paragraph("<b>WHAT WE DID</b><br/>(The Core System Deliverables)", table_header_style),
            Paragraph("<b>HOW WE DID IT</b><br/>(The Engineering Workflow)", table_header_style)
        ],
        [
            Paragraph(
                "• Udupi coast faces extreme SW monsoon waves (>3m) causing severe land retreat.<br/>"
                "• Bengre sand spit &amp; fishing villages at imminent erosion risk.<br/>"
                "• Standard optical indices (NDWI) fail due to cloud cover, wet sand, and foam.<br/>"
                "• Tides shift water boundaries daily, creating fake erosion signals if uncorrected.",
                table_cell_style
            ),
            Paragraph(
                "• <b>9-Channel AI Model:</b> DeepLabV3+ with ResNet-34 encoder (Dice: <b>0.8548</b>).<br/>"
                "• <b>Physical Tide Normalization:</b> 1,944 transects analyzed at 50m spacing.<br/>"
                "• <b>XGBoost Risk Classifier:</b> Proved monsoon exposure drives 55%+ of erosion.<br/>"
                "• <b>2027-2029 Forecasts:</b> 7.65 km critical erosion, 7.88 ha land loss.<br/>"
                "• <b>Web-GIS Dashboard:</b> Live deployed decision support tool.",
                table_cell_style
            ),
            Paragraph(
                "• Downloaded Sentinel-1 (SAR) &amp; Sentinel-2 (Optical) imagery via GEE.<br/>"
                "• Sliding-window tiling (256x256, 50% overlap) into 9-channel tensors.<br/>"
                "• Trained with combined BCE + Dice loss on Adam optimizer.<br/>"
                "• OpenCV sub-pixel contour vectorization to EPSG:32643 shapefiles.<br/>"
                "• Physics-based beach slope tidal correction &amp; EPR calculation.<br/>"
                "• React 19 + Vite + Leaflet.js dashboard.",
                table_cell_style
            )
        ]
    ]
    t_pillars = Table(three_pillars_data, colWidths=[177, 177, 178])
    t_pillars.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_navy),
        ('BACKGROUND', (0, 1), (-1, 1), bg_light),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_pillars)
    story.append(Spacer(1, 12))

    # ==================== ARCHITECTURE FLOWCHART IMAGE ====================
    dfd_path = os.path.join(os.getcwd(), "dfd_part1_ingestion_deeplabv3.png")
    if not os.path.exists(dfd_path):
        dfd_path = os.path.join(os.getcwd(), "complete_project_data_flow_diagram.png")
    for elem in safe_image(dfd_path, target_width=520, caption="Figure 1: Complete Data Flow Architecture — From Multi-Modal Satellite Ingestion to DeepLabV3+ Segmentation and Web-GIS Deployment"):
        story.append(elem)

    story.append(PageBreak())

    # ==================== CHAPTER 2: DEEP DIVE: WHY, WHAT, HOW ====================
    story.append(Paragraph("2. Deep Dive: Conceptual Foundation (Why, What, How)", h1_style))

    story.append(Paragraph("2.1 WHY WE DID IT (The Real-World Science &amp; Gaps)", h2_style))
    story.append(Paragraph(
        "<b>1. The Coastal Crisis in Udupi:</b> Udupi district in coastal Karnataka is bordered by the Western Ghats to the east and the Arabian Sea to the west. "
        "The coastline contains critical ecological and economic zones: major fishing harbors (Malpe), fragile estuarine sand spits (Bengre spit where the Swarna and Sita rivers meet the sea), and national highways running within meters of the surf. "
        "Every year between June and September, the South-West Monsoon hammers this coastline with waves exceeding 3 to 4 meters. Sediment is washed offshore during storm surges and carried along the coast via littoral drift. "
        "Over the past decade, several stretches have suffered permanent beach loss, threatening homes, coastal roads, and fishing livelihoods.",
        body_style
    ))
    story.append(Paragraph(
        "<b>2. Why Traditional Surveying Methods Fail:</b> Historically, government agencies mapped beaches using field theodolites, total stations, or walking with handheld GPS units. "
        "These methods suffer from fatal flaws: they cost tens of lakhs of rupees, take months to complete, cannot be safely deployed during monsoon storms, and capture only a handful of discrete points along a 100-km coastline.",
        body_style
    ))
    story.append(Paragraph(
        "<b>3. Why Simple Satellite Indices (NDWI/MNDWI) Fail:</b> Researchers often attempt to use optical satellite indices such as NDWI (Normalized Difference Water Index) = (Green - NIR) / (Green + NIR). "
        "While NDWI works on calm inland lakes, it completely breaks down on active oceanic coasts because:<br/>"
        "• <b>Monsoon Cloud Cover:</b> The most critical erosion happens during the monsoon, precisely when the sky is 100% covered by clouds, making optical satellites blind.<br/>"
        "• <b>White Surf and Foam:</b> Breaking waves produce bright white surf that reflects all optical bands equally, confusing thresholding algorithms into identifying water as land or clouds.<br/>"
        "• <b>Wet Intertidal Sand:</b> Sand soaked by receding waves absorbs near-infrared light just like water does, leading to false landward boundary shifts.<br/>"
        "• <b>Tidal Variations:</b> In Udupi, the tide fluctuates between 0.8m and 1.6m daily. On a gently sloping beach (3% slope), a 1-meter vertical tide shift displaces the visible waterline horizontally by over 33 meters! Without mathematical tidal normalization, standard satellite comparisons show 'fake erosion' that is nothing more than high tide.",
        body_style
    ))
    story.append(Paragraph(
        "<b>4. The Multi-Sensor Radar + Optical Solution:</b> To solve this, our project combines <b>Sentinel-2 Optical</b> imagery with <b>Sentinel-1 C-band Synthetic Aperture Radar (SAR)</b>. "
        "Radar sends active microwave pulses down to Earth. Smooth water surfaces act like mirrors, reflecting the radar beam away from the satellite into deep space (specular reflection), making water appear jet black (very low backscatter). "
        "Rough land surfaces scatter radar waves in all directions, sending energy back to the satellite (bright pixels). "
        "Most importantly, microwave radar waves pass effortlessly through clouds, rain, and fog, giving our system 24/7, all-weather vision!",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("2.2 WHAT WE DID (The Core System Deliverables)", h2_style))
    story.append(Paragraph(
        "Our project delivered an integrated 5-tier technical solution:",
        body_style
    ))
    deliverables_data = [
        [Paragraph("<b>Deliverable</b>", table_header_style), Paragraph("<b>Technical Specification &amp; Outcome</b>", table_header_style)],
        [
            Paragraph("<b>1. Multi-Modal Fusion DeepLabV3+</b>", table_cell_bold),
            Paragraph("Engineered a 9-channel input tensor (7 Sentinel-2 bands + 2 Sentinel-1 SAR polarizations). Trained a ResNet-34 backed DeepLabV3+ semantic segmentation model achieving a validation Dice Coefficient of <b>0.8548</b> and Loss of 0.4304.", table_cell_style)
        ],
        [
            Paragraph("<b>2. Vector Shoreline Extraction &amp; Tidal Correction</b>", table_cell_bold),
            Paragraph("Extracted continuous sub-pixel boundary contours using OpenCV, projected them to UTM Zone 43N (EPSG:32643), and normalized horizontal displacements using localized beach slope equations (slope tan β = 0.03).", table_cell_style)
        ],
        [
            Paragraph("<b>3. Historical Transect Rate Analysis (EPR)</b>", table_cell_bold),
            Paragraph("Cast <b>1,944 perpendicular transect lines</b> spaced at 50-meter intervals along the 100-km Udupi baseline to compute End Point Rates (EPR) between 2020 and 2024.", table_cell_style)
        ],
        [
            Paragraph("<b>4. Environmental ML Vulnerability Model</b>", table_cell_bold),
            Paragraph("Trained an <b>XGBoost Classifier</b> on spatial coordinates, significant wave height (Hs), tidal range, and monsoon exposure index (|cos θ|). Proved that monsoon storm exposure is the dominant physical catalyst for coastal retreat.", table_cell_style)
        ],
        [
            Paragraph("<b>5. Multi-Year Shoreline Forecasting (2027-2029)</b>", table_cell_bold),
            Paragraph("Projected future shoreline positions for 2027, 2028, and 2029. Quantified that <b>7.65 km of coastline faces severe erosion</b>, leading to a cumulative land loss of <b>7.88 hectares</b> by 2029.", table_cell_style)
        ],
        [
            Paragraph("<b>6. Full-Stack Web-GIS Decision Dashboard</b>", table_cell_bold),
            Paragraph("Developed an interactive, modern Web-GIS application (React 19, Leaflet.js, Vite) deployed on Vercel, featuring color-coded risk maps, clickable transects, live ML risk simulators, and downloadable GIS shapefiles.", table_cell_style)
        ]
    ]
    t_deliv = Table(deliverables_data, colWidths=[160, 372])
    t_deliv.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_navy),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_deliv)

    story.append(Spacer(1, 8))
    story.append(Paragraph("2.3 HOW WE DID IT (Granular Step-by-Step Pipeline)", h2_style))
    story.append(Paragraph(
        "The entire system is executed through 8 automated Python scripts that transform raw satellite imagery into actionable coastal intelligence:",
        body_style
    ))

    pipeline_steps = [
        ("Step 1: Satellite Data Acquisition &amp; Patch Tiling (`prepare_dataset.py`)",
         "We download Sentinel-2 multispectral imagery (B2-Blue, B3-Green, B4-Red, B5-RedEdge, B8-NIR, B11-SWIR1, B12-SWIR2) and Sentinel-1 SAR imagery (VV, VH backscatter in dB). "
         "Using a sliding window algorithm, we crop the massive 7600x11000 pixel GeoTIFFs into 256x256-pixel tiles with a <b>stride of 128 pixels (50% overlap)</b>. "
         "Why 50% overlap? Because coastlines are continuous curves; if a boundary falls right on the edge of a tile, a model without overlap fails. Overlap ensures every boundary is fully visible in at least two adjacent tiles, while doubling our training data. "
         "Optical values are normalized by dividing by 10,000; SAR decibel values (typically -30 to 0 dB) are normalized linearly: `Normalized_SAR = (dB + 30) / 30`. Clean arrays are saved as 9-channel `.npy` files."),

        ("Step 2: DeepLabV3+ Model Training (`train_deeplabv3.py`)",
         "We modify a DeepLabV3+ architecture with a <b>ResNet-34 encoder</b> backbone. Standard neural networks downsample images through pooling, which loses the fine 1-pixel details of a beach. "
         "ResNet-34 preserves boundary detail via residual skip connections. The Atrous Spatial Pyramid Pooling (ASPP) module uses dilated convolutions with rates of 6, 12, and 18 pixels spacing. "
         "This allows the network to capture vast ocean surfaces (wide receptive field) and narrow river mouths (tight receptive field) simultaneously without adding extra trainable parameters. "
         "We optimize using <b>Combined Binary Cross-Entropy + Dice Loss</b>: `Total_Loss = BCE + Dice_Loss`. BCE ensures smooth gradient flow across all pixels, while Dice Loss directly maximizes boundary contour overlap, eliminating the class imbalance between huge water surfaces and tiny shoreline edges. Trained using Adam optimizer (lr=0.0001, 80/20 train/val split)."),

        ("Step 3: Inference, Stitching &amp; Vector Shoreline Extraction (`run_inference.py`)",
         "We load the trained model weights (`best_deeplabv3_model.pth`) to segment 2024 satellite scenes. To avoid harsh grid seams, we use an <b>Overlap-Stitching Accumulator</b>: predictions from overlapping 256x256 patches are added into a full-scale probability grid and divided by the overlap count map. "
         "A threshold filter classifies pixels with probability > 0.5 as Water (1) and Land (0). "
         "We apply morphological opening (erosion then dilation) to remove isolated spray and sandbars, followed by morphological closing (dilation then erosion) to seal wave foam holes. "
         "OpenCV's `findContours` traces the continuous 0-to-1 boundary. Points are reprojected into UTM Zone 43N coordinates (`EPSG:32643`) and exported as GIS Shapefiles (`2024_Predicted_Shoreline_DeepLabV3.shp`)."),

        ("Step 4: Tidal Correction &amp; Historical EPR Rate Calculation (`run_calculation.py`)",
         "Tides displace the apparent waterline. We apply the beach slope equilibrium equation: "
         "<br/><b>&Delta;x = (H_tide - H_MSL) / tan &beta;</b><br/>"
         "Where tide height H_tide = 0.7m, Mean Sea Level H_MSL = 0.8m, and sandy beach slope tan &beta; = 0.03. "
         "The horizontal shift (&Delta;x) is applied along each of the <b>1,944 baseline transects</b> spaced 50m apart. "
         "We calculate the <b>End Point Rate (EPR)</b> over 4 years: `EPR = (Distance_2024 - Distance_2020) / 4.0 years`. Negative values denote landward retreat (erosion), while positive values denote seaward deposition (accretion)."),

        ("Step 5: Future Shoreline Forecasting (`forecast_shoreline.py`)",
         "Using each transect's historical EPR and baseline geometry, we project shoreline positions for 2027, 2028, and 2029: "
         "<br/><b>Distance_future = Distance_2024 + (EPR &times; &Delta;t)</b><br/>"
         "Points are interpolated along transect vectors and connected to form forecasted shoreline polylines exported as GIS shapefiles."),

        ("Step 6: Environmental ML Vulnerability Modeling (`env_ml_analysis.py`)",
         "We enrich each transect with marine physics: significant wave height (Hs: 1.2-1.8m open sea vs 0.3-0.7m sheltered estuary), tidal range (0.8-1.6m), and the <b>Monsoon Exposure Index = |cos(&theta;_transect)|</b>. "
         "Beaches facing 180&deg; directly face the incoming South-West monsoon storms. "
         "An <b>XGBoost Classifier</b> categorizes transects into erosion (< -2 m/yr), stable (-2 to +2 m/yr), and accretion (> +2 m/yr). "
         "Feature importance analysis confirms that spatial coordinates and monsoon exposure are the primary drivers of coastal retreat."),

        ("Step 7: Impact Quantification &amp; Movement Trends (`quantify_erosion.py`, `shoreline_movement_plot.py`)",
         "We calculate the total threatened coastline: `Coastline_km = (N_severe_transects &times; 50m) / 1000 = 7.65 km`. "
         "We compute cumulative land loss: `Land_Loss_ha = &Sigma;(-EPR &times; 50m &times; 5 years) / 10,000 = 7.88 hectares`. "
         "Comparative boxplots and trend distributions are generated across all years (2020-2029)."),

        ("Step 8: Interactive Web-GIS Decision Platform (`REACT PROJECT EXPO`)",
         "We built a high-performance React 19 + Leaflet.js dashboard. Coastal managers can click any of the 1,944 transects to inspect localized erosion rates, wave energy, and forecasted boundaries, or use an interactive risk simulator to model wave scenarios.")
    ]

    for title, desc in pipeline_steps:
        story.append(Paragraph(f"<b>{title}</b>", h3_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # ==================== CHAPTER 3: SLIDE-BY-SLIDE PRESENTATION SCRIPT ====================
    story.append(Paragraph("3. Complete Slide-by-Slide Presentation Speaking Script", h1_style))
    story.append(Paragraph(
        "Below is your exact word-by-word presentation script for a 15-slide final year project presentation. "
        "Each slide contains the exact phrases to say aloud, key points for quick memory recall, and presentation tips to impress examiners.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # SLIDE 1
    story.append(make_speech_box(
        slide_num=1,
        title="Title &amp; Project Overview",
        visual_desc="Project title, group number (21), team member names and USNs, department, institution logo, and live application URL.",
        what_to_say="\"Good morning respected evaluators, project coordinators, and faculty members. "
                    "Today, our team is proud to present our final year major project titled: 'Coastal Erosion Detection, Analysis, and Forecasting using Machine Learning and Remote Sensing'. "
                    "I am Roshni, presenting alongside my team members Maithri Shetty, Raksha, and Rashmi Salvankar under the Department of Computer Science and Engineering at SMVITM. "
                    "Our study focuses on the 100-kilometer coastline of Udupi district, Karnataka. "
                    "Over the next 15 minutes, we will demonstrate how we fused optical and radar satellite data with deep learning to build an automated, all-weather coastal monitoring and forecasting system.\"",
        key_points="Team intro, Project title, Study area (Udupi Coast, Karnataka), Problem focus (AI + Remote Sensing).",
        tip="Speak with calm confidence. Make eye contact with all panel members right from the start."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 2
    story.append(make_speech_box(
        slide_num=2,
        title="The Problem Statement &amp; Motivation",
        visual_desc="Photographs of coastal erosion at Bengre / Malpe beach, damaged seawalls, fallen coconut trees, and flooded coastal roads.",
        what_to_say="\"Why does this project matter? Coastal zones support over 40% of the world's population, and here in coastal Karnataka, the threat is immediate. "
                    "The Udupi coastline experiences intense wave activity during the South-West Monsoon every June to September, with storm waves exceeding 3 to 4 meters. "
                    "This causes massive longshore drift and sediment loss, washing away beaches, damaging roads, and directly threatening fishing communities like Bengre and Padubidri. "
                    "Traditional shoreline monitoring relies on manual theodolite surveys and GPS field walks. These are slow, cost tens of lakhs of rupees, cannot be conducted during stormy monsoons, and capture only isolated spots. "
                    "Our goal is to eliminate manual field surveys by creating an automated, cost-effective satellite AI pipeline that monitors the entire 100-km coast continuously.\"",
        key_points="Real-world urgency, Udupi monsoon wave impact, Failure of expensive manual surveys, Automated AI solution.",
        tip="Emphasize the human and economic cost—fishermen losing land and coastal infrastructure damage."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 3
    story.append(make_speech_box(
        slide_num=3,
        title="Study Area: The Udupi District Coastline",
        visual_desc="Satellite map of Karnataka highlighting the Udupi coastline, Swarna-Sita estuaries, Bengre sand spit, Malpe harbor, and Kaup.",
        what_to_say="\"Let us examine our geographic study area. Udupi district lies on Karnataka's coastal strip between the Western Ghats and the Arabian Sea. "
                    "It spans approximately 100 kilometers of diverse geomorphology—including major estuaries where the Swarna and Sita rivers discharge into the ocean, sand spits like Bengre, and harbor breakwaters at Malpe. "
                    "These structures disrupt the natural sediment transport, causing sand to accumulate on one side while starving the other. "
                    "Because of this unique geomorphology, Udupi serves as an ideal testbed for coastal machine learning models.\"",
        key_points="100 km Arabian Sea coast, Swarna-Sita estuary, Bengre spit, Sediment starvation from harbor breakwaters.",
        tip="Point to the Bengre spit on the slide to show evaluators that you understand the local geography."
    ))

    story.append(PageBreak())

    # SLIDE 4
    story.append(make_speech_box(
        slide_num=4,
        title="Limitations of Existing Satellite Methodologies",
        visual_desc="Comparison graphic: NDWI failing on cloudy scenes vs SAR radar cutting through clouds; foam surf misclassified as land.",
        what_to_say="\"When researchers first applied satellite remote sensing to coastlines, they relied on optical spectral indices like NDWI—the Normalized Difference Water Index. "
                    "However, NDWI suffers from critical real-world limitations. First, during the monsoon—when erosion is at its peak—optical satellites are completely blinded by thick cloud cover. "
                    "Second, breaking ocean waves create white surf and foam that reflect light like land, confusing simple thresholding. "
                    "Third, wet sand reflects like shallow water, causing false boundary jumps. "
                    "Finally, tides shift the apparent waterline back and forth by tens of meters daily. Comparing satellite images taken at different tide heights produces 'fake erosion'. "
                    "To build a truly reliable system, we had to fuse optical with radar imagery and introduce physical tidal corrections.\"",
        key_points="NDWI failure during monsoon clouds, White surf foam confusion, Wet sand absorption, Uncorrected tidal displacement.",
        tip="This slide justifies your technical architecture. Examiners love hearing why naive solutions fail."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 5
    story.append(make_speech_box(
        slide_num=5,
        title="Proposed System Architecture &amp; Multi-Modal Fusion",
        visual_desc="Block diagram showing Sentinel-1 SAR + Sentinel-2 Optical merging into a 9-channel tensor, feeding DeepLabV3+, Tidal Correction, XGBoost, and Dashboard.",
        what_to_say="\"Here is our proposed end-to-end system architecture. We solve the cloud and surf problem through Multi-Sensor Data Fusion. "
                    "We ingest 7 optical bands from Sentinel-2 covering visible, red edge, and shortwave infrared, and we fuse them with 2 polarization bands—VV and VH—from Sentinel-1 Synthetic Aperture Radar (SAR). "
                    "SAR sends active microwave pulses that penetrate clouds, rain, and darkness. Smooth water acts like a mirror, reflecting radar pulses away and appearing jet black, while rough land scatters energy back. "
                    "We stack these into a unified 9-channel tensor. This feeds our DeepLabV3+ neural network for boundary segmentation, followed by sub-pixel contour extraction, beach slope tidal correction, XGBoost environmental risk classification, and short-term forecasting.\"",
        key_points="Sentinel-1 SAR + Sentinel-2 Optical fusion, 9-channel tensor, Specular vs diffuse radar reflection, End-to-end pipeline.",
        tip="Emphasize 'specular reflection'—examiners will notice your grasp of remote sensing physics."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 6
    story.append(make_speech_box(
        slide_num=6,
        title="Dataset Preparation: 50% Overlapping Sliding Window",
        visual_desc="Diagram illustrating a 256x256 pixel sliding window moving across a satellite scene with a 128-pixel stride (50% overlap).",
        what_to_say="\"Raw satellite scenes are massive—exceeding 7,600 by 11,000 pixels—which cannot fit directly into GPU memory. "
                    "In script 1, `prepare_dataset.py`, we designed a sliding-window tiling algorithm that cuts the scenes into 256 by 256 pixel patches with a 128-pixel stride, creating a 50% overlap. "
                    "Why 50% overlap? Coastlines are continuous features. If a shoreline intersects the edge of a tile, a standard tiling algorithm cuts it in half, causing the model to miss the boundary. "
                    "Our 50% overlap guarantees that every boundary appears in the central field-of-view of at least two adjacent tiles, while doubling our training dataset size. "
                    "We normalized optical bands by dividing by 10,000 and scaled SAR decibels between 0 and 1, storing them as high-speed `.npy` tensors.\"",
        key_points="256x256 patch size, 128-pixel stride (50% overlap), Solves edge boundary truncation, Multi-modal normalization.",
        tip="Highlight the engineering rationale behind the 50% overlap—it shows thoughtful design."
    ))

    story.append(Spacer(1, 8))
    # Insert feature importance / correlation plots
    fimp_path = os.path.join(os.getcwd(), "env_feature_importance.png")
    for elem in safe_image(fimp_path, target_width=480, caption="Figure 2: XGBoost Environmental Feature Importance — Monsoon Exposure is the Dominant Catalyst"):
        story.append(elem)

    story.append(PageBreak())

    # SLIDE 7
    story.append(make_speech_box(
        slide_num=7,
        title="DeepLabV3+ Segmentation &amp; Boundary Extraction",
        visual_desc="Diagram of DeepLabV3+ architecture showing ResNet-34 backbone, ASPP module with dilation rates (6, 12, 18), and OpenCV contour extraction.",
        what_to_say="\"For shoreline segmentation in `train_deeplabv3.py`, we chose DeepLabV3+ with a ResNet-34 encoder. "
                    "Standard CNNs lose fine spatial details because repeated pooling downsamples the image. ResNet-34 uses residual skip connections to preserve crisp boundary coordinates. "
                    "The key innovation is the ASPP module—Atrous Spatial Pyramid Pooling—which applies dilated convolutions at rates of 6, 12, and 18 pixels spacing. "
                    "This allows the network to identify huge water bodies and narrow river inlets simultaneously without increasing parameter count. "
                    "We trained the network using a combined Binary Cross-Entropy and Dice loss to overcome severe class imbalance between vast water areas and thin shorelines. "
                    "Our model achieved a validation Dice Coefficient of 0.8548. "
                    "In `run_inference.py`, we run overlap-stitching, apply morphological filtering to remove noise, and use OpenCV's findContours to export clean GIS shapefiles in UTM Zone 43N.\"",
        key_points="ResNet-34 backbone, ASPP with dilation rates (6, 12, 18), BCE + Dice loss, 0.8548 Dice score, OpenCV contour vectorization.",
        tip="Point out the 0.8548 Dice score clearly. 85.5% boundary overlap is very high in remote sensing."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 8
    story.append(make_speech_box(
        slide_num=8,
        title="Physical Tidal Correction &amp; Transect Rate Calculation (EPR)",
        visual_desc="Diagram of beach slope equilibrium: Delta x = (H_tide - H_MSL) / tan beta, with 1,944 perpendicular transect lines along the coast.",
        what_to_say="\"Extracting the raw waterline is not enough, because tides shift the water horizontally. "
                    "In script 4, `run_calculation.py`, we implemented beach slope physics: Horizontal Shift Delta x equals (Tide Height minus Mean Sea Level) divided by the beach slope tangent beta. "
                    "With an average sandy beach slope of 0.03 (3%), a 10 cm tide difference shifts the waterline by 3.3 meters. Our equation corrects every measured point back to the true Mean Sea Level datum. "
                    "Next, we cast 1,944 perpendicular baseline transects spaced exactly 50 meters apart along the 100-km coast. "
                    "We intersected the 2020 and 2024 shoreline vectors to compute the End Point Rate: EPR equals (Distance in 2024 minus Distance in 2020) divided by 4 years. "
                    "Negative rates indicate erosion, while positive rates indicate sand accumulation or accretion.\"",
        key_points="Beach slope physics (tan beta = 0.03), Delta x tidal shift normalization, 1,944 transects at 50m intervals, End Point Rate (EPR) 2020-2024.",
        tip="Explain the beach slope formula simply: 'Vertical tide change divided by beach steepness gives horizontal shift'."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 9
    story.append(make_speech_box(
        slide_num=9,
        title="Historical Shoreline Dynamics &amp; Validation",
        visual_desc="Longshore rate profile plot and rate distribution density curves showing erosion and accretion trends along the 1,944 transects.",
        what_to_say="\"This slide displays our historical shoreline change findings between 2020 and 2024. "
                    "The longshore rate profile reveals that while several central beach stretches remain dynamically stable, severe erosion spikes occur near estuary mouths and port structures. "
                    "Specifically, transects near the Bengre sand spit exhibit landward retreat exceeding 2 to 3 meters per year. "
                    "The rate distribution density curve confirms that the majority of the Udupi coastline experiences net negative movement, demonstrating that sediment output exceeds natural replenishment.\"",
        key_points="Transect rate profile, Hotspots at Bengre spit &amp; estuary mouths, >2 to 3 m/yr retreat, Net negative sediment balance.",
        tip="Refer to Figure 3 or your visual plot to show where the worst erosion spikes occur."
    ))

    story.append(Spacer(1, 8))
    # Insert confusion matrix image
    conf_path = os.path.join(os.getcwd(), "env_ml_confusion_matrix.png")
    for elem in safe_image(conf_path, target_width=440, caption="Figure 3: XGBoost Multi-Class Confusion Matrix (Erosion, Stable, Accretion)"):
        story.append(elem)

    story.append(PageBreak())

    # SLIDE 10
    story.append(make_speech_box(
        slide_num=10,
        title="Environmental Machine Learning Modeling (XGBoost)",
        visual_desc="Feature importance chart and correlation heatmap showing wave height, tide range, and monsoon exposure index.",
        what_to_say="\"In script 6, `env_ml_analysis.py`, we investigated the physical environmental drivers of coastal erosion using machine learning. "
                    "We constructed localized marine profiles for every transect: significant wave height Hs (ranging from 1.2 to 1.8 meters on open coasts down to 0.5 meters in sheltered bays), tidal range, and the Monsoon Exposure Index, computed as the absolute cosine of the transect angle. "
                    "We trained an XGBoost multi-class classifier to predict erosion vulnerability. "
                    "Our feature importance analysis revealed a crucial scientific insight: after geographic coordinates, Monsoon Exposure and Wave Height are the most dominant predictors. "
                    "Beaches oriented perpendicular to incoming South-West monsoon waves bear the brunt of wave energy, proving that monsoon orientation is the primary catalyst of Udupi's coastal erosion.\"",
        key_points="XGBoost Classifier, Marine feature engineering (Hs, Tide, Monsoon Exposure), Monsoon Exposure is primary driver, 48% 3-class accuracy.",
        tip="If asked about the 48% accuracy, state: 'In geological hazard prediction, random baseline is 33%; 48% is a solid physical indicator given sparse ocean buoy data'."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 11
    story.append(make_speech_box(
        slide_num=11,
        title="Future Shoreline Forecasting (2027, 2028, 2029)",
        visual_desc="Map overlay showing historical 2020 and 2024 shorelines alongside forecasted vector polylines for 2027, 2028, and 2029.",
        what_to_say="\"To provide actionable planning intelligence, in script 5, `forecast_shoreline.py`, we developed a short-term temporal forecasting model. "
                    "By projecting each transect's historical End Point Rate along its normal vector, we computed anticipated shoreline positions for 2027, 2028, and 2029. "
                    "We interpolated these points into continuous GIS polylines. "
                    "The forecast demonstrates that if no mitigation structures are built, the shoreline at Bengre spit and northern Malpe will retreat by an additional 10 to 15 meters inland by 2029, threatening adjacent coastal residences and the harbor access road.\"",
        key_points="EPR linear displacement projection, Forecasted GIS shapefiles for 2027-2029, 10-15m retreat at critical hotspots by 2029.",
        tip="Emphasize that these forecasted lines are exported as genuine GIS shapefiles usable in ArcGIS or QGIS."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 12
    story.append(make_speech_box(
        slide_num=12,
        title="Quantitative Impact: Land Loss &amp; Coastline at Risk",
        visual_desc="Summary infographic: 7.65 km severe erosion, 16.45 km moderate erosion, and 7.88 hectares cumulative land loss by 2029.",
        what_to_say="\"In script 7, `quantify_erosion.py`, we converted raw mathematical predictions into concrete land-use numbers for municipal authorities. "
                    "Across our 1,944 transects spaced at 50 meters, we calculated that exactly 7.65 kilometers of Udupi coastline falls under the 'Severe Erosion' category—experiencing retreat exceeding 2 meters per year. "
                    "An additional 16.45 kilometers experiences moderate erosion. "
                    "Multiplying the erosion rate by the 50-meter transect width and the forecast duration, we project a cumulative land loss of 7.88 hectares by 2029. "
                    "That is equivalent to losing nearly 15 international football fields of valuable coastal land within five years.\"",
        key_points="7.65 km severe erosion (>2 m/yr), 16.45 km moderate erosion, 7.88 hectares cumulative land loss by 2029 (15 football fields).",
        tip="The '15 football fields' analogy makes the statistical number 7.88 hectares instantly memorable."
    ))

    story.append(Spacer(1, 8))
    # Insert correlation heatmap
    heat_path = os.path.join(os.getcwd(), "env_correlation_heatmap.png")
    for elem in safe_image(heat_path, target_width=440, caption="Figure 4: Environmental Correlation Heatmap across 1,944 Baseline Transects"):
        story.append(elem)

    story.append(PageBreak())

    # SLIDE 13
    story.append(make_speech_box(
        slide_num=13,
        title="Live Web-GIS Decision Support Platform",
        visual_desc="Screenshot of the deployed React 19 + Leaflet Web-GIS dashboard showing interactive map, color-coded transects, and ML simulator.",
        what_to_say="\"A key contribution of our project is that we did not leave our results inside a research paper. "
                    "We built and deployed a production-grade Web-GIS Coastal Dashboard hosted live on Vercel at `major-project-coastal-ai.vercel.app`. "
                    "The platform features an interactive Leaflet map rendering all 1,944 transects color-coded by risk: red for severe erosion, orange for moderate, green for stable, and blue for accretion. "
                    "A coastal engineer can click any transect to view historical rates, wave height, and 2029 forecasts. "
                    "It also includes an interactive ML Risk Simulator where engineers can input simulated monsoon wave heights and tidal ranges to predict erosion vulnerability in real time.\"",
        key_points="React 19 + Vite + Leaflet.js, Live Vercel deployment, Clickable transect popups, Real-time ML Risk Simulator.",
        tip="Offer a 30-second live browser demo during this slide if the evaluation panel permits."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 14
    story.append(make_speech_box(
        slide_num=14,
        title="Engineering Policy Recommendations for Udupi",
        visual_desc="Three-tier recommendation table: Hard engineering (rock seawalls), Soft engineering (beach nourishment), and Sand bypassing.",
        what_to_say="\"Based on our quantitative hazard mapping, we propose a three-tiered coastal defense policy for the Udupi district administration: "
                    "First, for the 7.65 km of critical severe erosion zones, hard engineering solutions—such as submerged geotube breakwaters and riprap revetments—should be deployed to dissipate high monsoon wave energy. "
                    "Second, for the 16.45 km of moderate erosion stretches, soft engineering—such as beach nourishment and planting coastal sand-binding vegetation like Spinifex littoreus and Casuarina trees—should be prioritized to stabilize dunes naturally. "
                    "Third, near Malpe harbor and the Swarna-Sita estuary, mechanical sand bypassing systems must be installed to pump accumulated sand past breakwaters, restoring the natural longshore sediment drift.\"",
        key_points="Hard engineering for 7.65 km critical zones, Soft engineering (nourishment &amp; vegetation) for 16.45 km, Sand bypass for harbor breakwaters.",
        tip="This proves your project has direct societal and civil engineering relevance beyond pure computer science."
    ))
    story.append(Spacer(1, 8))

    # SLIDE 15
    story.append(make_speech_box(
        slide_num=15,
        title="Conclusion, UN SDG Alignment &amp; Future Scope",
        visual_desc="Summary checklist, UN Sustainable Development Goals (SDG 13, 14, 15) badges, and GitHub / Live demo QR codes.",
        what_to_say="\"In conclusion, our project successfully addresses two major research objectives: "
                    "We created an automated multi-sensor Sentinel-1/2 fusion pipeline with a DeepLabV3+ segmentation model achieving an 85.48% Dice score, eliminating the limitations of cloud cover and surf. "
                    "We applied physical tidal slope corrections, analyzed 1,944 baseline transects, proved monsoon exposure as the primary driver using XGBoost, forecasted shorelines through 2029, and deployed a live Web-GIS decision platform. "
                    "This work directly supports UN Sustainable Development Goal 13 for Climate Action and Goal 14 for Life Below Water. "
                    "In the future, we plan to integrate 3-meter sub-meter PlanetScope imagery and implement ConvLSTM deep temporal sequence networks. "
                    "Thank you for your time, and we are now open to your questions.\"",
        key_points="Both research objectives achieved, 85.48% Dice score, 2027-2029 GIS forecasts, UN SDG 13 &amp; 14 alignment, Ready for Q&amp;A.",
        tip="Conclude with a steady, polite posture. Smile and signal readiness for the viva questions."
    ))

    story.append(PageBreak())

    # ==================== CHAPTER 4: MASTER VIVA VOCE DEFENSE GUIDE ====================
    story.append(Paragraph("4. Master Viva Voce / Q&amp;A Defense Guide (25 Questions &amp; Answers)", h1_style))
    story.append(Paragraph(
        "Here are the top 25 most critical and probable questions external examiners and evaluators will ask during your viva defense. "
        "Each answer is structured to be technically precise, authoritative, and easy to explain.",
        body_style
    ))
    story.append(Spacer(1, 4))

    viva_qa = [
        (1, "What is the primary objective of your project in simple terms?",
         "Our primary objective is to automate coastal erosion monitoring and future forecasting along the 100-km Udupi coastline. We replace slow, costly manual surveys with an AI pipeline that fuses cloud-penetrating radar (Sentinel-1) and optical (Sentinel-2) satellite imagery, extracts sub-pixel shorelines, corrects for tides, predicts erosion drivers with XGBoost, and forecasts future shorelines up to 2029.",
         "Keep it within two sentences. Focus on automation, multi-modal fusion, and forecasting."),

        (2, "Why did you use DeepLabV3+ instead of a standard U-Net or YOLO?",
         "While U-Net is a solid baseline, its standard convolutions have fixed receptive fields. DeepLabV3+ incorporates Atrous Spatial Pyramid Pooling (ASPP) with dilation rates of 6, 12, and 18. This enables the network to simultaneously inspect wide oceanic surfaces and narrow river estuaries without losing high-resolution spatial details. YOLO is an object detector (bounding boxes), whereas shoreline mapping strictly requires semantic pixel-level segmentation.",
         "Mention ASPP and multi-scale feature capture—these are DeepLabV3+'s defining advantages."),

        (3, "Why did you use Sentinel-1 SAR? Why wasn't Sentinel-2 optical imagery enough?",
         "The most aggressive coastal erosion in Udupi happens during the South-West Monsoon (June to September). During these months, the sky is perpetually covered by dense storm clouds, rendering optical satellites completely blind. Sentinel-1 is a C-band Synthetic Aperture Radar that emits active microwaves. Microwaves penetrate clouds, rain, and smoke 24/7, allowing uninterrupted coastal monitoring throughout the monsoon.",
         "Emphasize: 'Erosion happens during monsoons; optical cannot see through monsoon clouds; radar can'."),

        (4, "Why does water look black in SAR radar images while land looks bright?",
         "This is governed by surface scattering physics. Smooth open water acts like a specular mirror: incoming radar microwave pulses bounce off the water away from the satellite into space, returning almost zero backscatter (black pixels). In contrast, land surfaces, vegetation, and sand dunes are rough, causing diffuse scattering that reflects microwave energy back to the satellite sensor (bright pixels).",
         "The technical keywords to say aloud are 'specular reflection' for water and 'diffuse scattering' for land."),

        (5, "What 9 bands did you feed into your DeepLabV3+ model?",
         "We used 7 optical bands from Sentinel-2: Blue (B2), Green (B3), Red (B4), Red Edge (B5), Near-Infrared (B8), Shortwave Infrared-1 (B11), and Shortwave Infrared-2 (B12); and 2 microwave radar channels from Sentinel-1: VV (Vertical transmit, Vertical receive) and VH (Vertical transmit, Horizontal receive) backscatter in decibels.",
         "If asked why SWIR: SWIR is strongly absorbed by water, creating extreme contrast between land and sea."),

        (6, "Why did you use a 50% overlap when creating satellite patches?",
         "Coastlines are continuous, serpentine natural boundaries. In a standard non-overlapping grid, whenever a coastline falls near the edge of a 256x256 tile, half the feature is cut off, causing segmentation errors. A 50% overlap (128-pixel stride) guarantees that every coastline feature is captured centrally in at least two overlapping patches. Furthermore, it effectively doubles our training dataset volume.",
         "Shows evaluators that your preprocessing was scientifically engineered, not accidental."),

        (7, "Why did you combine Binary Cross-Entropy (BCE) with Dice Loss?",
         "In coastal satellite patches, class imbalance is extreme: vast ocean or land occupies over 95% of pixels, while the actual shoreline boundary is just 1 or 2 pixels wide. Standard BCE loss gets overwhelmed by the dominant background class. Dice Loss directly optimizes boundary contour overlap (intersection over union). Combining them gives the best of both: BCE ensures smooth gradient flow, while Dice Loss enforces crisp boundary separation.",
         "Formula: Total Loss = BCE Loss + Dice Loss."),

        (8, "What does your validation Dice Coefficient of 0.8548 mean?",
         "The Dice Coefficient measures the spatial overlap agreement between our model's predicted water mask and the ground truth mask, ranging from 0 (no overlap) to 1 (perfect match). A validation Dice score of 0.8548 means our model achieves an 85.5% boundary overlap agreement on unseen validation scenes, which is considered high accuracy for 10-meter satellite resolution.",
         "State that 0.8548 reflects true generalization on unseen 20% validation tiles."),

        (9, "How did you convert raster segmentation pixels into GIS vector shapefiles?",
         "In `run_inference.py`, we run patch-by-patch inference, stitch overlapping predictions using an accumulation probability grid, apply morphological opening and closing to remove noise, and use OpenCV's `findContours` algorithm to extract the continuous boundary polyline separating land (0) and water (1). We then reproject pixel coordinates into geographic UTM Zone 43N coordinates (`EPSG:32643`) and export them via GeoPandas as ESRI Shapefiles.",
         "Mention OpenCV `findContours` and EPSG:32643 coordinate projection."),

        (10, "Why is tidal correction necessary? What is the mathematical formula?",
         "Tides cause the sea level to rise and fall twice daily. On a gently sloping sandy beach, a vertical tide shift of just 1 meter moves the apparent waterline horizontally by 33 meters. Comparing images without tidal correction produces false erosion or accretion signals. We apply beach slope equilibrium: `Horizontal Shift (Delta x) = (H_tide - H_MSL) / tan beta`, where H_tide is tide height at capture, H_MSL is Mean Sea Level (0.8m), and tan beta is beach slope (0.03).",
         "Mention: 'Without tidal correction, you are measuring the tide, not coastal erosion'."),

        (11, "What is a transect and why did you use 1,944 of them at 50-meter spacing?",
         "A transect is a straight reference line drawn perpendicular to the coastal baseline extending out into the ocean. By casting 1,944 transects spaced 50 meters apart along the 100-km Udupi coast, we convert 2D boundary polygons into 1D distance measurements. 50-meter spacing adheres to USGS Digital Shoreline Analysis System (DSAS) coastal engineering standards, offering fine spatial resolution while remaining computationally efficient.",
         "Citing the USGS DSAS standard gives tremendous credibility to your methodology."),

        (12, "What is End Point Rate (EPR) and how is it calculated?",
         "End Point Rate (EPR) is the most widely adopted metric for historical shoreline change rate. It is calculated by dividing the net distance displacement of the shoreline along a transect by the elapsed time: `EPR = (Distance_2024 - Distance_2020) / 4.0 years`. Negative EPR denotes erosion (landward retreat in meters/year), while positive EPR denotes accretion (seaward beach growth).",
         "If asked about LRR: Linear Regression Rate (LRR) is used when 10+ time points exist; EPR is standard for two definitive baseline endpoints."),

        (13, "How did you model future shorelines for 2027, 2028, and 2029?",
         "In `forecast_shoreline.py`, we projected future shoreline positions using a linear kinematic rate equation: `Future_Distance = Distance_2024 + (EPR * elapsed_years)`. For each of the 1,944 transects, we computed the future point along its vector trajectory, clamped coordinates to physical transect boundaries, and joined the points into continuous GIS shapefile polylines for each respective year.",
         "State that this short-term (3 to 5 year) linear model is recommended by coastal engineers."),

        (14, "Why did you use XGBoost for environmental modeling?",
         "XGBoost (Extreme Gradient Boosting) is the gold standard for structured tabular environmental datasets. It handles non-linear relationships, multicollinearity between marine variables, and missing data robustly through decision tree ensembles, while offering built-in feature importance calculations. Deep neural networks require millions of samples and act as black boxes, whereas XGBoost provides interpretable splits.",
         "Highlight interpretability and feature importance—civil engineers need to know *why* erosion happens."),

        (15, "What features did you feed into the XGBoost classifier?",
         "We used both geometric and environmental features: Easting (X coordinate), Northing (Y coordinate), Transect Orientation Angle, Significant Wave Height (Hs in meters), Tidal Range (in meters), and the Monsoon Exposure Index (`|cos(Transect_Angle)|`).",
         "The target classes were 3: Erosion (< -2 m/yr), Stable (-2 to +2 m/yr), and Accretion (> +2 m/yr)."),

        (16, "What is the Monsoon Exposure Index and how is it computed?",
         "The South-West Monsoon winds strike the Karnataka coastline from the south-west (roughly 240 degrees azimuth). The Monsoon Exposure Index is computed as `|cos(Transect_Angle)|`. A transect line facing west or south-west has an exposure index close to 1.0, meaning storm waves hit it head-on. Transects tucked inside sheltered bays or river mouths have low exposure indices.",
         "This formula translates geographic compass orientation into physical wave impact."),

        (17, "What did your XGBoost feature importance reveal?",
         "It revealed that after geographic coordinates (Northing and Easting), the Monsoon Exposure Index and Wave Height are the highest-ranked features. This scientifically proves that the physical orientation of the beach relative to incoming monsoon storm swells is the primary catalyst driving coastal retreat along Udupi.",
         "This is Objective 2's core scientific finding."),

        (18, "Why is your XGBoost model accuracy 48%? Isn't that low?",
         "In a 3-class classification problem (Erosion, Stable, Accretion), a random guess gives 33% accuracy. Achieving 48% with sparse environmental inputs (synthesized marine profiles rather than daily continuous oceanographic buoy telemetry) is a strong statistical signal. More importantly, our model's feature importance rankings and confusion matrix align with known hydrodynamic physics.",
         "Confident explanation: Examiners respect candidates who understand baseline probability vs real-world environmental noise."),

        (19, "How much coastline in Udupi is severely eroding?",
         "Exactly 7.65 kilometers of the coastline falls under the severe erosion category (retreat rate exceeding 2 meters per year). An additional 16.45 kilometers experiences moderate erosion. The remaining stretches are either dynamically stable or experiencing localized sand deposition.",
         "Quote the exact numbers: 7.65 km severe, 16.45 km moderate."),

        (20, "What is the cumulative land loss predicted by 2029?",
         "Our model forecasts a cumulative land area loss of **7.88 hectares** by 2029 across the 1,944 transects. In script 7, this was quantified as `Sum(-EPR * 50m spacing * 5 years) / 10,000 m^2/ha`. This is equivalent to losing approximately 15 full-sized international football fields of land.",
         "Remember: 7.88 hectares = 15 football fields."),

        (21, "Where are the worst erosion hotspots located in Udupi?",
         "The most critical hotspots are located along the Bengre sand spit near the Swarna-Sita river confluence, the beaches immediately north of Malpe port's breakwaters, and sections of Padubidri. Bengre spit is especially vulnerable because harbor groynes block longshore sediment replenishment.",
         "Bengre spit and Malpe port are well known to any local examiner in Karnataka."),

        (22, "What technologies did you use for the Web-GIS dashboard?",
         "The dashboard is built with a modern web stack: React 19, Vite, and Leaflet.js for interactive GIS mapping. It renders all 1,944 color-coded transects, features clickable analytics popups, dynamic Chart.js historical trend graphs, an interactive XGBoost ML Risk Simulator, and is deployed live on Vercel at `major-project-coastal-ai.vercel.app`.",
         "Highlight that it is live on Vercel—working software always gets higher marks."),

        (23, "What coastal engineering measures do you recommend based on your findings?",
         "We recommend a 3-tier strategy: (1) Hard engineering (submerged geotube breakwaters and seawalls) for the 7.65 km of critical erosion zones; (2) Soft engineering (beach nourishment and dune vegetation planting with Casuarina and Spinifex littoreus) for the 16.45 km of moderate erosion stretches; and (3) Mechanical sand bypassing around Malpe breakwaters to restore natural littoral drift.",
         "Proving you know both hard and soft engineering demonstrates interdisciplinary mastery."),

        (24, "What are the limitations of your current project?",
         "First, Sentinel-1 and Sentinel-2 have a spatial resolution of 10 meters, meaning sub-meter shoreline changes are interpolated. Second, environmental features (wave height and tides) were modeled using regional approximations rather than permanent nearshore oceanographic sensor buoys. Third, our forecasting model uses linear EPR extrapolation rather than non-linear hydrodynamic sediment transport modeling.",
         "Acknowledging genuine limitations shows academic maturity and integrity."),

        (25, "What is the future scope of this research?",
         "In future phases, we aim to ingest sub-meter commercial imagery from PlanetScope (3m) or WorldView (0.3m), deploy deep temporal sequence architectures like ConvLSTM to learn seasonal storm patterns directly from satellite video stacks, and integrate real-time INCOIS (Indian National Centre for Ocean Information Services) live ocean buoy feeds into our Web-GIS dashboard.",
         "Mentioning INCOIS and ConvLSTM shows you have a clear vision for real-world scaling.")
    ]

    for q_num, question, answer, tip in viva_qa:
        story.append(make_qa_box(q_num, question, answer, tip))
        story.append(Spacer(1, 5))

    story.append(PageBreak())

    # ==================== CHAPTER 5: SUMMARY TABLES &amp; GLOSSARY ====================
    story.append(Paragraph("5. Master Factsheet, Codebase Map &amp; Technical Glossary", h1_style))

    story.append(Paragraph("5.1 Master Project Factsheet (Quick Reference)", h2_style))
    factsheet_data = [
        [Paragraph("<b>Parameter / Metric</b>", table_header_style), Paragraph("<b>Value / Specification</b>", table_header_style), Paragraph("<b>Significance / Role</b>", table_header_style)],
        [Paragraph("Study Area Coastline", table_cell_bold), Paragraph("100 km (Udupi District, Karnataka)", table_cell_center), Paragraph("Eastern Arabian Sea coast between Western Ghats &amp; ocean", table_cell_style)],
        [Paragraph("Satellites Utilized", table_cell_bold), Paragraph("Sentinel-2 (Optical) + Sentinel-1 (SAR)", table_cell_center), Paragraph("Multi-modal fusion for all-weather, cloud-penetrating vision", table_cell_style)],
        [Paragraph("Input Tensor Channels", table_cell_bold), Paragraph("9 Channels (7 Optical + 2 SAR)", table_cell_center), Paragraph("B2, B3, B4, B5, B8, B11, B12 + VV, VH SAR dB", table_cell_style)],
        [Paragraph("Patch Tiling Strategy", table_cell_bold), Paragraph("256x256 pixels, 50% overlap (128 stride)", table_cell_center), Paragraph("Prevents edge clipping; doubles training dataset", table_cell_style)],
        [Paragraph("Segmentation Network", table_cell_bold), Paragraph("DeepLabV3+ with ResNet-34 Encoder", table_cell_center), Paragraph("ASPP (rates 6, 12, 18) captures multiscale features", table_cell_style)],
        [Paragraph("Segmentation Accuracy", table_cell_bold), Paragraph("Validation Dice: <b>0.8548</b> | Loss: <b>0.4304</b>", table_cell_center), Paragraph("85.5% spatial boundary overlap agreement on unseen scenes", table_cell_style)],
        [Paragraph("Loss Function", table_cell_bold), Paragraph("Binary Cross-Entropy + Dice Loss", table_cell_center), Paragraph("Overcomes extreme class imbalance of thin shorelines", table_cell_style)],
        [Paragraph("Tidal Correction Equation", table_cell_bold), Paragraph("&Delta;x = (H_tide - H_MSL) / tan &beta;", table_cell_center), Paragraph("Normalizes waterlines to Mean Sea Level (tan &beta; = 0.03)", table_cell_style)],
        [Paragraph("Baseline Transects", table_cell_bold), Paragraph("1,944 Transects spaced at 50m intervals", table_cell_center), Paragraph("Adheres to USGS DSAS coastal engineering standards", table_cell_style)],
        [Paragraph("Rate Metric", table_cell_bold), Paragraph("End Point Rate (EPR) [2020 to 2024]", table_cell_center), Paragraph("Measures historical annual retreat or advance rate in m/yr", table_cell_style)],
        [Paragraph("ML Risk Classifier", table_cell_bold), Paragraph("XGBoost Multi-Class Classifier (48%)", table_cell_center), Paragraph("Predicts erosion risk; proves monsoon exposure is primary driver", table_cell_style)],
        [Paragraph("Severe Erosion Coastline", table_cell_bold), Paragraph("<b>7.65 km</b> (> 2 m/year retreat)", table_cell_center), Paragraph("High-priority zones needing immediate rock revetments", table_cell_style)],
        [Paragraph("Moderate Erosion Coastline", table_cell_bold), Paragraph("<b>16.45 km</b> (-2 to 0 m/year retreat)", table_cell_center), Paragraph("Requires soft engineering (beach nourishment &amp; vegetation)", table_cell_style)],
        [Paragraph("Cumulative Land Loss (2029)", table_cell_bold), Paragraph("<b>7.88 Hectares</b> lost by 2029", table_cell_center), Paragraph("Equivalent to ~15 international football fields lost", table_cell_style)],
        [Paragraph("Web-GIS Platform", table_cell_bold), Paragraph("React 19 + Leaflet.js (Vercel Deployed)", table_cell_center), Paragraph("Live decision support tool with real-time risk simulator", table_cell_style)]
    ]
    t_fact = Table(factsheet_data, colWidths=[150, 160, 222])
    t_fact.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_navy),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_fact)
    story.append(Spacer(1, 10))

    story.append(Paragraph("5.2 Codebase Script Directory (What Each File Does)", h2_style))
    script_data = [
        [Paragraph("<b>Script Name</b>", table_header_style), Paragraph("<b>Core Function &amp; Operation</b>", table_header_style), Paragraph("<b>Primary Output</b>", table_header_style)],
        [
            Paragraph("`prepare_dataset.py`", table_cell_bold),
            Paragraph("Ingests GeoTIFFs; slides 256x256 window with 50% overlap; normalizes optical &amp; SAR; exports 9-channel tensors.", table_cell_style),
            Paragraph("`.npy` image &amp; mask patches in `training_dataset/`", table_cell_style)
        ],
        [
            Paragraph("`train_deeplabv3.py`", table_cell_bold),
            Paragraph("Instantiates DeepLabV3+ with ResNet-34; trains with BCE + Dice loss; evaluates Dice coefficient per epoch.", table_cell_style),
            Paragraph("`best_deeplabv3_model.pth` (Dice: 0.8548)", table_cell_style)
        ],
        [
            Paragraph("`run_inference.py`", table_cell_bold),
            Paragraph("Runs overlap-stitching inference on 2024 scene; applies morphological filters; traces contours with OpenCV.", table_cell_style),
            Paragraph("`2024_Predicted_Shoreline_DeepLabV3.shp`", table_cell_style)
        ],
        [
            Paragraph("`run_calculation.py`", table_cell_bold),
            Paragraph("Applies tidal shift formula &Delta;x; casts 1,944 transects at 50m intervals; computes End Point Rate (EPR).", table_cell_style),
            Paragraph("`transect_erosion_rates.csv` &amp; Shapefile", table_cell_style)
        ],
        [
            Paragraph("`forecast_shoreline.py`", table_cell_bold),
            Paragraph("Linear kinematic projection of EPR across transects for 2027, 2028, and 2029; reconstructs polylines.", table_cell_style),
            Paragraph("`Forecast_Shoreline_2027/28/29.shp`", table_cell_style)
        ],
        [
            Paragraph("`env_ml_analysis.py`", table_cell_bold),
            Paragraph("Constructs wave height, tidal range, and monsoon exposure index; trains XGBoost classifier.", table_cell_style),
            Paragraph("Confusion matrix, feature importance, heatmap plots", table_cell_style)
        ],
        [
            Paragraph("`quantify_erosion.py`", table_cell_bold),
            Paragraph("Calculates total kilometers of severe/moderate coast and cumulative land area loss in hectares.", table_cell_style),
            Paragraph("`coastal_erosion_quantification.png`", table_cell_style)
        ],
        [
            Paragraph("`shoreline_movement_plot.py`", table_cell_bold),
            Paragraph("Generates multi-year boxplots and annual movement trend distributions from 2020 to 2029.", table_cell_style),
            Paragraph("`shoreline_movement_all_years.png`", table_cell_style)
        ]
    ]
    t_scripts = Table(script_data, colWidths=[130, 252, 150])
    t_scripts.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_navy),
        ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_scripts)
    story.append(Spacer(1, 10))

    story.append(Paragraph("5.3 Technical Glossary (Concepts Demystified)", h2_style))
    glossary_items = [
        ("ASPP (Atrous Spatial Pyramid Pooling)", "A neural network module that applies dilated convolutions at multiple sample rates (e.g. 6, 12, 18). It expands the field of view without shrinking image dimensions or adding extra weights, allowing detection of both vast oceans and narrow estuaries."),
        ("Backscatter (Radar)", "The portion of microwave radar energy sent by Sentinel-1 that bounces back to the satellite sensor. Rough land produces high backscatter (bright pixels); flat water produces specular reflection away from the sensor, yielding near-zero backscatter (dark pixels)."),
        ("Dice Coefficient (F1-Score)", "A spatial overlap metric calculated as `2 * |A ∩ B| / (|A| + |B|)`. A score of 1.0 means perfect boundary agreement. Our model achieves 0.8548 on unseen validation data."),
        ("End Point Rate (EPR)", "The net shoreline displacement divided by the time elapsed between the oldest and newest available surveys: `(Distance_new - Distance_old) / Time`. Measured in meters per year."),
        ("EPSG:32643 (UTM Zone 43N)", "A standard projected coordinate reference system covering the west coast of India. Unlike latitude/longitude degrees, UTM coordinates measure distances in meters, enabling precise erosion calculations."),
        ("Littoral / Longshore Drift", "The continuous transport of sand grains parallel to the shoreline caused by waves breaking at an angle. Interrupted by harbor breakwaters, leading to downstream erosion."),
        ("Monsoon Exposure Index", "A geometric measure (`|cos θ_transect|`) calculating how directly a coastal transect faces incoming South-West monsoon storm waves. Evaluates environmental hazard intensity."),
        ("Tidal Correction (Delta x)", "The horizontal shift calculation `(H_tide - H_MSL) / tan β` that standardizes waterlines observed at varying tide heights to Mean Sea Level, preventing 'fake erosion' artifacts.")
    ]
    for term, definition in glossary_items:
        story.append(Paragraph(f"• <b>{term}:</b> {definition}", bullet_style))

    story.append(Spacer(1, 14))
    story.append(make_callout(
        "Final Words of Encouragement for Your Presentation",
        "<i>\"You and your team have built a complete, end-to-end, multi-sensor AI system that solves a pressing real-world ecological disaster in coastal Karnataka. "
        "Your pipeline is mathematically rigorous (beach slope tidal physics, Dice loss, ASPP dilated convolutions), empirically validated across 1,944 active transects, and deployed live on Vercel. "
        "Read through the slide-by-slide scripts and viva Q&amp;A once or twice before your defense. Walk into the seminar hall with heads held high—you are fully prepared!\"</i>"
    ))

    # Build Document
    print(f"Generating comprehensive PDF: {pdf_path}...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    build_pdf()
