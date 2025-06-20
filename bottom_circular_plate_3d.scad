// Parameters
plate_diameter = 290;
plate_thickness = 8;
hole_diameter = 3.5; // ORP rules
hole_spacing = 20; // ORP rules
plate_resolution = 200; 
hole_resolution = 50; 
flatten_amount = 50; // Length of the flattened edge in mm's
start_position = 0; // Where the flattening begins
center_hole_width = 25;
center_hole_length = 45;
center_hole_corner_radius = 4; // Radius for the corners of the central hole

// Parameters for holes on flattened sides
side_hole_diameter = 3;
side_hole_spacing = 40;
side_hole_from_edge_distance = 10; // Distance from the flattened edge. Tune if conflicts with grid holes occur.

num_holes_x = floor(plate_diameter / hole_spacing);
num_holes_y = floor(plate_diameter / hole_spacing);

cut_distance_from_center = sqrt(pow(plate_diameter/2, 2) - pow(flatten_amount/2, 2));

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

    // Holes along flattened sides
    for (a = [0, 120, 240]) {
        rotate([0, 0, a + start_position]) {
            for (y_offset = [-side_hole_spacing/2, side_hole_spacing/2]) {
                translate([cut_distance_from_center - side_hole_from_edge_distance, y_offset, -1])
                    cylinder(h = plate_thickness + 2, d = side_hole_diameter, $fn=hole_resolution);
            }
        }
    }

    for (i = [-floor(plate_diameter / hole_spacing / 2):floor(plate_diameter / hole_spacing / 2)]) {
        for (j = [-floor(plate_diameter / hole_spacing / 2):floor(plate_diameter / hole_spacing / 2)]) {
            x = i * hole_spacing;
            y = j * hole_spacing;
            if (sqrt(x*x + y*y) + hole_diameter/2 <= plate_diameter/2) {
                translate([x, y, -1])
                    cylinder(h = plate_thickness + 2, d = hole_diameter, $fn=hole_resolution);
            }
        }
    }
}
