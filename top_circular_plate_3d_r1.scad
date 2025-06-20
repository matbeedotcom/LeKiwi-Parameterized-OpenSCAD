// Parameters
plate_diameter = 300;
plate_thickness = 8;
hole_diameter = 3.5; // ORP rules
hole_spacing = 20; // ORP rules
plate_resolution = 200; 
hole_resolution = 50; 
flatten_amount = 50; // Length of flat edge in mm
start_angle = 30; // Starting position of first flattened side
center_hole_width = 25;
center_hole_length = 45;
center_hole_corner_radius = 4;
side_hole_diameter = 3; // Diameter for side holes (3mm)
side_hole_spacing = 40; // 4cm apart
side_hole_edge_distance = 10; // 10mm from edge

// Calculate circumradius to achieve desired flat edge length
r_plate = plate_diameter / 2;
circumradius = 2 * sqrt(pow(r_plate, 2) - pow(flatten_amount/2, 2));

// Base plate with flattened sides
difference() {
    // Flattened circle: Intersection of cylinder and rotated triangle
    intersection() {
        // Base cylinder
        cylinder(h = plate_thickness, d = plate_diameter, $fn=plate_resolution);
        
        // Rotated equilateral triangle
        linear_extrude(plate_thickness) {
            angles = [0, 120, 240]; // Equilateral positions
            vertices = [for (theta = angles) 
                circumradius * [cos(start_angle + theta), sin(start_angle + theta)]];
            polygon(vertices);
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

    // Array of mounting holes
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
    
    // Additional holes on flattened sides (two per side)
    for (side = [0:2]) {
        // Calculate vertex positions for this side
        angle1 = start_angle + side * 120;
        angle2 = start_angle + (side + 1) * 120;
        v1 = circumradius * [cos(angle1), sin(angle1)];
        v2 = circumradius * [cos(angle2), sin(angle2)];
        
        // Calculate midpoint of the side
        mid = [(v1[0] + v2[0])/2, (v1[1] + v2[1])/2];
        
        // Calculate direction vectors
        dir_along = [v2[0] - v1[0], v2[1] - v1[1]];  // Along the side
        dir_inward = [-mid[0], -mid[1]];  // Inward perpendicular direction
        
        // Normalize vectors
        length_along = norm(dir_along);
        length_inward = norm(dir_inward);
        unit_along = [dir_along[0]/length_along, dir_along[1]/length_along];
        unit_inward = [dir_inward[0]/length_inward, dir_inward[1]/length_inward];
        
        // Calculate hole positions (10mm from edge, 4cm apart)
        offset_along = side_hole_spacing/2;
        offset_inward = side_hole_edge_distance;
        
        hole1 = [
            mid[0] + unit_inward[0]*offset_inward - unit_along[0]*offset_along, 
            mid[1] + unit_inward[1]*offset_inward - unit_along[1]*offset_along
        ];
        
        hole2 = [
            mid[0] + unit_inward[0]*offset_inward + unit_along[0]*offset_along, 
            mid[1] + unit_inward[1]*offset_inward + unit_along[1]*offset_along
        ];
        
        // Subtract holes
        translate([hole1[0], hole1[1], -1])
            cylinder(h = plate_thickness + 2, d = side_hole_diameter, $fn=hole_resolution);
        translate([hole2[0], hole2[1], -1])
            cylinder(h = plate_thickness + 2, d = side_hole_diameter, $fn=hole_resolution);
    }
}
