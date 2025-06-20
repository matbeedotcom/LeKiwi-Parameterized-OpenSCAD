// Parameters
plate_diameter = 320;
plate_thickness = 5;
hole_diameter = 3.5; // ORP rules
hole_spacing = 20; // ORP rules
plate_resolution = 200; 
hole_resolution = 50; 
flatten_amount = 50; // Length of the flattened edge in mm's
start_position = 45; // Where the flattening begins
center_hole_width = 25;
center_hole_length = 45;
center_hole_corner_radius = 4; // Radius for the corners of the central hole

// Parameters for holes on flattened sides
side_hole_diameter = 3;
side_hole_spacing = 20; // For 2cm square motor mount pattern
side_hole_from_edge_distance = 8; // Distance from the flattened edge. Tune if conflicts with grid holes occur.
side_hole_inward_spacing = 20; // For 2cm square motor mount pattern

num_holes_x = floor(plate_diameter / hole_spacing);
num_holes_y = floor(plate_diameter / hole_spacing);

cut_distance_from_center = sqrt(pow(plate_diameter/2, 2) - pow(flatten_amount/2, 2));

// Define motor mount hole locations
motor_mount_holes = [
    for (a = [0, 120, 240])
        for (y_offset = [-side_hole_spacing/2, side_hole_spacing/2])
            for (x_offset_inward = [0, side_hole_inward_spacing])
                let (angle = a + start_position)
                [
                    (cut_distance_from_center - side_hole_from_edge_distance - x_offset_inward) * cos(angle) - y_offset * sin(angle),
                    (cut_distance_from_center - side_hole_from_edge_distance - x_offset_inward) * sin(angle) + y_offset * cos(angle)
                ]
];

// Define grid hole locations
grid_holes = [
    for (i = [-floor(num_holes_x/2):floor(num_holes_x/2)], j = [-floor(num_holes_y/2):floor(num_holes_y/2)])
        let (x = i * hole_spacing, y = j * hole_spacing)
        if (sqrt(x*x + y*y) + hole_diameter/2 <= plate_diameter/2)
            [x, y]
];

// Filter out grid holes that are too close to motor mount holes
filtered_grid_holes = [
    for (p_grid = grid_holes)
        if (min([for (p_motor = motor_mount_holes) norm(p_grid - p_motor)]) > 10)
            p_grid
];

difference() {
    difference() {
        cylinder(h = plate_thickness, d = plate_diameter, $fn=plate_resolution); // Base cylinder, z from 0 to plate_thickness
        
        // Flatten three sides
        for (a = [0, 120, 240]) {
            rotate([0, 0, a + start_position]) {
                size = plate_diameter * 2;
                translate([cut_distance_from_center, -size/2, -1])
                    cube([size, size, plate_thickness + 2]);
            }
        }
    }

    // Central rounded rectangular hole
    linear_extrude(height = plate_thickness*2, center = true) {
        minkowski() {
            square([
                center_hole_width - 2 * center_hole_corner_radius, 
                center_hole_length - 2 * center_hole_corner_radius
            ], center = true);
            circle(r = center_hole_corner_radius, $fn = hole_resolution);
        }
    }

    // Create motor mount holes
    for (p = motor_mount_holes) {
        translate([p.x, p.y, -1])
            cylinder(h = plate_thickness + 2, d = side_hole_diameter, $fn=hole_resolution);
    }

    // Create filtered grid holes
    for (p = filtered_grid_holes) {
        translate([p.x, p.y, -1])
            cylinder(h = plate_thickness + 2, d = hole_diameter, $fn=hole_resolution);
    }
}
