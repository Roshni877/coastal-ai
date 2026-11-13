import os
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
from PIL import Image

plt.rcParams['font.family'] = 'DejaVu Sans'

# ==============================================================================
# COMMON DRAWING PRIMITIVES
# ==============================================================================
def draw_entity(ax, x, y, w, h, tag, name, details=""):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.04,rounding_size=0.08",
                         facecolor="#DBEAFE", edgecolor="#1D4ED8", linewidth=2.0, zorder=4)
    ax.add_patch(box)
    inner = FancyBboxPatch((x - w/2 + 0.04, y - h/2 + 0.04), w - 0.08, h - 0.08,
                           boxstyle="round,pad=0.02,rounding_size=0.06",
                           facecolor="none", edgecolor="#3B82F6", linewidth=1.0, linestyle=":", zorder=5)
    ax.add_patch(inner)
    ax.text(x, y + h*0.25, tag, ha="center", va="center", fontsize=7.5, fontweight="bold", color="#1E40AF", zorder=6)
    ax.text(x, y - (0.02 if not details else -h*0.02), name, ha="center", va="center", fontsize=8.5, fontweight="bold", color="#0F172A", linespacing=1.2, zorder=6)
    if details:
        ax.text(x, y - h*0.28, details, ha="center", va="center", fontsize=7, fontstyle="italic", color="#334155", zorder=6)

def draw_process(ax, x, y, w, h, p_num, p_title, script=""):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.06,rounding_size=0.45",
                         facecolor="#ECFDF5", edgecolor="#059669", linewidth=2.0, zorder=4)
    ax.add_patch(box)
    sep_y = y + h * 0.22
    ax.plot([x - w/2 + 0.2, x + w/2 - 0.2], [sep_y, sep_y], color="#6EE7B7", linewidth=1.2, zorder=5)
    ax.text(x, y + h*0.35, f"PROCESS {p_num}", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#047857", zorder=6)
    ax.text(x, y - h*0.02, p_title, ha="center", va="center", fontsize=8.2, fontweight="bold", color="#064E3B", linespacing=1.2, zorder=6)
    if script:
        ax.text(x, y - h*0.32, f"[{script}]", ha="center", va="center", fontsize=6.8, fontstyle="italic", color="#059669", zorder=6)

def draw_store(ax, x, y, w, h, d_num, d_name, d_format=""):
    rect = Rectangle((x - w/2, y - h/2), w, h, facecolor="#FFFBEB", edgecolor="none", zorder=4)
    ax.add_patch(rect)
    # Fully closed outer rectangle borders (top, bottom, left, right)
    ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color="#D97706", linewidth=1.8, zorder=5)
    ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color="#D97706", linewidth=1.8, zorder=5)
    ax.plot([x - w/2, x - w/2], [y - h/2, y + h/2], color="#D97706", linewidth=1.8, zorder=5)
    ax.plot([x + w/2, x + w/2], [y - h/2, y + h/2], color="#D97706", linewidth=1.8, zorder=5)
    sep_x = x - w/2 + 0.55
    ax.plot([sep_x, sep_x], [y - h/2, y + h/2], color="#FBBF24", linewidth=1.4, zorder=5)
    ax.text((x - w/2 + sep_x)/2, y, d_num, ha="center", va="center", fontsize=8, fontweight="bold", color="#B45309", zorder=6)
    ax.text((sep_x + x + w/2)/2, y + (0.1 if d_format else 0), d_name, ha="center", va="center", fontsize=7.8, fontweight="bold", color="#78350F", linespacing=1.15, zorder=6)
    if d_format:
        ax.text((sep_x + x + w/2)/2, y - 0.18, f"Format: {d_format}", ha="center", va="center", fontsize=6.8, color="#92400E", fontstyle="italic", zorder=6)

def draw_flow(ax, p1, p2, label="", rad=0.0, txt_x=None, txt_y=None):
    arrow = FancyArrowPatch(p1, p2,
                            connectionstyle=f"arc3,rad={rad}",
                            arrowstyle='-|>,head_length=5,head_width=3.5',
                            color="#1E293B", linewidth=1.5, zorder=3)
    ax.add_patch(arrow)
    if label:
        mx = (p1[0] + p2[0]) / 2 if txt_x is None else txt_x
        my = (p1[1] + p2[1]) / 2 if txt_y is None else txt_y
        ax.text(mx, my, label, ha="center", va="center",
                fontsize=7, fontweight="bold", color="#1E293B",
                bbox=dict(boxstyle="square,pad=0.25", facecolor="#FFFFFF",
                          edgecolor="#94A3B8", linewidth=0.75, alpha=0.96),
                zorder=7)


# ==============================================================================
# OPTION A: 3-PART DIVISION (RECOMMENDED FOR MODULARITY)
# ==============================================================================
def create_part1_dfd(output_png, output_jpg):
    """PART 1: Data Ingestion & Deep Learning Shoreline Segmentation"""
    fig, ax = plt.subplots(figsize=(18, 10.5), dpi=300)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    banner = FancyBboxPatch((0.6, 9.2), 16.8, 0.95, boxstyle="round,pad=0.08,rounding_size=0.12",
                            facecolor="#0F172A", edgecolor="#1E293B", linewidth=1.5, zorder=1)
    ax.add_patch(banner)
    ax.text(9.0, 9.8, "DATA FLOW DIAGRAM (DFD) — PART 1 OF 3: INGESTION & DEEP LEARNING SEGMENTATION",
            ha="center", va="center", fontsize=12.2, fontweight="bold", color="#FFFFFF", zorder=2)
    ax.text(9.0, 9.42, "Phase 1: Multi-Sensor Satellite Preprocessing   |   Phase 2: DeepLabV3+ (ResNet-34) Shoreline Extraction",
            ha="center", va="center", fontsize=9.2, color="#94A3B8", zorder=2)

    # Lanes
    lane1 = FancyBboxPatch((0.6, 1.1), 7.8, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane1)
    ax.text(4.5, 8.6, "PHASE 1: INGESTION & PREPROCESSING", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#334155", zorder=2)

    lane2 = FancyBboxPatch((9.6, 1.1), 7.8, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F0FDF4", edgecolor="#A7F3D0", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane2)
    ax.text(13.5, 8.6, "PHASE 2: DEEP LEARNING SEGMENTATION", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#166534", zorder=2)

    # Nodes Phase 1
    draw_entity(ax, 4.5, 7.5, 3.8, 1.25, "EXTERNAL ENTITY: E1", "ESA Copernicus Constellation", "Sentinel-1 SAR & Sentinel-2 Optical")
    draw_store(ax, 4.5, 5.5, 3.8, 0.85, "D1", "Multi-Sensor Satellite Repository", "GeoTIFF (7 Optical + 2 SAR Bands)")
    draw_process(ax, 4.5, 3.6, 3.8, 1.35, "1.0", "Sliding Window Tiling\n& Band Normalization", "prepare_dataset.py")
    draw_store(ax, 4.5, 1.8, 3.8, 0.85, "D2", "Preprocessed 9-Band Tensors", "NumPy (.npy) 256x256 Patches")

    # Phase 1 Flows (labels placed cleanly on left)
    draw_flow(ax, (4.5, 6.87), (4.5, 5.93), "Level-1C & GRD Scenes", txt_x=2.7, txt_y=6.4)
    draw_flow(ax, (4.5, 5.07), (4.5, 4.28), "Raw Reflectance & Backscatter Grids", txt_x=2.4, txt_y=4.68)
    draw_flow(ax, (4.5, 2.92), (4.5, 2.23), "Normalized [0, 1] Patches\n(50% Stride)", txt_x=2.5, txt_y=2.58)

    # Nodes Phase 2
    draw_process(ax, 13.5, 7.3, 4.0, 1.35, "2.1", "DeepLabV3+ Network Training\n(ResNet-34 + ASPP Module)", "train_deeplabv3.py")
    draw_store(ax, 13.5, 5.3, 4.0, 0.85, "D3", "Trained Segmentation Weights", "PyTorch (.pth) - Dice: 0.8548")
    draw_process(ax, 13.5, 3.5, 4.0, 1.35, "2.2", "Contour Boundary Extraction\n& Overlap Stitching", "run_inference.py")
    draw_store(ax, 13.5, 1.8, 4.0, 0.85, "D4", "Extracted Coastline Vectors", "GIS Shapefiles (.shp, EPSG:32643)")

    # Inter-phase flow (D2 -> Process 2.1 & Process 2.2)
    draw_flow(ax, (6.4, 2.0), (11.5, 7.3), "80% Training Patches (9-Channel)", rad=-0.12, txt_x=9.0, txt_y=4.9)
    draw_flow(ax, (6.4, 1.7), (11.5, 3.5), "2020 & 2024 Unseen Scenes", rad=0.08, txt_x=8.9, txt_y=2.7)

    # Phase 2 Flows (labels placed on right)
    draw_flow(ax, (13.5, 6.62), (13.5, 5.73), "Best Validation Checkpoint", txt_x=15.1, txt_y=6.18)
    draw_flow(ax, (13.5, 4.87), (13.5, 4.18), "Inference Weights", txt_x=14.8, txt_y=4.52)
    draw_flow(ax, (13.5, 2.82), (13.5, 2.23), "Water Mask & OpenCV Contours", txt_x=15.2, txt_y=2.52)

    # Hand-off badge
    out_badge = FancyBboxPatch((11.5, 0.35), 4.2, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                               facecolor="#FEF3C7", edgecolor="#D97706", linewidth=1.2, zorder=3)
    ax.add_patch(out_badge)
    ax.text(13.6, 0.62, "HANDOFF TO PART 2: D4 Coastline Vectors", ha="center", va="center",
            fontsize=7.5, fontweight="bold", color="#92400E", zorder=4)

    # Footer
    footer = FancyBboxPatch((0.6, 0.35), 10.5, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                            facecolor="#0F172A", edgecolor="#334155", linewidth=1.0, zorder=2)
    ax.add_patch(footer)
    ax.text(5.85, 0.62, "[E1 = Satellite Source]   •   [Processes 1.0, 2.1, 2.2]   •   [Stores D1, D2, D3, D4]",
            ha="center", va="center", fontsize=7.5, color="#94A3B8", zorder=3)

    plt.tight_layout()
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.close()
    Image.open(output_png).convert('RGB').save(output_jpg, "JPEG", quality=95)


def create_part2_dfd(output_png, output_jpg):
    """PART 2: Coastal Geomorphology, EPR Rates & Machine Learning Forecasting"""
    fig, ax = plt.subplots(figsize=(18, 10.5), dpi=300)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    banner = FancyBboxPatch((0.6, 9.2), 16.8, 0.95, boxstyle="round,pad=0.08,rounding_size=0.12",
                            facecolor="#0F172A", edgecolor="#1E293B", linewidth=1.5, zorder=1)
    ax.add_patch(banner)
    ax.text(9.0, 9.8, "DATA FLOW DIAGRAM (DFD) — PART 2 OF 3: TIDAL GEOMORPHOLOGY & ML FORECASTING",
            ha="center", va="center", fontsize=12.2, fontweight="bold", color="#FFFFFF", zorder=2)
    ax.text(9.0, 9.42, "Phase 3: Tidal Datum Correction & EPR Calculation   |   Phase 4: XGBoost Risk Classifier & 2027-2029 Projections",
            ha="center", va="center", fontsize=9.2, color="#94A3B8", zorder=2)

    # Lanes
    lane1 = FancyBboxPatch((0.6, 1.1), 7.8, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#FEFCE8", edgecolor="#FDE047", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane1)
    ax.text(4.5, 8.6, "PHASE 3: TIDAL & GEOMORPHOLOGY", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#854D0E", zorder=2)

    lane2 = FancyBboxPatch((9.6, 1.1), 7.8, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F5F3FF", edgecolor="#DDD6FE", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane2)
    ax.text(13.5, 8.6, "PHASE 4: ML RISK & FORECASTING", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#5B21B6", zorder=2)

    # Phase 3 Nodes
    draw_store(ax, 4.5, 7.6, 4.0, 0.85, "D4", "Extracted Coastline Vectors", "2020 & 2024 Shapefiles (EPSG:32643)")
    draw_entity(ax, 4.5, 5.6, 4.0, 1.25, "EXTERNAL ENTITY: E2", "Oceanographic & Tidal Datum", "Tide: 0.7m | MSL: 0.8m | tan β: 0.03")
    draw_process(ax, 4.5, 3.4, 4.0, 1.45, "3.0", "Tidal Datum Shift Correction\n& End Point Rate (EPR)", "run_calculation.py")
    draw_store(ax, 4.5, 1.7, 4.0, 0.85, "D5", "1,944 Baseline Transects DB", "Historical EPR & Geometries")

    # Phase 3 Flows (Clean bypass around E2 on the left)
    draw_flow(ax, (2.5, 7.6), (2.5, 3.4), "Observed 2020 & 2024 Vectors", rad=-0.42, txt_x=1.1, txt_y=5.5)
    draw_flow(ax, (4.5, 4.97), (4.5, 4.13), "Δx = (Htide - MSL)/tan β", txt_x=5.9, txt_y=4.55)
    draw_flow(ax, (4.5, 2.67), (4.5, 2.13), "Computed EPR (m/yr) per 50m Transect", txt_x=6.2, txt_y=2.4)

    # Phase 4 Nodes
    draw_process(ax, 13.5, 7.3, 4.0, 1.35, "4.0", "XGBoost Environmental\nErosion Risk Classifier", "env_ml_analysis.py")
    draw_process(ax, 13.5, 4.5, 4.0, 1.35, "5.0", "Shoreline Temporal Forecasting\n& Land Loss Quantification", "forecast_shoreline.py")
    draw_store(ax, 13.5, 1.8, 4.0, 0.9, "D6", "Forecasted Shorelines & Risk DB", "2027, 2028, 2029 GeoJSON & Stats")

    # Inter-phase Flows
    draw_flow(ax, (6.5, 5.8), (11.5, 7.3), "Wave Height (Hs) & Monsoon Indices", rad=-0.08, txt_x=9.0, txt_y=6.9)
    draw_flow(ax, (6.5, 1.9), (11.5, 6.7), "Historical EPR & Transect Angles", rad=-0.15, txt_x=9.0, txt_y=5.0)
    draw_flow(ax, (6.5, 1.7), (11.5, 4.2), "Baseline Distances & EPR Trends", rad=0.08, txt_x=8.9, txt_y=2.8)

    # Phase 4 Internal Flows
    draw_flow(ax, (15.5, 6.62), (15.5, 2.25), "Erosion Vulnerability Classes\n(High Erosion, Stable, Accretion)", rad=-0.18, txt_x=16.8, txt_y=4.5)
    draw_flow(ax, (13.5, 3.82), (13.5, 2.25), "2027-2029 Projected Shorelines\n& Cumulative Land Loss (7.88 ha)", txt_x=13.5, txt_y=3.0)

    # Hand-off badge
    out_badge = FancyBboxPatch((11.5, 0.35), 4.2, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                               facecolor="#FEF3C7", edgecolor="#D97706", linewidth=1.2, zorder=3)
    ax.add_patch(out_badge)
    ax.text(13.6, 0.62, "HANDOFF TO PART 3: D4, D5, D6 to Web-GIS", ha="center", va="center",
            fontsize=7.5, fontweight="bold", color="#92400E", zorder=4)

    # Footer
    footer = FancyBboxPatch((0.6, 0.35), 10.5, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                            facecolor="#0F172A", edgecolor="#334155", linewidth=1.0, zorder=2)
    ax.add_patch(footer)
    ax.text(5.85, 0.62, "[E2 = Oceanographic Datum]   •   [Processes 3.0, 4.0, 5.0]   •   [Stores D4, D5, D6]",
            ha="center", va="center", fontsize=7.5, color="#94A3B8", zorder=3)

    plt.tight_layout()
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.close()
    Image.open(output_png).convert('RGB').save(output_jpg, "JPEG", quality=95)


def create_part3_dfd(output_png, output_jpg):
    """PART 3: Web-GIS Interactive Platform & Stakeholder Decision Support"""
    fig, ax = plt.subplots(figsize=(18, 10.5), dpi=300)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    banner = FancyBboxPatch((0.6, 9.2), 16.8, 0.95, boxstyle="round,pad=0.08,rounding_size=0.12",
                            facecolor="#0F172A", edgecolor="#1E293B", linewidth=1.5, zorder=1)
    ax.add_patch(banner)
    ax.text(9.0, 9.8, "DATA FLOW DIAGRAM (DFD) — PART 3 OF 3: INTERACTIVE WEB-GIS & DECISION SUPPORT",
            ha="center", va="center", fontsize=12.2, fontweight="bold", color="#FFFFFF", zorder=2)
    ax.text(9.0, 9.42, "Phase 5: React Web-GIS Dashboard   |   Spatial Analytics, Hazard Mapping & Stakeholder Interactivity",
            ha="center", va="center", fontsize=9.2, color="#94A3B8", zorder=2)

    # Lanes
    lane1 = FancyBboxPatch((0.6, 1.1), 5.2, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane1)
    ax.text(3.2, 8.6, "DATA STORES (INPUTS)", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#334155", zorder=2)

    lane2 = FancyBboxPatch((6.3, 1.1), 5.4, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#EFF6FF", edgecolor="#93C5FD", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane2)
    ax.text(9.0, 8.6, "WEB-GIS CORE ENGINE", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#1D4ED8", zorder=2)

    lane3 = FancyBboxPatch((12.2, 1.1), 5.2, 7.8, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F0FDF4", edgecolor="#86EFAC", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane3)
    ax.text(14.8, 8.6, "STAKEHOLDERS & DECISIONS", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#15803D", zorder=2)

    # Lane 1 Nodes
    draw_store(ax, 3.2, 7.2, 3.8, 0.95, "D4", "Extracted Coastline Vectors", "2020 & 2024 Shapefiles")
    draw_store(ax, 3.2, 4.8, 3.8, 0.95, "D5", "1,944 Baseline Transects DB", "Historical EPR & Station Rates")
    draw_store(ax, 3.2, 2.4, 3.8, 0.95, "D6", "Forecasted Shorelines & Risk DB", "2027-2029 GeoJSON & Stats")

    # Lane 2 Node
    draw_process(ax, 9.0, 5.0, 4.4, 2.2, "6.0",
                 "Interactive Web-GIS\nVisualization Platform\n(React + Vite + Leaflet)",
                 "REACT PROJECT EXPO")

    # Feeds to Process 6.0
    draw_flow(ax, (5.1, 7.2), (7.0, 5.8), "Historical Vectors", rad=0.08, txt_x=6.2, txt_y=6.7)
    draw_flow(ax, (5.1, 4.8), (6.8, 4.9), "Transect EPR Metrics", rad=0.0, txt_x=6.0, txt_y=5.15)
    draw_flow(ax, (5.1, 2.4), (7.0, 4.2), "Forecasts & Risk Classes", rad=-0.08, txt_x=6.2, txt_y=3.25)

    # Lane 3 Node
    draw_entity(ax, 14.8, 5.0, 4.2, 2.0, "EXTERNAL ENTITY: E3",
                "Coastal Engineers, Planners\n& Decision Makers",
                "Hazard Mitigation, Seawalls & Policy")

    # Two-way interactions
    draw_flow(ax, (11.2, 5.7), (12.7, 5.7), "Interactive Maps, EPR Charts\n& Vulnerability Heatmaps", rad=-0.12, txt_x=12.0, txt_y=6.4)
    draw_flow(ax, (12.7, 4.3), (11.2, 4.3), "Spatial Filtering, Transect Inspection\n& Layer Toggles", rad=-0.12, txt_x=12.0, txt_y=3.6)

    # Footer
    footer = FancyBboxPatch((0.6, 0.35), 16.8, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                            facecolor="#0F172A", edgecolor="#334155", linewidth=1.0, zorder=2)
    ax.add_patch(footer)
    ax.text(9.0, 0.62,
            "[Stores D4, D5, D6 = Upstream Pipeline Feeds]   •   [Process 6.0 = React Web-GIS Engine]   •   [Entity E3 = Decision Makers & Planners]",
            ha="center", va="center", fontsize=7.5, color="#94A3B8", zorder=3)

    plt.tight_layout()
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.close()
    Image.open(output_png).convert('RGB').save(output_jpg, "JPEG", quality=95)


# ==============================================================================
# OPTION B: 2-PART DIVISION (FOR DUAL-SLIDE / TWO-PAGE SPREADS)
# ==============================================================================
def create_2part_A_dfd(output_png, output_jpg):
    """2-PART SPLIT - PART A: Remote Sensing & Deep Learning Shoreline Extraction (Phases 1 & 2)"""
    create_part1_dfd(output_png, output_jpg)

def create_2part_B_dfd(output_png, output_jpg):
    """2-PART SPLIT - PART B: Coastal Analytics, Forecasting & Web-GIS Decision Support (Phases 3, 4 & 5)"""
    fig, ax = plt.subplots(figsize=(22, 12), dpi=300)
    ax.set_xlim(0, 22)
    ax.set_ylim(0, 12)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    banner = FancyBboxPatch((0.6, 10.6), 20.8, 1.0, boxstyle="round,pad=0.08,rounding_size=0.12",
                            facecolor="#0F172A", edgecolor="#1E293B", linewidth=1.5, zorder=1)
    ax.add_patch(banner)
    ax.text(11.0, 11.25, "DATA FLOW DIAGRAM (DFD) — PART 2 OF 2: GEOMORPHOLOGY, FORECASTING & WEB-GIS",
            ha="center", va="center", fontsize=14, fontweight="bold", color="#FFFFFF", zorder=2)
    ax.text(11.0, 10.85, "Phase 3: Tidal Datum & EPR   |   Phase 4: XGBoost Risk & Temporal Projections   |   Phase 5: Web-GIS Platform",
            ha="center", va="center", fontsize=10, color="#94A3B8", zorder=2)

    # 3 Lanes
    lane1 = FancyBboxPatch((0.6, 1.1), 6.5, 9.2, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#FEFCE8", edgecolor="#FDE047", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane1)
    ax.text(3.85, 9.9, "PHASE 3: TIDAL GEOMORPHOLOGY", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#854D0E", zorder=2)

    lane2 = FancyBboxPatch((7.6, 1.1), 6.8, 9.2, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#F5F3FF", edgecolor="#DDD6FE", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane2)
    ax.text(11.0, 9.9, "PHASE 4: ML & FORECASTING", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#5B21B6", zorder=2)

    lane3 = FancyBboxPatch((14.9, 1.1), 6.5, 9.2, boxstyle="round,pad=0.06,rounding_size=0.12",
                           facecolor="#EFF6FF", edgecolor="#93C5FD", linewidth=1.0, linestyle="--", alpha=0.8, zorder=1)
    ax.add_patch(lane3)
    ax.text(18.15, 9.9, "PHASE 5: WEB-GIS PLATFORM", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#1D4ED8", zorder=2)

    # Phase 3 Nodes
    draw_store(ax, 3.85, 8.6, 4.2, 0.85, "D4", "Extracted Coastline Vectors", "From Part 1: 2020 & 2024 .shp")
    draw_entity(ax, 3.85, 6.5, 4.2, 1.3, "EXTERNAL ENTITY: E2", "Oceanographic & Tidal Datum", "Tide: 0.7m | MSL: 0.8m | tan β: 0.03")
    draw_process(ax, 3.85, 4.1, 4.2, 1.45, "3.0", "Tidal Datum Shift Correction\n& End Point Rate (EPR)", "run_calculation.py")
    draw_store(ax, 3.85, 2.0, 4.2, 0.85, "D5", "1,944 Baseline Transects DB", "Historical EPR & Geometries")

    # Phase 3 Flows (Clean bypass around E2 on the left)
    draw_flow(ax, (1.75, 8.6), (1.75, 4.1), "Observed Vectors", rad=-0.42, txt_x=0.85, txt_y=6.5)
    draw_flow(ax, (3.85, 5.85), (3.85, 4.83), "Δx = (Htide - MSL)/tan β", txt_x=3.85, txt_y=5.35)
    draw_flow(ax, (3.85, 3.37), (3.85, 2.43), "Computed EPR Rates (m/yr)", txt_x=3.85, txt_y=2.9)

    # Phase 4 Nodes
    draw_process(ax, 11.0, 8.2, 4.2, 1.4, "4.0", "XGBoost Environmental\nErosion Risk Classifier", "env_ml_analysis.py")
    draw_process(ax, 11.0, 5.1, 4.2, 1.4, "5.0", "Shoreline Temporal Forecasting\n& Land Loss Quantification", "forecast_shoreline.py")
    draw_store(ax, 11.0, 2.0, 4.2, 0.9, "D6", "Forecasted Shorelines & Risk DB", "2027, 2028, 2029 GeoJSON & Stats")

    # Feeds into Phase 4
    draw_flow(ax, (5.95, 6.6), (8.9, 8.2), "Wave Height & Monsoon Indices", rad=-0.08, txt_x=7.4, txt_y=7.8)
    draw_flow(ax, (5.95, 2.2), (8.9, 7.6), "Historical EPR & Transects", rad=-0.16, txt_x=7.4, txt_y=5.8)
    draw_flow(ax, (5.95, 2.0), (8.9, 4.8), "Baseline Distances & Trends", rad=0.08, txt_x=7.4, txt_y=3.4)

    # Phase 4 Internal Flows
    draw_flow(ax, (13.1, 7.5), (13.1, 2.45), "Vulnerability Classes", rad=-0.16, txt_x=13.8, txt_y=5.2)
    draw_flow(ax, (11.0, 4.4), (11.0, 2.45), "2027-2029 Projections\n& Land Loss (7.88 ha)", txt_x=11.0, txt_y=3.4)

    # Phase 5 Nodes
    draw_process(ax, 18.15, 6.8, 4.2, 1.6, "6.0", "Interactive Web-GIS\nVisualization Dashboard", "REACT PROJECT EXPO")
    draw_entity(ax, 18.15, 2.4, 4.2, 1.6, "EXTERNAL ENTITY: E3", "Coastal Engineers, GIS Planners\n& Decision Makers", "Hazard Mitigation & Protection")

    # Feeds into Phase 5
    # D6 to Process 6.0
    draw_flow(ax, (13.1, 2.2), (16.05, 6.4), "Forecasts & Risk GeoJSON", rad=-0.12, txt_x=14.5, txt_y=4.5)
    # Direct D4 feed along top clear corridor to P6
    draw_flow(ax, (5.95, 8.8), (16.05, 7.4), "Historical Vectors (2020 & 2024)", rad=0.22, txt_x=11.0, txt_y=9.5)

    # Process 6.0 <-> E3
    draw_flow(ax, (17.5, 6.0), (17.5, 3.2), "Interactive Maps, EPR Charts\n& Heatmaps", txt_x=16.3, txt_y=4.6)
    draw_flow(ax, (18.8, 3.2), (18.8, 6.0), "Layer Toggles & Queries", txt_x=20.0, txt_y=4.6)

    # Footer
    footer = FancyBboxPatch((0.6, 0.35), 20.8, 0.55, boxstyle="round,pad=0.04,rounding_size=0.08",
                            facecolor="#0F172A", edgecolor="#334155", linewidth=1.0, zorder=2)
    ax.add_patch(footer)
    ax.text(11.0, 0.62,
            "[Entities E2, E3]   •   [Processes 3.0, 4.0, 5.0, 6.0]   •   [Stores D4, D5, D6]   •   Standard Gane-Sarson / Yourdon DFD Notation",
            ha="center", va="center", fontsize=8.0, color="#94A3B8", zorder=3)

    plt.tight_layout()
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.close()
    Image.open(output_png).convert('RGB').save(output_jpg, "JPEG", quality=95)


if __name__ == "__main__":
    out_dir = r"d:\data 5555\Final Soil"

    print("Generating Part 1 -> image1.png / image1.jpg...")
    create_part1_dfd(
        os.path.join(out_dir, "image1.png"),
        os.path.join(out_dir, "image1.jpg")
    )
    
    print("Generating Part 2 -> image2.png / image2.jpg...")
    create_part2_dfd(
        os.path.join(out_dir, "image2.png"),
        os.path.join(out_dir, "image2.jpg")
    )
    
    print("Generating Part 3 -> image3.png / image3.jpg...")
    create_part3_dfd(
        os.path.join(out_dir, "image3.png"),
        os.path.join(out_dir, "image3.jpg")
    )

    print("\nAll 3 DFD parts with closed boxes successfully saved as image1, image2, and image3 at 300 DPI!")
