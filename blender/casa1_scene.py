"""Terra Santa · Casa 1

Procedural Blender scene for the Casa 1 visual study. The received plan is kept
as a hidden, replaceable reference image; all modeled dimensions are conceptual
and intentionally do not claim construction scale.

Run with Blender 4.x:
    blender --background --python blender/casa1_scene.py
"""

from __future__ import annotations

import math
import os
from pathlib import Path

import bpy
from mathutils import Vector


SCRIPT_FILE = globals().get("__file__")
ROOT = Path(SCRIPT_FILE).resolve().parent if SCRIPT_FILE else Path.cwd()
RENDER_DIR = ROOT / "renders"
BLEND_PATH = ROOT / "casa1_terra_santa.blend"
PLAN_PATH = ROOT.parent / "src" / "assets" / "floor-plan-reference-provisional.png"


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def get_collection(name: str) -> bpy.types.Collection:
    collection = bpy.data.collections.get(name)
    if collection is None:
        collection = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(collection)
    return collection


def move_to(obj: bpy.types.Object, collection: bpy.types.Collection) -> bpy.types.Object:
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def make_material(name: str, color: tuple[float, float, float, float], roughness: float = 0.55, metallic: float = 0.0, transmission: float = 0.0) -> bpy.types.Material:
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    nodes = material.node_tree.nodes
    shader = nodes.get("Principled BSDF")
    if shader is not None:
        shader.inputs["Base Color"].default_value = color
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metallic
        if "Transmission Weight" in shader.inputs:
            shader.inputs["Transmission Weight"].default_value = transmission
        if "IOR" in shader.inputs:
            shader.inputs["IOR"].default_value = 1.45
    if transmission:
        try:
            material.surface_render_method = "DITHERED"
        except AttributeError:
            material.blend_method = "BLEND"
    return material


def add_box(name: str, size: tuple[float, float, float], location: tuple[float, float, float], material: bpy.types.Material, collection: bpy.types.Collection, bevel: float = 0.035) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = move_to(bpy.context.object, collection)
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Soft study edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    obj.data.materials.append(material)
    return obj


def add_cylinder(name: str, radius: float, depth: float, location: tuple[float, float, float], material: bpy.types.Material, collection: bpy.types.Collection, vertices: int = 12) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = move_to(bpy.context.object, collection)
    obj.name = name
    obj.data.materials.append(material)
    return obj


def add_sphere(name: str, scale: tuple[float, float, float], location: tuple[float, float, float], material: bpy.types.Material, collection: bpy.types.Collection) -> bpy.types.Object:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0, location=location)
    obj = move_to(bpy.context.object, collection)
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    return obj


def add_plan_underlay(image_path: Path, length: float, depth: float, collection: bpy.types.Collection) -> bpy.types.Object | None:
    """Place the received plan directly under the study model for visual traceability."""
    if not image_path.exists():
        return None
    image = bpy.data.images.load(str(image_path), check_existing=True)
    material = bpy.data.materials.get("TS Received Plan Underlay") or bpy.data.materials.new("TS Received Plan Underlay")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = image
    shader.inputs["Roughness"].default_value = 0.86
    shader.inputs["Specular IOR Level"].default_value = 0.18
    links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    links.new(texture.outputs["Alpha"], shader.inputs["Alpha"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    try:
        material.surface_render_method = "DITHERED"
    except AttributeError:
        material.blend_method = "BLEND"
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0.24))
    plane = move_to(bpy.context.object, collection)
    plane.name = "PLAN_UNDERLAY_RECEIVED"
    plane.dimensions = (length, depth, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    plane.data.materials.append(material)
    plane["source"] = "floor-plan-reference-provisional.png"
    plane["status"] = "visual underlay; no scale asserted"
    return plane


def add_window(name: str, x: float, y: float, width: float, height: float, material: bpy.types.Material, collections: dict[str, bpy.types.Collection]) -> None:
    add_box(name, (width, 0.06, height), (x, y, 1.65), material, collections["03_OPENINGS"], bevel=0.01)
    for offset in (-width * 0.32, 0, width * 0.32):
        add_box(f"{name}_mullion_{offset:.2f}", (0.045, 0.09, height + 0.08), (x + offset, y - 0.02, 1.65), materials["orange"], collections["03_OPENINGS"], bevel=0.008)


def point_camera(camera: bpy.types.Object, target: tuple[float, float, float]) -> None:
    direction = Vector(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def add_camera(name: str, location: tuple[float, float, float], target: tuple[float, float, float], lens: float, collection: bpy.types.Collection) -> bpy.types.Object:
    bpy.ops.object.camera_add(location=location)
    camera = move_to(bpy.context.object, collection)
    camera.name = name
    camera.data.lens = lens
    camera.data.sensor_width = 36
    point_camera(camera, target)
    return camera


def add_plant_cluster(prefix: str, x: float, y: float, collection: bpy.types.Collection, scale: float = 1.0) -> None:
    add_cylinder(f"{prefix}_stem", 0.06 * scale, 0.7 * scale, (x, y, 0.55 * scale), materials["plant_stem"], collection, vertices=8)
    for index, angle in enumerate((-0.9, -0.45, 0.0, 0.45, 0.9)):
        leaf_x = x + math.sin(angle) * 0.45 * scale
        leaf_y = y + math.cos(angle) * 0.25 * scale
        leaf = add_sphere(f"{prefix}_leaf_{index}", (0.22 * scale, 0.07 * scale, 0.6 * scale), (leaf_x, leaf_y, 0.95 * scale), materials["plant"], collection)
        leaf.rotation_euler[2] = angle


def add_bed(prefix: str, x: float, y: float, collection: bpy.types.Collection) -> None:
    add_box(f"{prefix}_base", (3.2, 2.2, 0.25), (x, y, 0.28), materials["wood"], collection)
    add_box(f"{prefix}_mattress", (3.0, 2.0, 0.22), (x, y, 0.52), materials["linen"], collection)
    add_box(f"{prefix}_headboard", (3.2, 0.12, 1.15), (x, y + 0.92, 1.0), materials["wood"], collection)
    add_box(f"{prefix}_throw", (2.8, 0.75, 0.06), (x, y - 0.5, 0.67), materials["clay"], collection, bevel=0.01)
    add_box(f"{prefix}_pillow_a", (0.85, 0.45, 0.09), (x - 0.72, y + 0.45, 0.7), materials["ivory"], collection, bevel=0.04)
    add_box(f"{prefix}_pillow_b", (0.85, 0.45, 0.09), (x + 0.72, y + 0.45, 0.7), materials["ivory"], collection, bevel=0.04)


def add_chair(prefix: str, x: float, y: float, rotation: float, collection: bpy.types.Collection) -> None:
    seat = add_box(f"{prefix}_seat", (0.55, 0.55, 0.12), (x, y, 0.55), materials["wood"], collection, bevel=0.025)
    back = add_box(f"{prefix}_back", (0.55, 0.1, 0.72), (x, y + 0.25, 0.9), materials["wood"], collection, bevel=0.02)
    seat.rotation_euler[2] = rotation
    back.rotation_euler[2] = rotation


def create_scene() -> None:
    global materials
    clear_scene()
    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1000
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.world.color = (0.92, 0.91, 0.88)
    scene["terra_santa_source"] = "received floor plan · conceptual interpretation"
    scene["terra_santa_status"] = "provisional · not to scale · room confirmations pending"

    collections = {name: get_collection(name) for name in (
        "00_REFERENCE", "01_FLOORPLAN", "02_STRUCTURE", "03_OPENINGS",
        "04_INTERIORS", "05_GARDEN", "06_ROOF_FRAME", "07_CAMERAS", "08_LIGHTS",
    )}
    global materials
    materials = {
        "ivory": make_material("TS Ivory", (0.82, 0.78, 0.68, 1), 0.62),
        "wall": make_material("TS White Wall", (0.93, 0.91, 0.84, 1), 0.72),
        "wall_shade": make_material("TS Graphite Shade", (0.26, 0.28, 0.27, 1), 0.82),
        "orange": make_material("TS Structural Orange", (0.91, 0.32, 0.035, 1), 0.46),
        "wood": make_material("TS Warm Wood", (0.43, 0.22, 0.08, 1), 0.58),
        "linen": make_material("TS Linen", (0.78, 0.70, 0.57, 1), 0.9),
        "clay": make_material("TS Clay Accent", (0.72, 0.38, 0.30, 1), 0.7),
        "glass_blue": make_material("TS Blue Glass", (0.16, 0.58, 0.71, 0.42), 0.16, transmission=0.7),
        "glass_pink": make_material("TS Pink Glass", (0.88, 0.44, 0.57, 0.42), 0.16, transmission=0.7),
        "sand": make_material("TS Sand", (0.66, 0.55, 0.37, 1), 0.9),
        "plant": make_material("TS Plant", (0.18, 0.40, 0.16, 1), 0.88),
        "plant_stem": make_material("TS Plant Stem", (0.22, 0.16, 0.08, 1), 0.9),
        "graphite": make_material("TS Graphite", (0.05, 0.055, 0.05, 1), 0.8),
    }

    # Conceptual envelope based on the horizontal footprint in the received plan.
    # Match the received plan's visible aspect ratio (2172:724 ≈ 3:1).
    length, depth, wall_height = 32.0, 10.67, 3.2
    x0, y0 = -length / 2, -depth / 2
    structure = collections["02_STRUCTURE"]
    openings = collections["03_OPENINGS"]
    interiors = collections["04_INTERIORS"]
    garden = collections["05_GARDEN"]
    roof_frame = collections["06_ROOF_FRAME"]

    add_plan_underlay(PLAN_PATH, length, depth, collections["01_FLOORPLAN"])

    add_box("Floor_Slab", (length, depth, 0.18), (0, 0, 0.0), materials["sand"], structure, bevel=0.02)
    add_box("Back_Wall", (length, 0.18, wall_height), (0, depth / 2, wall_height / 2), materials["wall"], structure)
    add_box("Left_Return", (0.18, depth, wall_height), (x0, 0, wall_height / 2), materials["wall"], structure)
    add_box("Right_Return", (0.18, depth, wall_height), (-x0, 0, wall_height / 2), materials["wall"], structure)

    # Internal partitions are studies, not a certified room schedule.
    # Major vertical wall lines traced from the received plan's visible breaks.
    for index, x in enumerate((-9.46, -6.15, -3.41, 0.36, 7.24)):
        add_box(f"Partition_{index + 1}", (0.16, depth - 0.4, wall_height), (x, 0, wall_height / 2), materials["wall"], structure)
    for index, (start, end) in enumerate(((-15.9, -9.46), (-6.15, -3.41), (0.36, 7.24))):
        add_box(f"Plan_Horizontal_Trace_{index + 1}", (end - start, 0.16, wall_height), ((start + end) / 2, -0.42, wall_height / 2), materials["wall"], structure)
    for index, (x, width) in enumerate(((-6.0, 2.0), (-0.2, 2.3), (8.2, 3.3), (14.5, 2.0))):
        add_box(f"Front_Pier_{index + 1}", (width, 0.18, wall_height), (x, y0, wall_height / 2), materials["wall"], structure)

    # Floor studies echo the plan's private, social and planted zones.
    add_box("Private_Floor", (14.0, depth - 0.5, 0.06), (-8.0, 0, 0.16), materials["wood"], interiors, bevel=0.01)
    add_box("Social_Floor", (10.5, depth - 0.5, 0.06), (4.2, 0, 0.16), materials["ivory"], interiors, bevel=0.01)
    add_box("Service_Floor", (5.5, depth - 0.5, 0.06), (12.0, 0, 0.16), materials["wall"], interiors, bevel=0.01)

    add_bed("Bedroom_A", -10.8, 0.6, interiors)
    add_bed("Bedroom_B", -3.8, -0.2, interiors)
    add_box("Kitchen_Counter", (4.9, 0.65, 0.95), (8.0, 2.6, 0.72), materials["wood"], interiors)
    add_box("Kitchen_Island", (3.1, 0.85, 0.82), (7.2, -1.0, 0.67), materials["wood"], interiors)
    add_box("Dining_Table", (2.5, 1.15, 0.12), (3.2, 0.0, 1.05), materials["wood"], interiors, bevel=0.04)
    for index, (x, y, rotation) in enumerate(((1.8, -0.9, 0), (4.5, -0.9, 0), (1.8, 0.9, math.pi), (4.5, 0.9, math.pi))):
        add_chair(f"Dining_Chair_{index + 1}", x, y, rotation, interiors)
    add_box("Sofa_Seat", (3.2, 0.9, 0.45), (1.2, -2.65, 0.53), materials["ivory"], interiors, bevel=0.1)
    add_box("Sofa_Back", (3.2, 0.18, 0.9), (1.2, -3.0, 1.0), materials["wall"], interiors, bevel=0.08)
    add_box("Coffee_Table", (1.45, 0.9, 0.15), (1.2, -1.7, 0.55), materials["wood"], interiors, bevel=0.12)
    add_box("Bath_Counter", (1.6, 0.55, 0.75), (-13.6, 2.3, 0.65), materials["sand"], interiors)
    add_box("Bath_Glass", (0.06, 2.0, 2.2), (-12.1, 2.3, 1.35), materials["glass_blue"], interiors, bevel=0.01)

    # Openings and colored line-art accents along the long front facade.
    for index, (x, width, material) in enumerate((( -12.0, 2.6, materials["glass_blue"]), (-7.0, 2.0, materials["glass_pink"]), (-2.4, 2.2, materials["glass_blue"]), (2.4, 3.5, materials["glass_blue"]), (8.2, 3.0, materials["glass_pink"]))):
        add_window(f"Front_Glazing_{index + 1}", x, y0 - 0.025, width, 2.2, material, collections)
    for index, x in enumerate((-13.4, -8.0, -3.5, 0.0, 5.0, 9.8, 14.0)):
        add_box(f"Orange_Column_{index + 1}", (0.11, 0.22, wall_height + 0.25), (x, y0 - 0.08, (wall_height + 0.25) / 2), materials["orange"], openings, bevel=0.01)

    # The orange roof frame stays open so the interior and the plan logic remain visible.
    add_box("Roof_Frame_Front", (length + 0.35, 0.14, 0.18), (0, y0 - 0.12, wall_height + 0.25), materials["orange"], roof_frame, bevel=0.02)
    add_box("Roof_Frame_Back", (length + 0.35, 0.14, 0.18), (0, depth / 2 + 0.12, wall_height + 0.25), materials["orange"], roof_frame, bevel=0.02)
    for index, x in enumerate((-length / 2, -8.5, -1.3, 7.0, 12.4, length / 2)):
        add_box(f"Roof_Frame_Beam_{index + 1}", (0.12, depth + 0.25, 0.16), (x, 0, wall_height + 0.25), materials["orange"], roof_frame, bevel=0.015)

    # Planted end and terrace: simple, readable low-poly studies.
    add_box("Garden_Bed", (6.0, depth - 0.45, 0.12), (13.0, 0, 0.2), materials["plant"], garden, bevel=0.02)
    add_box("Terrace_Bed", (4.2, 2.0, 0.08), (-13.0, -3.0, 0.18), materials["sand"], garden, bevel=0.02)
    for index, x in enumerate((10.9, 12.3, 13.7, 15.0)):
        add_plant_cluster(f"Garden_Plant_{index + 1}", x, -1.4 + (index % 2) * 2.2, garden, 1.0 + (index % 2) * 0.2)
    for index, x in enumerate((-14.6, -13.0, -11.4)):
        add_plant_cluster(f"Terrace_Plant_{index + 1}", x, -3.0, garden, 0.75)

    # Reference image stays in the file for traceability, but never renders.
    if PLAN_PATH.exists():
        image = bpy.data.images.load(str(PLAN_PATH), check_existing=True)
        bpy.ops.object.empty_add(type="IMAGE", location=(0, 0, -0.15))
        reference = move_to(bpy.context.object, collections["00_REFERENCE"])
        reference.name = "RECEIVED_PLAN_REFERENCE"
        reference.data = image
        reference.empty_display_size = 32.0
        reference.color[3] = 0.28
        reference.hide_render = True
        reference.hide_viewport = True

    # Camera and light rig for an editorial, plan-first presentation.
    hero = add_camera("CAM_HERO", (29, -31, 24), (0, 0, 0.9), 52, collections["07_CAMERAS"])
    plan = add_camera("CAM_PLAN", (0, 0, 42), (0, 0, 0), 54, collections["07_CAMERAS"])
    social = add_camera("CAM_SOCIAL", (12, -17, 8), (5, 0, 1.1), 47, collections["07_CAMERAS"])
    scene.camera = hero
    scene["camera_plan"] = plan.name
    scene["camera_social"] = social.name

    bpy.ops.object.light_add(type="AREA", location=(4, -10, 22))
    key = move_to(bpy.context.object, collections["08_LIGHTS"])
    key.name = "KEY_SUNLIGHT"
    key.data.energy = 1700
    key.data.shape = "DISK"
    key.data.size = 12
    point_camera(key, (0, 0, 0))
    bpy.ops.object.light_add(type="AREA", location=(-19, 10, 8))
    fill = move_to(bpy.context.object, collections["08_LIGHTS"])
    fill.name = "FILL_SOFT"
    fill.data.energy = 620
    fill.data.size = 10
    point_camera(fill, (-5, 0, 1))

    RENDER_DIR.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(RENDER_DIR / "casa1-hero.png")
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    create_scene()
