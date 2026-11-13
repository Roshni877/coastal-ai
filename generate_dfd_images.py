import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle

# Set high-resolution plotting style
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 9

def draw_entity(ax, x, y, w, h, text, title="EXTERNAL ENTITY"):
    """Draws an external entity (double-bordered or rounded rectangle)."""
    # Outer box
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.04,rounding_size=0.08",
                         facecolor="#EFF6FF", edgecolor="#1D4ED8",
                         linewidth=2.2, zorder=3)
    ax.add_patch(box)
    
    # Inner border for classic DFD entity look
    inner_box = FancyBboxPatch((x - w/2 + 0.03, y - h/2 + 0.03), w - 0.06, h - 0.06,
                               boxstyle="round,pad=0.03,rounding_size=0.06",
                               facecolor="none", edgecolor="#93C5FD",
                               linewidth=1.2, linestyle="--", zorder=3)
    ax.add_patch(inner_box)
    
    ax.text(x, y + h*0.22, title, ha="center", va="center",
            fontsize=7.5, fontweight="bold", color="#1E40AF", zorder=4)
    ax.text(x, y - h*0.08, text, ha="center", va="center",
            fontsize=9, fontweight="bold", color="#0F172A", linespacing=1.25, zorder=4)

def draw_process(ax, x, y, r, proc_num, proc_name, script_name=""):
    """Draws a DFD process as a classic circle / rounded pill with division line."""
    # Process circle / rounded oval
    circle = Circle((x, y), r, facecolor="#F0FDF4", edgecolor="#15803D",
                    linewidth=2.2, zorder=3)
    ax.add_patch(circle)
    
    # Internal dividing line
    line_y = y + r * 0.35
    half_chord = (r**2 - (line_y - y)**2)**0.5
    ax.plot([x - half_chord, x + half_chord], [line_y, line_y],
            color="#86EFAC", linewidth=1.5, zorder=4)
    
    # Process number
    ax.text(x, y + r*0.62, proc_num, ha="center", va="center",
            fontsize=8.5, fontweight="bold", color="#166534", zorder=5)
    
    # Process title
    if script_name:
        ax.text(x, y - r*0.05, proc_name, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color="#064E3B", linespacing=1.2, zorder=5)
        ax.text(x, y - r*0.58, f"({script_name})", ha="center", va="center",
                fontsize=7, fontstyle="italic", color="#047857", zorder=5)
    else:
        ax.text(x, y - r*0.15, proc_name, ha="center", va="center",
                fontsize=9, fontweight="bold", color="#064E3B", linespacing=1.25, zorder=5)

def draw_datastore(ax, x, y, w, h, ds_id, ds_name):
    """Draws a Gane-Sarson / Yourdon open-ended rectangle data store."""
    # Data store fill
    rect = Rectangle((x - w/2, y - h/2), w, h,
                     facecolor="#FFFBEB", edgecolor="none", zorder=3)
    ax.add_patch(rect)
    
    # Top and bottom horizontal lines
    ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color="#B45309", linewidth=2.0, zorder=4)
    ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color="#B45309", linewidth=2.0, zorder=4)
    
    # Left vertical closed line
    ax.plot([x - w/2, x - w/2], [y - h/2, y + h/2], color="#B45309", linewidth=2.0, zorder=4)
    
    # ID vertical separator
    sep_x = x - w/2 + 0.42
    ax.plot([sep_x, sep_x], [y - h/2, y + h/2], color="#FBBF24", linewidth=1.5, zorder=4)
    
    # Store ID
    ax.text((x - w/2 + sep_x)/2, y, ds_id, ha="center", va="center",
            fontsize=8, fontweight="bold", color="#92400E", zorder=5)
    
    # Store Name
    ax.text((sep_x + x + w/2)/2, y, ds_name, ha="center", va="center",
            fontsize=8, fontweight="bold", color="#78350F", linespacing=1.2, zorder=5)

def draw_arrow(ax, p1, p2, text="", rad=0.0, label_offset=(0, 0), txt_pos=0.5):
    """Draws an annotated directional data flow curve."""
    arrow = FancyArrowPatch(p1, p2,
                            connectionstyle=f"arc3,rad={rad}",
                            arrowstyle='-|>,head_length=5,head_width=3.5',
                            color="#334155", linewidth=1.6, zorder=2)
    ax.add_patch(arrow)
    
    if text:
        # Approximate midpoint along arc
        mx = p1[0] * (1 - txt_pos) + p2[0] * txt_pos + label_offset[0]
        my = p1[1] * (1 - txt_pos) + p2[1] * txt_pos + label_offset[1]
        
        ax.text(mx, my, text, ha="center", va="center",
                fontsize=7.2, fontweight="medium", color="#1E293B",
                bbox=dict(boxstyle="square,pad=0.25", facecolor="#FFFFFF",
                          edgecolor="#CBD5E1", linewidth=0.8, alpha=0.92),
                zorder=6)

# ==============================================================================
# 1. GENERATE LEVEL 0 DFD (CONTEXT LEVEL)
# ==============================================================================
def create_level0_dfd(output_path):
    fig, ax = plt.subplots(figsize=(14, 8), dpi=300)
    ax.set_xlim(-1, 15)
    ax.set_ylim(-1, 9)
    ax.axis('off')
    
    # Title & Header
    ax.text(7, 8.5, "DATA FLOW DIAGRAM (DFD) - LEVEL 0: CONTEXT LEVEL",
            ha="center", va="center", fontsize=15, fontweight="bold", color="#0F172A")
    ax.text(7, 8.1, "Coastal Erosion Detection, Analysis, and Forecasting System",
            ha="center", va="center", fontsize=11, fontstyle="italic", color="#475569")
    
    # Process 0.0 (Center)
    draw_process(ax, 7.0, 4.0, 1.8, "0.0",
                 "Coastal Erosion\nMonitoring, ML\n& GIS System")
    
    # Entities
    # Entity 1: Satellites (Left Top)
    draw_entity(ax, 1.8, 6.0, 2.8, 1.4,
                "Satellite Data Providers\n(Sentinel-1 SAR &\nSentinel-2 MSI)",
                "EXTERNAL ENTITY: E1")
    
    # Entity 2: Oceanographic Data (Left Bottom)
    draw_entity(ax, 1.8, 2.0, 2.8, 1.4,
                "Oceanographic / Tidal\nObservation Sources\n(Tides & Beach Slopes)",
                "EXTERNAL ENTITY: E2")
    
    # Entity 3: Coastal Authorities / Planners (Right Middle)
    draw_entity(ax, 12.2, 4.0, 3.0, 1.8,
                "Coastal Planners, Engineers\n& Research Authorities\n(Web-GIS End Users)",
                "EXTERNAL ENTITY: E3")
    
    # Data Flows to/from Process 0.0
    # From E1 to P0
    draw_arrow(ax, (3.2, 6.0), (5.2, 4.8),
               "Raw 9-Band GeoTIFFs\n(Optical Reflectance + SAR Backscatter)",
               rad=-0.12, label_offset=(-0.1, 0.4), txt_pos=0.45)
    
    # From E2 to P0
    draw_arrow(ax, (3.2, 2.0), (5.2, 3.2),
               "Tidal Elevation (0.7m), MSL Datum (0.8m),\n& Beach Slope (tan β = 0.03)",
               rad=0.12, label_offset=(-0.1, -0.45), txt_pos=0.45)
    
    # From P0 to E3 (Multiple flows)
    # 1. Shoreline vectors
    draw_arrow(ax, (8.8, 4.7), (10.7, 4.7),
               "Extracted Shoreline Vectors\n(2020 & 2024 Shapefiles)",
               rad=-0.15, label_offset=(0, 0.4), txt_pos=0.5)
    
    # 2. Risk classification
    draw_arrow(ax, (8.8, 4.0), (10.7, 4.0),
               "XGBoost Erosion Risk Classes\n(Erosion, Stable, Accretion)",
               rad=0.0, label_offset=(0, 0.0), txt_pos=0.5)
    
    # 3. Forecasts
    draw_arrow(ax, (8.8, 3.3), (10.7, 3.3),
               "2027-2029 Shoreline Projections\n& Cumulative Land Loss (7.88 ha)",
               rad=0.15, label_offset=(0, -0.4), txt_pos=0.5)
    
    # User queries back to P0
    draw_arrow(ax, (10.7, 2.7), (8.2, 2.4),
               "Spatial Query & Transect Selection Requests",
               rad=0.25, label_offset=(0, -0.35), txt_pos=0.5)
    
    # Legend
    leg_x, leg_y = 7.0, 0.5
    leg_box = FancyBboxPatch((leg_x - 4.5, leg_y - 0.4), 9.0, 0.8,
                             boxstyle="round,pad=0.05,rounding_size=0.1",
                             facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.0)
    ax.add_patch(leg_box)
    ax.text(leg_x, leg_y + 0.15, "DFD Standard Notation: Gane-Sarson / Yourdon Reference",
            ha="center", va="center", fontsize=8, fontweight="bold", color="#334155")
    ax.text(leg_x, leg_y - 0.15,
            "[ Rectangles = External Entities ]   •   [ Circles = System Process ]   •   [ Directed Arrows = Data Flows ]",
            ha="center", va="center", fontsize=7.5, color="#64748B")
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Level 0 DFD saved to: {output_path}")

# ==============================================================================
# 2. GENERATE LEVEL 1 DFD (DETAILED PIPELINE)
# ==============================================================================
def create_level1_dfd(output_path):
    fig, ax = plt.subplots(figsize=(18, 12), dpi=300)
    ax.set_xlim(-1, 19)
    ax.set_ylim(-1, 13)
    ax.axis('off')
    
    # Title & Subtitle
    ax.text(9.0, 12.4, "DATA FLOW DIAGRAM (DFD) - LEVEL 1: COMPLETE SYSTEM ARCHITECTURE",
            ha="center", va="center", fontsize=16, fontweight="bold", color="#0F172A")
    ax.text(9.0, 12.0, "Detailed Functional Pipeline with Data Stores, ML Components, and GIS Web Dashboard",
            ha="center", va="center", fontsize=11, fontstyle="italic", color="#475569")
    
    # ==========================
    # ENTITIES
    # ==========================
    draw_entity(ax, 1.8, 10.5, 2.6, 1.2, "ESA Copernicus\n(Sentinel-1 & 2)", "ENTITY: E1")
    draw_entity(ax, 1.8, 5.0, 2.6, 1.2, "Oceanographic &\nBeach Slope Data", "ENTITY: E2")
    draw_entity(ax, 17.0, 4.5, 2.8, 1.6, "Coastal GIS Planners\n& Decision Makers\n(Web End Users)", "ENTITY: E3")
    
    # ==========================
    # PROCESSES
    # ==========================
    # P1: Preprocessing & Tiling
    draw_process(ax, 5.5, 10.5, 1.1, "1.0", "Data Ingestion &\nTensoring", "prepare_dataset.py")
    
    # P2: DeepLabV3+ Semantic Segmentation
    draw_process(ax, 11.5, 10.5, 1.1, "2.0", "DeepLabV3+ Shoreline\nSegmentation", "train & inference")
    
    # P3: Tidal Correction & EPR Rate Calculation
    draw_process(ax, 5.5, 5.0, 1.1, "3.0", "Tidal Correction &\nRate Calculation", "run_calculation.py")
    
    # P4: Environmental XGBoost Risk Classifier
    draw_process(ax, 11.5, 7.2, 1.1, "4.0", "Environmental ML\nRisk Classifier", "env_ml_analysis.py")
    
    # P5: Future Shoreline Forecasting
    draw_process(ax, 11.5, 2.8, 1.1, "5.0", "Shoreline Temporal\nForecasting", "forecast_shoreline.py")
    
    # P6: Web-GIS Interactive Visualizer
    draw_process(ax, 17.0, 8.5, 1.1, "6.0", "Interactive Web-GIS\nDashboard", "React Project Expo")
    
    # ==========================
    # DATA STORES
    # ==========================
    # D1: Raw Satellite GeoTIFFs
    draw_datastore(ax, 1.8, 8.2, 2.5, 0.7, "D1", "Raw Satellite\nGeoTIFFs (9 Bands)")
    
    # D2: Preprocessed Patch Tensors
    draw_datastore(ax, 8.5, 10.5, 2.3, 0.7, "D2", "256x256 Patch\nTensors (.npy)")
    
    # D3: Model Checkpoint Weights
    draw_datastore(ax, 14.8, 10.5, 2.4, 0.7, "D3", "Trained Weights\n(best_model.pth)")
    
    # D4: Extracted Shorelines
    draw_datastore(ax, 8.5, 8.2, 2.4, 0.7, "D4", "Shoreline Vectors\n(2020 & 2024 .shp)")
    
    # D5: Transect EPR Database
    draw_datastore(ax, 8.5, 5.0, 2.5, 0.7, "D5", "1,944 Transects\n& EPR Database")
    
    # D6: Forecasted Vectors & Risk Metrics
    draw_datastore(ax, 14.8, 5.0, 2.5, 0.7, "D6", "2027-2029 Vectors\n& Risk GeoJSON")
    
    # ==========================
    # DATA FLOWS (ARROWS)
    # ==========================
    # E1 to D1
    draw_arrow(ax, (1.8, 9.9), (1.8, 8.6), "Satellite Imagery Stream", rad=0.0, label_offset=(0.8, 0.0), txt_pos=0.5)
    
    # D1 to P1
    draw_arrow(ax, (2.9, 8.5), (4.5, 9.9), "Raw S1/S2 Bands", rad=-0.1, label_offset=(-0.2, 0.25), txt_pos=0.45)
    
    # P1 to D2
    draw_arrow(ax, (6.6, 10.5), (7.3, 10.5), "Normalized Patches", rad=0.0, label_offset=(0.0, 0.22), txt_pos=0.5)
    
    # D2 to P2
    draw_arrow(ax, (9.7, 10.5), (10.4, 10.5), "Training/Inference Tensors", rad=0.0, label_offset=(0.0, 0.22), txt_pos=0.5)
    
    # P2 to D3 and D3 to P2
    draw_arrow(ax, (12.6, 10.7), (13.6, 10.7), "Save Best Dice (0.8548)", rad=-0.1, label_offset=(0.0, 0.25), txt_pos=0.5)
    draw_arrow(ax, (13.6, 10.3), (12.6, 10.3), "Load Weights", rad=-0.1, label_offset=(0.0, -0.22), txt_pos=0.5)
    
    # P2 to D4
    draw_arrow(ax, (10.8, 9.6), (9.3, 8.6), "Stitched Contours & Vectors", rad=0.1, label_offset=(0.4, 0.2), txt_pos=0.5)
    
    # D4 to P3
    draw_arrow(ax, (7.8, 7.8), (6.2, 6.0), "2020 & 2024 Observed Lines", rad=-0.1, label_offset=(-0.4, 0.2), txt_pos=0.5)
    
    # E2 to P3
    draw_arrow(ax, (3.1, 5.0), (4.4, 5.0), "Htide, MSL & Beach Slope", rad=0.0, label_offset=(0.0, 0.22), txt_pos=0.5)
    
    # P3 to D5
    draw_arrow(ax, (6.6, 5.0), (7.2, 5.0), "Tide-Corrected EPR Rates", rad=0.0, label_offset=(0.0, 0.22), txt_pos=0.5)
    
    # D5 to P4
    draw_arrow(ax, (9.3, 5.4), (10.6, 6.5), "Transect Angles & EPR", rad=-0.1, label_offset=(-0.3, 0.25), txt_pos=0.45)
    
    # E2 to P4 (Wave, Tide, Monsoon)
    draw_arrow(ax, (2.8, 4.6), (10.5, 7.2), "Wave Height (Hs) & Monsoon Indices", rad=0.25, label_offset=(-1.2, 0.8), txt_pos=0.4)
    
    # P4 to D6
    draw_arrow(ax, (12.6, 7.0), (14.2, 5.5), "Predicted Vulnerability Classes", rad=-0.1, label_offset=(0.3, 0.25), txt_pos=0.5)
    
    # D5 to P5
    draw_arrow(ax, (9.3, 4.6), (10.6, 3.5), "Baseline Distance & EPR", rad=0.1, label_offset=(-0.3, -0.25), txt_pos=0.45)
    
    # P5 to D6
    draw_arrow(ax, (12.6, 3.0), (14.2, 4.5), "2027-2029 Shapefiles & Land Loss", rad=0.1, label_offset=(0.4, -0.25), txt_pos=0.5)
    
    # D4 to P6 (Observed Shorelines to Web-GIS)
    draw_arrow(ax, (9.7, 8.2), (15.9, 8.5), "Historic Baseline Vectors", rad=-0.18, label_offset=(0.0, 0.3), txt_pos=0.5)
    
    # D6 to P6 (Forecasts and ML to Web-GIS)
    draw_arrow(ax, (15.0, 5.4), (16.5, 7.5), "Vulnerability & Forecast Layers", rad=-0.1, label_offset=(0.4, -0.1), txt_pos=0.5)
    
    # P6 to E3
    draw_arrow(ax, (17.0, 7.4), (17.0, 5.3), "Interactive Maps, Erosion\nMetrics, Graphs & Reports", rad=0.0, label_offset=(1.2, 0.0), txt_pos=0.5)
    
    # E3 to P6
    draw_arrow(ax, (16.6, 5.3), (16.6, 7.4), "Transect Filter / Search", rad=0.0, label_offset=(-1.0, 0.0), txt_pos=0.5)
    
    # ==========================
    # LEGEND / FOOTER
    # ==========================
    leg_x, leg_y = 9.0, 0.6
    leg_box = FancyBboxPatch((leg_x - 7.5, leg_y - 0.45), 15.0, 0.9,
                             boxstyle="round,pad=0.05,rounding_size=0.1",
                             facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.1)
    ax.add_patch(leg_box)
    ax.text(leg_x, leg_y + 0.18, "Data Flow Diagram (Gane-Sarson & Yourdon Standard Notation)",
            ha="center", va="center", fontsize=9, fontweight="bold", color="#1E293B")
    ax.text(leg_x, leg_y - 0.16,
            "[ Rectangles = External Entities ]   •   [ Circles = Processes ]   •   [ Parallel Lines = Data Stores (D1-D6) ]   •   [ Arrows = Data Flows ]",
            ha="center", va="center", fontsize=8, color="#475569")
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Level 1 DFD saved to: {output_path}")

if __name__ == "__main__":
    out_dir = r"d:\data 5555\Final Soil"
    p0 = os.path.join(out_dir, "data_flow_diagram_level0.png")
    p1 = os.path.join(out_dir, "data_flow_diagram_level1.png")
    create_level0_dfd(p0)
    create_level1_dfd(p1)
