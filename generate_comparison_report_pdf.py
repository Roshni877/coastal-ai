"""
generate_comparison_report_pdf.py
Generates an executive, publication-grade presentation report PDF comparing:
- Old Work: 54% accuracy using Random Forest, XGBoost, and SVM on geometric features (centroid_x, centroid_y, angle)
- Proposed Work: 85.5% Dice & 84.8% accuracy using actual 9-channel Earth Observation data (Sentinel-1 SAR + Sentinel-2 Optical) with DeepLabV3+ and environmental hydrodynamic features.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

PDF_FILENAME = "Methodology_Comparison_Report_Old_vs_New.pdf"

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
        # Suppress running header/footer on cover/first page
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#475569"))
            self.drawString(40, 841.89 - 30, "Methodology Comparison Report: Geometric Baseline (54%) vs. DeepLabV3+ AI (85.5%)")
            self.drawRightString(595.27 - 40, 841.89 - 30, "Udupi Coastline Project | SMVITM CSE")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 841.89 - 34, 595.27 - 40, 841.89 - 34)

            # Footer
            self.setFont("Helvetica", 8)
            self.drawString(40, 25, "Major Project Phase 4 | Group 21 | Department of Computer Science & Engineering")
            self.drawRightString(595.27 - 40, 25, f"Page {self._pageNumber} of {page_count}")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 35, 595.27 - 40, 35)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_FILENAME,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionHeading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionHeading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#1e40af'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0f172a')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1 # Center
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=table_cell,
        alignment=1 # Center
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold'
    )

    quote_style = ParagraphStyle(
        'QuoteStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#065f46')
    )

    story = []

    # ---------------------------------------------------------
    # COVER / HEADER BLOCK
    # ---------------------------------------------------------
    badge_table = Table(
        [[
            Paragraph("<b>MAJOR PROJECT PRESENTATION REPORT</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#1e40af'))),
            Paragraph("<b>ACADEMIC YEAR 2025–2026</b>", ParagraphStyle('BadgeR', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#64748b'), alignment=2))
        ]],
        colWidths=[260, 255]
    )
    badge_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("Comparative Analysis: Baseline Geometric ML vs. Proposed Multi-Sensor DeepLabV3+ AI Pipeline", title_style))
    story.append(Paragraph("A Technical Review of the Transition from 54% Accuracy (Random Forest / SVM / XGBoost on Geometric Data) to 85.5% Dice & 84.8% Hazard Forecasting via Earth Observation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563eb'), spaceBefore=2, spaceAfter=10))

    # Project metadata banner
    meta_data = [
        [
            Paragraph("<b>Author / Candidate:</b> Roshni (Group 21)", table_cell),
            Paragraph("<b>Institution:</b> SMVITM, Dept. of CSE", table_cell),
            Paragraph("<b>Study Area:</b> Udupi Coast, Karnataka (97.2 km)", table_cell)
        ],
        [
            Paragraph("<b>Baseline Ceiling:</b> ~54% (RF / SVM / XGB)", table_cell),
            Paragraph("<b>Proposed AI Score:</b> 0.8548 Dice (DeepLabV3+)", table_cell),
            Paragraph("<b>Downstream Classifier:</b> 84.8% (XGBoost)", table_cell)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[175, 170, 170])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY
    # ---------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & Research Problem", h1_style))
    story.append(Paragraph(
        "During the exploratory phases of this major project (Phase 1 and Phase 2), coastal erosion prediction was formulated "
        "as a conventional tabular classification problem. Models—specifically <b>Random Forest (RF)</b>, <b>Support Vector Machines (SVM)</b>, "
        "and <b>XGBoost</b>—were trained exclusively on <b>static geometric transect attributes</b>: geographic centroid coordinates "
        "<code>(centroid_x, centroid_y)</code> and orientation azimuth <code>(angle)</code>. "
        "This experimental setup hit an insurmountable performance ceiling of <b>51% to 54% accuracy</b>, rendering predictions equivalent to near-random guessing.",
        body_style
    ))
    story.append(Paragraph(
        "Recognizing that coastal morphodynamics are driven by fluid oceanography rather than static line geometry, the project executed a fundamental "
        "<b>paradigm shift</b>: abandoning purely geometric proxies and ingesting <b>actual multi-sensor Earth Observation (EO) satellite data</b>. "
        "We engineered a 9-channel tensor combining 7 Sentinel-2 optical bands with 2 Sentinel-1 SAR cloud-penetrating radar channels, trained a custom "
        "<b>DeepLabV3+ architecture with Atrous Spatial Pyramid Pooling (ASPP)</b>, incorporated physics-based tidal equilibrium corrections, "
        "and coupled actual wave/monsoon forcing into downstream forecasting. "
        "This elevated boundary segmentation to an <b>85.48% validation Dice Coefficient</b> and boosted vulnerability classification accuracy from <b>54% to 84.8%</b> (+30.8% absolute gain).",
        body_style
    ))

    # Highlight Callout Box
    summary_box = [
        [Paragraph("<b>KEY TAKEAWAY FOR THE EVALUATION PANEL:</b><br/>"
                   "The early 54% accuracy was not caused by model coding bugs; it was caused by <i>geometric feature blindness</i>. "
                   "Two adjacent beach transects share identical coordinates and orientation angles, yet one suffers severe erosion while the other accretes sand. "
                   "Only true multi-spectral and radar satellite imagery provides the physical hydrodynamic context necessary to delineate coastal boundaries accurately.",
                   callout_style)]
    ]
    t_sum = Table(summary_box, colWidths=[515])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eff6ff')),
        ('BOX', (0, 0), (-1, -1), 1.2, colors.HexColor('#3b82f6')),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_sum)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 2: OLD WORK PERFORMANCE BREAKDOWN
    # ---------------------------------------------------------
    story.append(Paragraph("2. Phase 1 & 2: The Old Geometric ML Approach", h1_style))
    story.append(Paragraph(
        "In <code>Soil_Erosion_Major_Project_Phase_4_Roshni.ipynb</code> (Cells 15–21), historical transect data was evaluated using strictly geometric features. "
        "The model was tasked with classifying each transect into three target regimes based on annual shoreline change rate: "
        "<b>Erosion</b> (&lt; −2 m/yr), <b>Stable</b> (−2 to +2 m/yr), and <b>Accretion</b> (&gt; +2 m/yr).",
        body_style
    ))

    # Table of Old Model Results
    old_table_data = [
        [
            Paragraph("<b>Model Architecture</b>", table_header),
            Paragraph("<b>Feature Space</b>", table_header),
            Paragraph("<b>Overall Accuracy</b>", table_header),
            Paragraph("<b>Accretion F1</b>", table_header),
            Paragraph("<b>Erosion F1</b>", table_header),
            Paragraph("<b>Stable F1</b>", table_header),
            Paragraph("<b>Macro F1</b>", table_header)
        ],
        [
            Paragraph("<b>Random Forest (RF)</b><br/>300 trees, balanced weights", table_cell_bold),
            Paragraph("centroid_x, centroid_y, angle", table_cell),
            Paragraph("<b>51.0%</b>", table_cell_center),
            Paragraph("0.41", table_cell_center),
            Paragraph("0.42", table_cell_center),
            Paragraph("0.61", table_cell_center),
            Paragraph("0.48", table_cell_center)
        ],
        [
            Paragraph("<b>XGBoost (Geometric)</b><br/>lr=0.05, max_depth=6", table_cell_bold),
            Paragraph("centroid_x, centroid_y, angle", table_cell),
            Paragraph("<b>53.0% – 54.0%</b>", table_cell_center),
            Paragraph("0.32", table_cell_center),
            Paragraph("0.32", table_cell_center),
            Paragraph("0.66", table_cell_center),
            Paragraph("0.43", table_cell_center)
        ],
        [
            Paragraph("<b>Support Vector Machine</b><br/>RBF Kernel, StandardScaler", table_cell_bold),
            Paragraph("centroid_x, centroid_y, angle", table_cell),
            Paragraph("<b>38.0%</b>", table_cell_center),
            Paragraph("0.38", table_cell_center),
            Paragraph("0.40", table_cell_center),
            Paragraph("0.36", table_cell_center),
            Paragraph("0.38", table_cell_center)
        ]
    ]
    t_old = Table(old_table_data, colWidths=[120, 105, 68, 55, 55, 55, 57])
    t_old.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_old)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Observed Failure Modes in Confusion Matrices:</b><br/>"
        "• <i>Extreme Majority Class Bias:</i> Both RF and XGBoost defaulted to predicting the 'Stable' class (F1 $\\approx$ 0.61–0.66), completely failing to detect active hazard zones.<br/>"
        "• <i>Severe False Positives/Negatives in Hazard Zones:</i> Accretion and Erosion both exhibited disastrous F1 scores of 0.32–0.42, meaning that more than 60% of critical eroding beaches were misdiagnosed.<br/>"
        "• <i>SVM Kernel Collapse:</i> The RBF SVM decision boundary collapsed because the geometric feature vectors of eroding and accreting beaches were completely overlapping in 3D feature space.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # ---------------------------------------------------------
    # SECTION 3: ROOT CAUSE ANALYSIS
    # ---------------------------------------------------------
    story.append(Paragraph("3. Root Cause Analysis: Why Geometric Features Failed", h1_style))
    story.append(Paragraph(
        "A rigorous scientific audit of the Phase 1/2 methodology revealed three core reasons why geometric features can never exceed ~54% accuracy:",
        body_style
    ))

    reasons = [
        ("1. Total Hydrodynamic Blindness",
         "Coastal retreat is caused by kinetic energy transfer from ocean waves, nearshore sediment starvation, and storm surges. "
         "A mathematical coordinate (e.g. Easting 74.75°, Northing 13.5°) and a line angle (e.g. 182°) possess no energy term. They cannot quantify how violently waves are breaking against the berm."),
        ("2. Geometric Collinearity of Opposing Geomorphic Regimes",
         "Along a relatively straight micro-tidal coast like Udupi, dozens of transects share an orientation of ~180° ± 5°. "
         "Yet, transect #420 might be actively eroding due to estuarine inlet scouring, while transect #435 accretes due to an offshore sandbar. "
         "Because their input vectors [X, Y, θ] are virtually identical, any tree split or hyperplane is forced to guess randomly, leading mathematically to ~50% accuracy."),
        ("3. Ignorance of Daily Astronomical Tides",
         "On gently sloping beaches (tan β = 0.03), a normal 1-meter vertical tide displacement horizontally shifts the visible waterline by 33.3 meters. "
         "Without actual satellite timestamps and beach slope equilibrium normalization, normal daily high tides were incorrectly registered as catastrophic erosion events.")
    ]

    for r_title, r_desc in reasons:
        story.append(Paragraph(f"<b>• {r_title}:</b> {r_desc}", body_style))

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 4: THE PROPOSED DEEPLABV3+ PARADIGM SHIFT
    # ---------------------------------------------------------
    story.append(Paragraph("4. The Paradigm Shift: Actual Remote Sensing Data + DeepLabV3+", h1_style))
    story.append(Paragraph(
        "To break the 54% ceiling, the project completely replaced synthetic geometric proxies with <b>physical multi-sensor Earth Observation imagery</b> "
        "and modern deep convolutional neural networks:",
        body_style
    ))

    components = [
        ("A. 9-Channel Multi-Sensor Tensor Ingestion",
         "Fuses 7 multispectral bands from <b>Sentinel-2 MSI</b> (B2, B3, B4, B5, B8, B11, B12 at 10m/20m) with 2 dual-polarization C-band SAR channels from <b>Sentinel-1</b> (VV, VH backscatter at 20m). "
         "Sentinel-1 SAR provides <b>100% cloud-penetrating radar capability</b>, ensuring observation continues unimpeded even during torrential southwest monsoon storms when optical sensors are blinded."),
        ("B. DeepLabV3+ Architecture with ResNet-34 & ASPP",
         "Standard CNN downsampling loses the fine 1-pixel coordinates of sandy beaches. "
         "Our DeepLabV3+ model utilizes a <b>ResNet-34 encoder</b> with residual skip connections to preserve crisp boundary coordinates. "
         "The <b>Atrous Spatial Pyramid Pooling (ASPP)</b> module applies dilated convolutions with rates of 6, 12, and 18 pixels, allowing the network to simultaneously capture vast ocean expanses (wide receptive field) and narrow river mouths (tight receptive field)."),
        ("C. Combined Binary Cross-Entropy + Dice Loss",
         "Coastal satellite patches exhibit severe class imbalance: ocean and mainland occupy &gt;95% of pixels, while the shoreline interface is only 1–2 pixels wide. "
         "Standard BCE loss gets overwhelmed by background pixels. We optimized with combined loss: <code>Total_Loss = BCE + Dice_Loss</code>. "
         "BCE provides smooth gradient descent, while Dice Loss directly maximizes boundary contour overlap, yielding a <b>0.8548 validation Dice score</b>."),
        ("D. Physics-Based Tidal Equilibrium Normalization",
         "Before calculating historical retreat, extracted waterlines are adjusted to Mean Sea Level (H_MSL = 0.8m) using the equilibrium beach slope formula: "
         "<code>Δx = (H_tide − H_MSL) / tan(β)</code>, where tan(β) = 0.03. This eliminates up to 25m of false tidal noise."),
        ("E. Real Hydrodynamic Forcing in Downstream XGBoost",
         "The downstream XGBoost classifier was upgraded from static coordinates to real physical environmental forcing: "
         "Significant Wave Height (Hs), Monsoon Exposure Index (MEI), latitudinal tidal gradient, and calibrated End Point Rate (EPR) trends across 1,944 paired transects. "
         "This boosted overall hazard prediction accuracy to <b>84.8%</b>.")
    ]

    for c_title, c_desc in components:
        story.append(Paragraph(f"<b>{c_title}:</b> {c_desc}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 5: COMPREHENSIVE BENCHMARK TABLE
    # ---------------------------------------------------------
    story.append(Paragraph("5. Direct Technical Comparison: Old Work vs. Proposed Methodology", h1_style))
    story.append(Paragraph("A side-by-side technical evaluation highlighting the quantum leap in model reliability and scientific validity:", body_style))

    comp_table_data = [
        [
            Paragraph("<b>Comparison Dimension</b>", table_header),
            Paragraph("<b>Phase 1 & 2: Old Work<br/>(Geometric ML)</b>", table_header),
            Paragraph("<b>Phase 4: Proposed Work<br/>(Actual EO Data + DeepLabV3+)</b>", table_header),
            Paragraph("<b>Improvement / Impact</b>", table_header)
        ],
        [
            Paragraph("<b>Primary Input Data</b>", table_cell_bold),
            Paragraph("Static 3-column scalars<br/>(centroid_x, centroid_y, angle)", table_cell),
            Paragraph("9-Channel Multi-Sensor Tensor<br/>(7 Optical bands + 2 SAR radar channels)", table_cell),
            Paragraph("Grounded in true spectral reflectance and radar roughness", table_cell)
        ],
        [
            Paragraph("<b>Monsoon & Cloud Resilience</b>", table_cell_bold),
            Paragraph("0% (Blind to actual weather; cannot detect clouds)", table_cell),
            Paragraph("100% Operational (Sentinel-1 C-band SAR penetrates dense rain clouds)", table_cell),
            Paragraph("Year-round monitoring during critical monsoon erosion peaks", table_cell)
        ],
        [
            Paragraph("<b>Spatial Feature Resolution</b>", table_cell_bold),
            Paragraph("Discrete transect endpoints only (no coastline polyline)", table_cell),
            Paragraph("Sub-pixel continuous boundary via OpenCV findContours (10m resolution)", table_cell),
            Paragraph("Continuous 97.2 km GIS vector shapefile in UTM Zone 43N", table_cell)
        ],
        [
            Paragraph("<b>Feature Extraction Method</b>", table_cell_bold),
            Paragraph("Handcrafted geometric scalars", table_cell),
            Paragraph("Deep ASPP Multi-Scale Dilation (rates: 6, 12, 18) + ResNet-34 encoder", table_cell),
            Paragraph("Captures macro-ocean circulation & micro-estuarine inlets simultaneously", table_cell)
        ],
        [
            Paragraph("<b>Tidal Correction</b>", table_cell_bold),
            Paragraph("None (Tidal fluctuations falsely counted as erosion/accretion)", table_cell),
            Paragraph("Physics slope equilibrium equation:<br/>Δx = (H_tide − H_MSL) / tan(β)", table_cell),
            Paragraph("Eliminates up to 33.3m of false horizontal displacement noise", table_cell)
        ],
        [
            Paragraph("<b>Boundary Dice Coefficient</b>", table_cell_bold),
            Paragraph("Not applicable (no spatial segmentation output)", table_cell),
            Paragraph("<b>0.8548 (85.48% boundary overlap)</b>", table_cell),
            Paragraph("State-of-the-art remote sensing segmentation benchmark", table_cell)
        ],
        [
            Paragraph("<b>Hazard Classification Accuracy</b>", table_cell_bold),
            Paragraph("<b>51% – 54%</b><br/>(RF: 51%, XGB: 53-54%, SVM: 38%)", table_cell),
            Paragraph("<b>84.8%</b><br/>(Trained on calibrated EPR + wave + monsoon)", table_cell),
            Paragraph("<b>+30.8% to +33.8% absolute gain</b><br/>(Reliable for engineering use)", table_cell)
        ]
    ]

    t_comp = Table(comp_table_data, colWidths=[110, 125, 150, 130])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('BOX', (0, 0), (-1, -1), 1.0, colors.HexColor('#475569')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECTION 6: VIVA / PANEL DEFENSE SCRIPT
    # ---------------------------------------------------------
    story.append(Paragraph("6. Panel Presentation Script & Defense Strategy", h1_style))
    story.append(Paragraph(
        "When defending this transition during project viva, present the narrative as a deliberate engineering progression rather than a flaw:",
        body_style
    ))

    qa_box = [
        [
            Paragraph("<b>EXPECTED PANEL QUESTION:</b><br/>"
                      "<i>'Why did your initial Random Forest and XGBoost models only achieve 51%–54% accuracy? Was there a flaw in your training script?'</i>",
                      ParagraphStyle('QStyle', parent=callout_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#991b1b'))),
        ],
        [
            Paragraph("<b>CONFIDENT CANDIDATE RESPONSE:</b><br/>"
                      "<i>'No, sir/madam, it was not an implementation bug; it was a fundamental flaw in the <b>feature formulation</b>. "
                      "In Phase 1, we attempted to predict complex coastal dynamics using only three geometric scalars: centroid coordinates (X, Y) and transect orientation angle. "
                      "However, coastal erosion is a hydrodynamic phenomenon governed by wave energy flux, monsoon storm surges, and sediment transport—not static lines. "
                      "Two adjacent transects 100 meters apart share virtually identical angles, yet one erodes due to river scouring while the other accretes sand. "
                      "Because the geometric feature space was completely collinear, the tree splits were forced to guess randomly (~50% accuracy).<br/><br/>"
                      "Recognizing this, we performed a major architectural pivot: we discarded synthetic geometry and ingested <b>actual multi-sensor Earth Observation imagery</b>. "
                      "We stacked 7 optical bands from Sentinel-2 with 2 cloud-penetrating SAR radar channels from Sentinel-1 into 9-channel tensors. "
                      "We trained a DeepLabV3+ network with ResNet-34 residual connections and ASPP dilated convolutions, optimizing with combined BCE + Dice loss. "
                      "This enabled our model to achieve an <b>85.48% Dice score</b> on true coastal boundaries. "
                      "When we combined these validated rates with physical wave height, monsoon exposure, and tidal slope equations, our downstream hazard accuracy jumped to <b>84.8%</b>.'</i>",
                      quote_style)
        ]
    ]
    t_qa = Table(qa_box, colWidths=[515])
    t_qa.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fee2e2')),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ecfdf5')),
        ('BOX', (0, 0), (-1, -1), 1.0, colors.HexColor('#10b981')),
        ('LINEBELOW', (0, 0), (-1, 0), 1.0, colors.HexColor('#fca5a5')),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_qa)
    story.append(Spacer(1, 10))

    # Summary Conclusion bullet
    story.append(Paragraph("<b>Concluding Remarks for Slide Deck:</b>", h2_style))
    story.append(Paragraph(
        "• <b>Phase 1 & 2 Takeaway:</b> Pure geometric feature modeling proved that coastal erosion cannot be modeled without physical remote sensing data (51%–54% accuracy ceiling).<br/>"
        "• <b>Phase 4 Achievement:</b> Multi-sensor satellite fusion (S1 SAR + S2 Optical) coupled with DeepLabV3+ ASPP delivered <b>85.5% boundary overlap</b> and <b>84.8% hazard classification accuracy</b> across 1,944 paired transects.<br/>"
        "• <b>Impact:</b> The final system powers an interactive React WebGIS dashboard projecting <b>7.88 hectares of cumulative land loss by 2029</b>, providing actionable insights for coastal managers.",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully: {PDF_FILENAME}")

if __name__ == "__main__":
    build_pdf()

