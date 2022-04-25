let latexColours = [
    {
        id: 1,
        name: 'Solid Colour / Pastel 10"',
        sizes: [10],
        folder: 'solid_belbal',
        colours: [
            { id: 1, name: 'Almond', type: 'Solid', pantone: '7530 C', cssColour: '#A39382'},
            { id: 2, name: 'Apple Green', type: 'Solid', pantone: '374 C', cssColour: '#C5E86C'},
            { id: 3, name: 'Black', type: 'Solid', pantone: 'Black C', cssColour: '#000000'},
            { id: 4, name: 'Blue', type: 'Solid', pantone: '2925 C', cssColour: '#009CDE'},
            { id: 5, name: 'Bright Green', type: 'Solid', pantone: '7481 C', cssColour: '#00B74F'},
            { id: 6, name: 'Bright Yellow', type: 'Solid', pantone: '114 C', cssColour: '#FBDD40'},
            { id: 7, name: 'Chocolate Brown', type: 'Solid', pantone: '7518 C', cssColour: '#6D4F47'},
            { id: 8, name: 'Cornflower Blue', type: 'Solid', pantone: '2727 C', cssColour: '#307FE2'},
            { id: 9, name: 'Feather Grey', type: 'Solid', pantone: '7545 C', cssColour: '#425563'},
            { id: 10, name: 'Forest Green', type: 'Solid', pantone: '3268 C', cssColour: '#00AB8E'},
            { id: 11, name: 'Fuchsia', type: 'Solid', pantone: '212 C', cssColour: '#F04E98'},
            { id: 12, name: 'Lavender', type: 'Pastel', pantone: '2645 C', cssColour: '#AD96DC'},
            { id: 13, name: 'Leaf Green', type: 'Solid', pantone: '349 C', cssColour: '#046A38'},
            { id: 14, name: 'Lime Green', type: 'Solid', pantone: '360 C', cssColour: '#6CC24A'},
            { id: 15, name: 'Maroon', type: 'Solid', pantone: '195 C', cssColour: '#782F40'},
            { id: 16, name: 'Night Blue', type: 'Solid', pantone: '2748 C', cssColour: '#001871'},
            { id: 17, name: 'Ocher', type: 'Solid', pantone: '150 C', cssColour: '#FFB25B'},
            { id: 18, name: 'Orange', type: 'Solid', pantone: '1495 C', cssColour: '#FF8F1C'},
            { id: 19, name: 'Pink', type: 'Pastel', pantone: '1767 C', cssColour: '#FCAFC0'},
            { id: 20, name: 'Purple', type: 'Solid', pantone: '267 C', cssColour: '#5F259F'},
            { id: 21, name: 'Red', type: 'Solid', pantone: '186 C', cssColour: '#C8102E'},
            { id: 22, name: 'Royal Blue', type: 'Solid', pantone: '294 C', cssColour: '#002F6C'},
            { id: 23, name: 'Sky Blue', type: 'Pastel', pantone: '297 C', cssColour: '#71C5E8'},
            { id: 24, name: 'Turquoise', type: 'Solid', pantone: '3135 C', cssColour: '#008EAA'},
            { id: 25, name: 'Vanilla', type: 'Pastel', pantone: '7499 C', cssColour: '#F1E6B2'},
            { id: 26, name: 'White', type: 'Pastel', pantone: '000 C', cssColour: '#FFFFFF'},
            { id: 27, name: 'Yellow', type: 'Pastel', pantone: '107 C', cssColour: '#FBE122'}
        ],
        assortments: [
            { name: 'Baby', assortment_ids: [12, 19, 23] },              // Lavender, Pink, Sky Blue
            { name: 'Bright', assortment_ids: [2, 6, 11, 12, 18, 23] },  // Apple Green, Bright Yellow, Fuchsia, Lavender, Orange, Sky Blue
            { name: 'Candyfloss', assortment_ids: [12, 19, 26] },        // Lavender, Pink, White
            { name: 'Circus', assortment_ids: [4, 11, 14] },             // Blue, Fuchsia, Lime Green
            { name: 'Deep', assortment_ids: [13, 15, 20, 21, 22] },      // Leaf Green, Maroon, Purple, Red, Royal Blue
            { name: 'Fashion', assortment_ids: [8, 11, 17, 24] },        // Cornflower Blue, Fuchsia, Ocher, Turquoise
            { name: 'Fire', assortment_ids: [6, 18, 21] },               // Bright Yellow, Orange, Red,
            { name: 'Night', assortment_ids: [3, 16, 20] },              // Black, Night Blue, Purple
            { name: 'Pastel', assortment_ids: [2, 12, 19, 23, 25] },     // Apple Green, Lavender, Pink, Sky Blue, Vanilla,
            { name: 'Rainbow', assortment_ids: [4, 6, 14, 18, 20, 21] }, // Blue, Bright Yellow, Lime Green, Orange, Purple, Red
            { name: 'Sea', assortment_ids: [4, 14, 24] },                // Blue, Lime Green, Turquoise
        ]
    },
    {
        id: 2,
        name: 'Solid Colour / Pastel 12"',
        sizes: [12],
        folder: 'solid_belbal',
        colours: [
            { id: 1, name: 'Almond', type: 'Solid', pantone: '7530 C', cssColour: '#A39382'},
            { id: 2, name: 'Apple Green', type: 'Solid', pantone: '374 C', cssColour: '#C5E86C'},
            { id: 3, name: 'Black', type: 'Solid', pantone: 'Black C', cssColour: '#000000'},
            { id: 4, name: 'Blue', type: 'Solid', pantone: '2925 C', cssColour: '#009CDE'},
            { id: 5, name: 'Bright Green', type: 'Solid', pantone: '7481 C', cssColour: '#00B74F'},
            { id: 6, name: 'Bright Yellow', type: 'Solid', pantone: '114 C', cssColour: '#FBDD40'},
            { id: 7, name: 'Chocolate Brown', type: 'Solid', pantone: '7518 C', cssColour: '#6D4F47'},
            { id: 8, name: 'Cornflower Blue', type: 'Solid', pantone: '2727 C', cssColour: '#307FE2'},
            { id: 9, name: 'Feather Grey', type: 'Solid', pantone: '7545 C', cssColour: '#425563'},
            { id: 10, name: 'Forest Green', type: 'Solid', pantone: '3268 C', cssColour: '#00AB8E'},
            { id: 11, name: 'Fuchsia', type: 'Solid', pantone: '212 C', cssColour: '#F04E98'},
            { id: 12, name: 'Lavender', type: 'Pastel', pantone: '2645 C', cssColour: '#AD96DC'},
            { id: 13, name: 'Leaf Green', type: 'Solid', pantone: '349 C', cssColour: '#046A38'},
            { id: 14, name: 'Lime Green', type: 'Solid', pantone: '360 C', cssColour: '#6CC24A'},
            { id: 15, name: 'Maroon', type: 'Solid', pantone: '195 C', cssColour: '#782F40'},
            { id: 16, name: 'Night Blue', type: 'Solid', pantone: '2748 C', cssColour: '#001871'},
            { id: 17, name: 'Ocher', type: 'Solid', pantone: '150 C', cssColour: '#FFB25B'},
            { id: 18, name: 'Orange', type: 'Solid', pantone: '1495 C', cssColour: '#FF8F1C'},
            { id: 19, name: 'Pink', type: 'Pastel', pantone: '1767 C', cssColour: '#FCAFC0'},
            { id: 20, name: 'Purple', type: 'Solid', pantone: '267 C', cssColour: '#5F259F'},
            { id: 21, name: 'Red', type: 'Solid', pantone: '186 C', cssColour: '#C8102E'},
            { id: 22, name: 'Royal Blue', type: 'Solid', pantone: '294 C', cssColour: '#002F6C'},
            { id: 23, name: 'Sky Blue', type: 'Pastel', pantone: '297 C', cssColour: '#71C5E8'},
            { id: 24, name: 'Turquoise', type: 'Solid', pantone: '3135 C', cssColour: '#008EAA'},
            { id: 25, name: 'Vanilla', type: 'Pastel', pantone: '7499 C', cssColour: '#F1E6B2'},
            { id: 26, name: 'White', type: 'Pastel', pantone: '000 C', cssColour: '#FFFFFF'},
            { id: 27, name: 'Yellow', type: 'Pastel', pantone: '107 C', cssColour: '#FBE122'}
        ],
        assortments: [
            { name: 'Baby', assortment_ids: [12, 19, 23] },              // Lavender, Pink, Sky Blue
            { name: 'Bright', assortment_ids: [2, 6, 11, 12, 18, 23] },  // Apple Green, Bright Yellow, Fuchsia, Lavender, Orange, Sky Blue
            { name: 'Candyfloss', assortment_ids: [12, 19, 26] },        // Lavender, Pink, White
            { name: 'Circus', assortment_ids: [4, 11, 14] },             // Blue, Fuchsia, Lime Green
            { name: 'Deep', assortment_ids: [13, 15, 20, 21, 22] },      // Leaf Green, Maroon, Purple, Red, Royal Blue
            { name: 'Fashion', assortment_ids: [8, 11, 17, 24] },        // Cornflower Blue, Fuchsia, Ocher, Turquoise
            { name: 'Fire', assortment_ids: [6, 18, 21] },               // Bright Yellow, Orange, Red,
            { name: 'Night', assortment_ids: [3, 16, 20] },              // Black, Night Blue, Purple
            { name: 'Pastel', assortment_ids: [2, 12, 19, 23, 25] },     // Apple Green, Lavender, Pink, Sky Blue, Vanilla,
            { name: 'Rainbow', assortment_ids: [4, 6, 14, 18, 20, 21] }, // Blue, Bright Yellow, Lime Green, Orange, Purple, Red
            { name: 'Sea', assortment_ids: [4, 14, 24] },                // Blue, Lime Green, Turquoise
        ]
    },
    {
        id: 3,
        name: 'Metallic / Pearlescent 10”',
        sizes: [10],
        folder: 'metallic_pearl_everts',
        colours: [
            { id: 1, name: 'Blue', type: 'Metallic', pantone: '3005 C', cssColour: '#0077C8' },
            { id: 2, name: 'Bright Blue', type: 'Pearlescent', pantone: '290 C', cssColour: '#B9D9EB' },
            { id: 3, name: 'Bright Green', type: 'Metallic', pantone: '382 C', cssColour: '#C4D600' },
            { id: 4, name: 'Bright Orange', type: 'Pearlescent', pantone: '162 C', cssColour: '#FFBE9F' },
            { id: 5, name: 'Bright Pink', type: 'Pearlescent', pantone: '1767 C', cssColour: '#FCAFC0' },
            { id: 6, name: 'Bright Violet', type: 'Pearlescent', pantone: '263 C', cssColour: '#D7C6E6' },
            { id: 7, name: 'Bright Yellow', type: 'Pearlescent', pantone: '607 C', cssColour: '#EBE49A' },
            { id: 8, name: 'Burgundy', type: 'Metallic', pantone: '209 C', cssColour: '#6F263D' },
            { id: 9, name: 'Deep Gold', type: 'Metallic', pantone: '110 C', cssColour: '#DAAA00' },
            { id: 10, name: 'Fuchsia', type: 'Metallic', pantone: '214 C', cssColour: '#CE0F69' },
            { id: 11, name: 'Green', type: 'Metallic', pantone: '355 C', cssColour: '#009639' },
            { id: 12, name: 'Orange', type: 'Metallic', pantone: '164 C', cssColour: '#FF7F41' },
            { id: 13, name: 'Purple', type: 'Metallic', pantone: '2607 C', cssColour: '#500778' },
            { id: 14, name: 'Red', type: 'Metallic', pantone: '192 C', cssColour: '#E40046' },
            { id: 15, name: 'Silver', type: 'Metallic', pantone: '421 C', cssColour: '#B2B4B2' },
            { id: 16, name: 'White', type: 'Pearlescent', pantone: 'White C', cssColour: '#FFFFFF' },
            { id: 17, name: 'Yellow', type: 'Metallic', pantone: '605 C', cssColour: '#E1CD00' }
        ],
        assortments: [
            { name: 'Baby', assortment_ids: [2, 5, 6] },                 // Bright Blue, Bright Pink, Bright Violet
            { name: 'Candyfloss', assortment_ids: [5, 6, 16] },          // Bright Pink, Bright Violet, White,
            { name: 'Cool', assortment_ids: [2, 6, 13] },                // Bright Blue, Bright Violet, Purple
            { name: 'Deep', assortment_ids: [1, 6, 11, 13]  },           // Blue, Burgundy, Green, Purple
            { name: 'Fire', assortment_ids: [12, 14, 17] },              // Orange, Red, Yellow
            { name: 'Hi Vis', assortment_ids: [3, 12, 17] },             // Bright Green, Orange, Yellow
            { name: 'Pastel Pearl', assortment_ids: [2, 4, 5, 6, 7] },   // Bright Blue, Bright Orange, Bright Pink, Bright Violet, Bright Yellow
            { name: 'Rainbow', assortment_ids: [1, 3, 12, 13, 14, 17] }, // Blue, Bright Green, Orange, Purple, Red, Yellow
            { name: 'Seaside', assortment_ids: [1, 11, 17] },            // Blue, Green, Yellow
            { name: 'Warm', assortment_ids: [8, 10, 14] }                // Burgundy, Fuchsia, Red
        ]
    },
    {
        id: 4,
        name: 'Metallic / Pearlescent 12”',
        sizes: [12],
        folder: 'metallic_belbal',
        colours: [
            { id: 1, name: 'Almond', type: 'Metallic', pantone: '7530 C', cssColour: '#A39382' },
            { id: 2, name: 'Apple Green', type: 'Metallic', pantone: '374 C', cssColour: '#C5E86C' },
            { id: 3, name: 'Black', type: 'Metallic', pantone: '433 C', cssColour: '#1D252D' },
            { id: 4, name: 'Blue', type: 'Metallic', pantone: '2935 C', cssColour: '#4D7AFF' },
            { id: 5, name: 'Copper', type: 'Metallic', pantone: '4995 C', cssColour: '#9C6169' },
            { id: 6, name: 'Cyan', type: 'Metallic', pantone: '313 C', cssColour: '#00A9CE' },
            { id: 7, name: 'Fuchsia', type: 'Metallic', pantone: '213 C', cssColour: '#E31C79' },
            { id: 8, name: 'Gold', type: 'Metallic', pantone: '7411 C', cssColour: '#E6A65D' },
            { id: 9, name: 'Green', type: 'Metallic', pantone: '3268 C', cssColour: '#00AB8E' },
            { id: 10, name: 'Ivory', type: 'Pearl', pantone: '614 C', cssColour: '#DCD59A' },
            { id: 11, name: 'Lavender', type: 'Pearl', pantone: '2635 C', cssColour: '#C5B4E3' },
            { id: 12, name: 'Lemon', type: 'Pearl', pantone: '100 C', cssColour: '#F6EB61' },
            { id: 13, name: 'Light Green', type: 'Pearl', pantone: '3248 C', cssColour: '#6DCDB8' },
            { id: 14, name: 'Lime Green', type: 'Metallic', pantone: '361 C', cssColour: '#43B02A' },
            // { id: 15, name: 'Midnight Blue', type: 'Metallic', pantone: '653 C', cssColour: '#326295' },
            { id: 16, name: 'Mustang Brown', type: 'Metallic', pantone: '411 C', cssColour: '#5E514D' },
            { id: 17, name: 'Orange', type: 'Metallic', pantone: '1585 C', cssColour: '#FF6A13' },
            { id: 18, name: 'Oxford Green', type: 'Metallic', pantone: '342 C', cssColour: '#006747' },
            { id: 19, name: 'Peach', type: 'Pearl', pantone: '156 C', cssColour: '#EFBE7D' },
            { id: 20, name: 'Pink', type: 'Pearl', pantone: '236 C', cssColour: '#F1A7DC' },
            { id: 21, name: 'Plum', type: 'Metallic', pantone: '4985 C', cssColour: '#874B52' },
            { id: 22, name: 'Purple', type: 'Metallic', pantone: '267 C', cssColour: '#5F259F' },
            { id: 23, name: 'Red', type: 'Metallic', pantone: '200 C', cssColour: '#BA0C2F' },
            { id: 24, name: 'Royal Blue', type: 'Metallic', pantone: '2945 C', cssColour: '#004C97' },
            { id: 25, name: 'Ruby Wine', type: 'Metallic', pantone: '4985 C', cssColour: '#874B52' },
            { id: 26, name: 'Silver', type: 'Metallic', pantone: '422 C', cssColour: '#9EA2A2' },
            { id: 27, name: 'Sky Blue', type: 'Pearl', pantone: '283 C', cssColour: '#92C1E9' },
            { id: 28, name: 'Turquoise', type: 'Metallic', pantone: '562 C', cssColour: '#006F62' },
            { id: 29, name: 'Violet', type: 'Metallic', pantone: '2726 C', cssColour: '#485CC7' },
            { id: 30, name: 'White', type: 'Pearl', pantone: 'White C', cssColour: '#FFFFFF' },
            { id: 31, name: 'Yellow', type: 'Metallic', pantone: '101 C', cssColour: '#F7EA48' },

        ],
        assortments: [
            { name: 'Baby', assortment_ids: [11, 20, 27] },                     // Lavender, Pink, Sky Blue
            { name: 'Bright', assortment_ids: [2, 7, 11, 17, 31] },             // Apple Green, Fuchsia, Lavender, Orange, Yellow
            { name: 'Candyfloss', assortment_ids: [7, 20, 30] },                // Fuchsia, Pink, White
            { name: 'Fire', assortment_ids: [17, 23, 31] },                     // Orange, Red, Yellow
            { name: 'Metals', assortment_ids: [5, 8, 26] },                     // Copper, Gold, Silver,
            // { name: 'Muted', assortment_ids: [1, 15, 18, 21] },                 // Almond, Midnight Blue, Oxford Green, Plum
            // { name: 'Night', assortment_ids: [3, 15, 29] },                     // Black, Midnight Blue, Violet
            { name: 'Pastel Pearl', assortment_ids: [11, 12, 13, 19, 20, 27] }, // Lavender, Lemon, Light Green, Peach, Pink, Sky Blue,
            { name: 'Primary', assortment_ids: [2, 6, 7, 17, 22, 31] },         // Apple Green, Cyan, Fuchsia, Orange, Purple, Yellow
            { name: 'Rainbow', assortment_ids: [4, 14, 17, 22, 23, 29, 31] },   // Blue, Lime Green, Orange, Purple, Red, Violet, Yellow
        ]
    },
    {
        id: 5,
        name: 'Crystal / Transparent 10"',
        folder: 'crystal_transparent_belbal',
        sizes: [10],
        colours: [
            { id: 1, name: 'Burgundy', type: 'Crystal', pantone: '208 C', cssColour: '#861F41' },
            { id: 2, name: 'Clear', type: 'Crystal', pantone: 'Clear', cssColour: '#FFFFFF' },
            { id: 3, name: 'Quartz Purple', type: 'Crystal', pantone: '2607 C', cssColour: '#500778' },
            { id: 4, name: 'Teal', type: 'Crystal', pantone: '3285 C', cssColour: '#009681' },
        ]
    },
    {
        id: 6,
        name: 'Crystal / Transparent 12"',
        folder: 'crystal_transparent_belbal',
        sizes: [12],
        colours: [
            { id: 1, name: 'Burgundy', type: 'Crystal', pantone: '208 C', cssColour: '#861F41' },
            { id: 2, name: 'Clear', type: 'Crystal', pantone: 'Clear', cssColour: '#FFFFFF' },
            { id: 3, name: 'Quartz Purple', type: 'Crystal', pantone: '2607 C', cssColour: '#500778' },
        ]
    }
];

export default latexColours;