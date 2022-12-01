let latexSolidColours = [
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
    { id: 15, name: 'Night Blue', type: 'Solid', pantone: '2748 C', cssColour: '#001871'},
    { id: 16, name: 'Ocher', type: 'Solid', pantone: '150 C', cssColour: '#FFB25B'},
    { id: 17, name: 'Orange', type: 'Solid', pantone: '1495 C', cssColour: '#FF8F1C'},
    { id: 18, name: 'Pink', type: 'Pastel', pantone: '1767 C', cssColour: '#FCAFC0'},
    { id: 19, name: 'Purple', type: 'Solid', pantone: '267 C', cssColour: '#5F259F'},
    { id: 20, name: 'Red', type: 'Solid', pantone: '186 C', cssColour: '#C8102E'},
    { id: 21, name: 'Royal Blue', type: 'Solid', pantone: '294 C', cssColour: '#002F6C'},
    { id: 22, name: 'Sky Blue', type: 'Pastel', pantone: '297 C', cssColour: '#71C5E8'},
    { id: 23, name: 'Turquoise', type: 'Solid', pantone: '3135 C', cssColour: '#008EAA'},
    { id: 24, name: 'Vanilla', type: 'Pastel', pantone: '7499 C', cssColour: '#F1E6B2'},
    { id: 25, name: 'White', type: 'Pastel', pantone: '000 C', cssColour: '#FFFFFF'},
    { id: 26, name: 'Lemon', type: 'Pastel', pantone: '107 C', cssColour: '#FBE122'},
    { id: 27, name: 'Warm Grey', type: 'Pastel', pantone: '', cssColour: '#b8b1aa'},
    { id: 28, name: 'Coral', type: 'Pastel', pantone: '', cssColour: '#f37b5e'},
    { id: 29, name: 'Grape', type: 'Pastel', pantone: '', cssColour: '#a92382'},
    { id: 30, name: 'Cyan', type: 'Pastel', pantone: '', cssColour: '#01b2e8'},
    { id: 31, name: 'Light Green', type: 'Pastel', pantone: '', cssColour: '#9ad4bc'},
]


let latexColours = [
    {
        id: 1,
        name: 'Solid Colour / Pastel 10"',
        sizes: [10],
        folder: 'solid_belbal',
        colours: latexSolidColours,
    },
    {
        id: 2,
        name: 'Solid Colour / Pastel 12"',
        sizes: [12],
        folder: 'solid_belbal',
        colours: latexSolidColours,
    },
    {
        id: 3,
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
            { id: 9, name: 'Green', type: 'Metallic', pantone: '3268 C', cssColour: '#00AB8E'},
            { id: 10, name: 'Ivory', type: 'Pearl', pantone: '614 C', cssColour: '#DCD59A' },
            { id: 11, name: 'Lavender', type: 'Pearl', pantone: '2635 C', cssColour: '#C5B4E3' },
            { id: 12, name: 'Light Green', type: 'Pearl', pantone: '3248 C', cssColour: '#6DCDB8' },
            { id: 13, name: 'Lime Green', type: 'Metallic', pantone: '361 C', cssColour: '#43B02A' },
            { id: 14, name: 'Orange', type: 'Metallic', pantone: '1585 C', cssColour: '#FF6A13' },
            { id: 15, name: 'Peach', type: 'Pearl', pantone: '156 C', cssColour: '#EFBE7D' },
            { id: 16, name: 'Pink', type: 'Pearl', pantone: '236 C', cssColour: '#F1A7DC' },
            { id: 17, name: 'Plum', type: 'Metallic', pantone: '4985 C', cssColour: '#874B52' },
            { id: 18, name: 'Purple', type: 'Metallic', pantone: '267 C', cssColour: '#5F259F' },
            { id: 19, name: 'Red', type: 'Metallic', pantone: '200 C', cssColour: '#BA0C2F' },
            { id: 20, name: 'Royal Blue', type: 'Metallic', pantone: '2945 C', cssColour: '#004C97' },
            { id: 21, name: 'Silver', type: 'Metallic', pantone: '422 C', cssColour: '#9EA2A2' },
            { id: 22, name: 'Sky Blue', type: 'Pearl', pantone: '283 C', cssColour: '#92C1E9' },
            { id: 23, name: 'White', type: 'Pearl', pantone: 'White C', cssColour: '#FFFFFF' },
            { id: 24, name: 'Yellow', type: 'Metallic', pantone: '101 C', cssColour: '#F7EA48' },
            { id: 25, name: 'Rose Gold', type: 'Metallic', pantone: '101 C', cssColour: '#e7a180' },

        ]
    },
    {
        id: 4,
        name: 'Crystal / Transparent 10"',
        folder: 'crystal_transparent_belbal',
        sizes: [10],
        colours: [
            { id: 1, name: 'Burgundy', type: 'Crystal', pantone: '208 C', cssColour: '#861F41' },
            { id: 2, name: 'Clear', type: 'Crystal', pantone: 'Clear', cssColour: '#FFFFFF' },
            { id: 3, name: 'Quartz Purple', type: 'Crystal', pantone: '2607 C', cssColour: '#500778' },
        ]
    },
    {
        id: 5,
        name: 'Crystal / Transparent 12"',
        folder: 'crystal_transparent_belbal',
        sizes: [12],
        colours: [
            { id: 1, name: 'Clear', type: 'Crystal', pantone: 'Clear', cssColour: '#FFFFFF' },
            { id: 2, name: 'Quartz Purple', type: 'Crystal', pantone: '2607 C', cssColour: '#500778' },
        ]
    }
];

export default latexColours;
