import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
from PIL import Image

def generate_unified_dfd(output_png, output_jpg):
    # Generous dimensions for clean spacing
    fig, ax = plt.subplots(figsize=(25, 15.5), dpi=300)
    ax.set_xlim(0, 25)
    ax.set_ylim(0, 15.5)
    ax.axis('off')
    
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')
    
    # Header & Banner
    banner = FancyBboxPatch((0.8, 13.9), 23.4, 1.25,
                            boxstyle="round,pad=0.1,rounding_size=0.15",
                            facecolor="#0F172A", edgecolor="#1E293B", linewidth=1.5, zorder=1)
    ax.add_patch(banner)
    
    ax.text(12.5, 14.65, "END-TO-END SYSTEM DATA FLOW DIAGRAM (DFD)",
            ha="center", va="center", fontsize=18, fontweight="bold", color="#FFFFFF", zorder=2)
    ax.text(12.5, 14.2, "Coastal Erosion Detection, Analysis, and Forecasting using Multi-Sensor Remote Sensing & Machine Learning (Udupi Coastline)",
            ha="center", va="center", fontsize=11, color="#94A3B8", zorder=2)
    
    # 5 Sequential Phase Columns
    stages = [
        {"x": 0.8, "w": 4.3, "title": "PHASE 1: INGESTION & TILING", "sub": "Raw Sentinel Acquisition & Preprocessing", "color": "#F8FAFC"},
        {"x": 5.4, "w": 4.6, "title": "PHASE 2: DEEP LEARNING SEGMENTATION", "sub": "DeepLabV3+ Boundary Extraction", "color": "#F0FDF4"},
        {"x": 10.3, "w": 4.6, "title": "PHASE 3: TIDAL & GEOMORPHOLOGY", "sub": "Tidal Correction & EPR Computation", "color": "#FEFCE8"},
        {"x": 15.2, "w": 4.6, "title": "PHASE 4: ML & FORECASTING", "sub": "XGBoost Classifier & 2027-2029 Projections", "color": "#F5F3FF"},
        {"x": 20.1, "w": 4.1, "title": "PHASE 5: WEB-GIS PLATFORM", "sub": "React Interactive Dashboard & Reports", "color": "#EFF6FF"}
    ]
    
    for st in stages:
        lane = FancyBboxPatch((st["x"], 1.35), st["w"], 12.2,
                              boxstyle="round,pad=0.08,rounding_size=0.12",
                              facecolor=st["color"], edgecolor="#CBD5E1",
                              linewidth=1.0, linestyle="--", alpha=0.75, zorder=1)
        ax.add_patch(lane)
        ax.text(st["x"] + st["w"]/2, 13.25, st["title"],
                ha="center", va="center", fontsize=8.5, fontweight="bold", color="#334155", zorder=2)
        ax.text(st["x"] + st["w"]/2, 12.95, st["sub"],
                ha="center", va="center", fontsize=7.2, fontstyle="italic", color="#64748B", zorder=2)

    # Drawing helpers
    def draw_entity(x, y, w, h, tag, name, details=""):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                             boxstyle="round,pad=0.04,rounding_size=0.1",
                             facecolor="#DBEAFE", edgecolor="#1D4ED8",
                             linewidth=2.0, zorder=4)
        ax.add_patch(box)
        inner = FancyBboxPatch((x - w/2 + 0.04, y - h/2 + 0.04), w - 0.08, h - 0.08,
                              boxstyle="round,pad=0.02,rounding_size=0.08",
                              facecolor="none", edgecolor="#3B82F6",
                              linewidth=1.0, linestyle=":", zorder=5)
        ax.add_patch(inner)
        ax.text(x, y + h*0.26, tag, ha="center", va="center",
                fontsize=7.5, fontweight="bold", color="#1E40AF", zorder=6)
        ax.text(x, y - (0.02 if not details else -h*0.02), name, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color="#0F172A", linespacing=1.2, zorder=6)
        if details:
            ax.text(x, y - h*0.28, details, ha="center", va="center",
                    fontsize=7, fontstyle="italic", color="#334155", zorder=6)

    def draw_process(x, y, w, h, p_num, p_title, script=""):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                             boxstyle="round,pad=0.06,rounding_size=0.45",
                             facecolor="#ECFDF5", edgecolor="#059669",
                             linewidth=2.2, zorder=4)
        ax.add_patch(box)
        sep_y = y + h * 0.22
        ax.plot([x - w/2 + 0.25, x + w/2 - 0.25], [sep_y, sep_y],
                color="#6EE7B7", linewidth=1.2, zorder=5)
        ax.text(x, y + h*0.35, f"PROCESS {p_num}", ha="center", va="center",
                fontsize=7.5, fontweight="bold", color="#047857", zorder=6)
        ax.text(x, y - h*0.02, p_title, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color="#064E3B", linespacing=1.2, zorder=6)
        if script:
            ax.text(x, y - h*0.32, f"[{script}]", ha="center", va="center",
                    fontsize=6.8, fontstyle="italic", color="#059669", zorder=6)

    def draw_store(x, y, w, h, d_num, d_name, d_format=""):
        rect = Rectangle((x - w/2, y - h/2), w, h,
                         facecolor="#FFFBEB", edgecolor="none", zorder=4)
        ax.add_patch(rect)
        ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color="#D97706", linewidth=2.0, zorder=5)
        ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color="#D97706", linewidth=2.0, zorder=5)
        ax.plot([x - w/2, x - w/2], [y - h/2, y + h/2], color="#D97706", linewidth=2.0, zorder=5)
        sep_x = x - w/2 + 0.65
        ax.plot([sep_x, sep_x], [y - h/2, y + h/2], color="#FBBF24", linewidth=1.5, zorder=5)
        
        ax.text((x - w/2 + sep_x)/2, y, d_num, ha="center", va="center",
                fontsize=8, fontweight="bold", color="#B45309", zorder=6)
        ax.text((sep_x + x + w/2)/2, y + (0.12 if d_format else 0), d_name, ha="center", va="center",
                fontsize=7.8, fontweight="bold", color="#78350F", linespacing=1.15, zorder=6)
        if d_format:
            ax.text((sep_x + x + w/2)/2, y - 0.2, f"Format: {d_format}", ha="center", va="center",
                    fontsize=6.8, color="#92400E", fontstyle="italic", zorder=6)

    def draw_flow(p1, p2, label="", rad=0.0, txt_x=None, txt_y=None):
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

    # ---------------------------------------------------------
    # PHASE 1: DATA INGESTION & PREPROCESSING
    # ---------------------------------------------------------
    draw_entity(2.95, 11.5, 3.5, 1.3, "EXTERNAL ENTITY: E1",
                "ESA Copernicus Constellation", "Sentinel-1 SAR & Sentinel-2 Optical")
    draw_store(2.95, 9.1, 3.5, 0.9, "D1", "Multi-Sensor Satellite Repository", "GeoTIFF (7 Opt + 2 SAR)")
    draw_process(2.95, 6.2, 3.5, 1.4, "1.0",
                 "Sliding Window Tiling\n& Band Normalization", "prepare_dataset.py")
    draw_store(2.95, 3.3, 3.5, 0.9, "D2", "Preprocessed 9-Band Tensors", "NumPy (.npy) 256x256")
    
    draw_flow((2.95, 10.85), (2.95, 9.55), "Level-1C & GRD Scenes", rad=0.0, txt_x=3.8, txt_y=10.2)
    draw_flow((2.95, 8.65), (2.95, 6.9), "Raw Reflectance & Backscatter Grids", rad=0.0, txt_x=3.85, txt_y=7.8)
    draw_flow((2.95, 5.5), (2.95, 3.75), "Normalized [0, 1] Patches\n(50% Overlap Stride)", rad=0.0, txt_x=3.85, txt_y=4.6)

    # ---------------------------------------------------------
    # PHASE 2: DEEP LEARNING SHORELINE SEGMENTATION
    # ---------------------------------------------------------
    draw_process(7.7, 10.1, 3.8, 1.4, "2.1",
                 "DeepLabV3+ Network Training\n(ResNet-34 + ASPP Module)", "train_deeplabv3.py")
    draw_store(7.7, 7.0, 3.8, 0.9, "D3", "Trained Segmentation Weights", "PyTorch (.pth) - Dice: 0.8548")
    draw_process(7.7, 4.1, 3.8, 1.4, "2.2",
                 "Contour Boundary Extraction\n& Overlap Stitching", "run_inference.py")
    draw_store(7.7, 2.0, 3.8, 0.75, "D4", "Extracted Coastline Vectors", "GIS Shapefiles (.shp, EPSG:32643)")
    
    draw_flow((4.45, 3.7), (6.1, 9.4), "80% Training Patches\n(9-Channel Tensors)", rad=-0.18, txt_x=5.2, txt_y=6.5)
    draw_flow((7.7, 9.4), (7.7, 7.45), "Best Validation Checkpoint", rad=0.0, txt_x=8.75, txt_y=8.4)
    draw_flow((7.7, 6.55), (7.7, 4.8), "Inference Weights & 2024 Scenes", rad=0.0, txt_x=8.95, txt_y=5.7)
    draw_flow((7.7, 3.4), (7.7, 2.38), "Water Mask & OpenCV Contours", rad=0.0, txt_x=8.95, txt_y=2.9)

    # ---------------------------------------------------------
    # PHASE 3: TIDAL & GEOMORPHOLOGY
    # ---------------------------------------------------------
    draw_entity(12.6, 11.5, 3.8, 1.3, "EXTERNAL ENTITY: E2",
                "Oceanographic & Tidal Datum", "Tide: 0.7m | MSL: 0.8m | Slope: 0.03")
    draw_process(12.6, 7.8, 3.8, 1.5, "3.0",
                 "Tidal Datum Shift Correction\n& End Point Rate (EPR)", "run_calculation.py")
    draw_store(12.6, 3.3, 3.8, 0.95, "D5", "1,944 Baseline Transects DB", "Historical EPR & Geometries")
    
    draw_flow((12.6, 10.85), (12.6, 8.55), "Horizontal Shift: Δx = (Htide - MSL)/tan β", rad=0.0, txt_x=12.6, txt_y=9.7)
    draw_flow((9.6, 2.2), (10.9, 7.2), "2020 & 2024 Observed Vectors", rad=-0.22, txt_x=10.0, txt_y=4.5)
    draw_flow((12.6, 7.05), (12.6, 3.78), "Computed EPR Rates (m/yr)\nPer 50m Coastline Transect", rad=0.0, txt_x=12.6, txt_y=5.4)

    # ---------------------------------------------------------
    # PHASE 4: ML & FORECASTING
    # ---------------------------------------------------------
    draw_process(17.5, 10.1, 3.8, 1.4, "4.0",
                 "XGBoost Environmental\nErosion Risk Classifier", "env_ml_analysis.py")
    draw_process(17.5, 6.0, 3.8, 1.4, "5.0",
                 "Shoreline Temporal Forecasting\n& Land Loss Quantification", "forecast_shoreline.py")
    draw_store(17.5, 2.0, 3.8, 0.9, "D6", "Forecasted Shorelines & Risk DB", "2027, 2028, 2029 GeoJSON & Stats")
    
    draw_flow((14.2, 3.7), (16.0, 9.4), "Transect Angles & Historic EPR", rad=-0.18, txt_x=14.9, txt_y=6.6)
    draw_flow((14.5, 11.5), (16.1, 10.7), "Wave Height (Hs) & Monsoon Indices", rad=0.12, txt_x=15.5, txt_y=11.5)
    draw_flow((14.5, 3.5), (15.8, 5.4), "Baseline Distances & EPR Trends", rad=-0.1, txt_x=14.9, txt_y=4.4)
    
    # P4 to D6 (Right curve)
    draw_flow((19.4, 9.8), (19.4, 2.45), "Vulnerability Classes\n(Erosion, Stable, Accretion)", rad=-0.2, txt_x=20.0, txt_y=6.5)
    
    # P5 to D6 (Direct flow)
    draw_flow((17.5, 5.3), (17.5, 2.45), "2027-2029 Projected Shorelines\n& Cumulative Land Loss (7.88 ha)", rad=0.0, txt_x=17.5, txt_y=3.85)

    # ---------------------------------------------------------
    # PHASE 5: WEB-GIS PLATFORM & STAKEHOLDER OUTPUTS
    # ---------------------------------------------------------
    draw_process(22.15, 9.0, 3.5, 1.5, "6.0",
                 "Interactive Web-GIS\nVisualization Dashboard", "REACT PROJECT EXPO")
    draw_entity(22.15, 3.0, 3.5, 1.5, "EXTERNAL ENTITY: E3",
                "Coastal Engineers, GIS Planners\n& Decision Makers", "Hazard Mitigation & Protection Placement")
    
    # D4 to P6 (Observed shorelines)
    draw_flow((9.6, 1.8), (20.5, 8.5), "Observed Shorelines (2020 & 2024)", rad=-0.28, txt_x=15.5, txt_y=1.55)
    
    # D6 to P6 (Forecasts and ML)
    draw_flow((18.8, 2.45), (21.0, 8.25), "GIS GeoJSON Vectors &\nRisk Classification Layers", rad=-0.16, txt_x=20.3, txt_y=5.2)
    
    # P6.0 to E3 (Visual Dashboard Outputs - Downward Arrow on Right)
    draw_flow((22.7, 8.25), (22.7, 3.75), "Interactive Leaflet Maps,\nEPR Charts & Risk Metrics", rad=0.0, txt_x=23.7, txt_y=6.0)
    
    # E3 to P6.0 (User Interaction - Upward Arrow on Left)
    draw_flow((21.5, 3.75), (21.5, 8.25), "Transect Filter &\nLayer Toggles", rad=0.0, txt_x=21.0, txt_y=6.0)

    # ---------------------------------------------------------
    # FOOTER & NOTATION LEGEND
    # ---------------------------------------------------------
    footer = FancyBboxPatch((0.8, 0.15), 23.4, 0.95,
                            boxstyle="round,pad=0.05,rounding_size=0.1",
                            facecolor="#0F172A", edgecolor="#334155", linewidth=1.2, zorder=2)
    ax.add_patch(footer)
    
    ax.text(12.5, 0.72, "DATA FLOW DIAGRAM (DFD) STANDARD NOTATION SPECIFICATION (GANE-SARSON & YOURDON)",
            ha="center", va="center", fontsize=8.5, fontweight="bold", color="#F8FAFC", zorder=3)
    ax.text(12.5, 0.4,
            "[ Rectangles = External Entities (E1 - E3) ]   •   [ Rounded Pills = Core Pipeline Processes (1.0 - 6.0) ]   •   [ Open Boxes = Persistent Data Stores (D1 - D6) ]   •   [ Vectors = Directed Data Flows ]",
            ha="center", va="center", fontsize=7.5, color="#94A3B8", zorder=3)

    plt.tight_layout()
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.close()
    
    img = Image.open(output_png).convert('RGB')
    img.save(output_jpg, "JPEG", quality=95)
    print(f"Successfully generated clean DFD:\n- PNG: {output_png}\n- JPG: {output_jpg}")

if __name__ == "__main__":
    out_dir = r"d:\data 5555\Final Soil"
    png_path = os.path.join(out_dir, "complete_project_data_flow_diagram.png")
    jpg_path = os.path.join(out_dir, "complete_project_data_flow_diagram.jpg")
    generate_unified_dfd(png_path, jpg_path)
