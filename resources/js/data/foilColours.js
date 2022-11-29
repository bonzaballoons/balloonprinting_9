let allColours = [
    { id: 1, name: 'Silver', pantone: '', cssColour: '#DCDCDC'},
    { id: 2, name: 'Gold', pantone: '', cssColour: '#E8B667'},
    { id: 3, name: 'Rose Gold', pantone: '', cssColour: '#FCEBDD'},
    { id: 4, name: 'Red', pantone: '', cssColour: '#ed2426'},
    { id: 5, name: 'Pink', pantone: '', cssColour: '#eaadcf'},
    { id: 6, name: 'Ivory', pantone: '', cssColour: '#eadac1'},
    { id: 7, name: 'Lime Green', pantone: '', cssColour: '#7ebe41'},
    { id: 8, name: 'Fuchsia', pantone: '', cssColour: '#c93892'},
    { id: 9, name: 'Purple', pantone: '', cssColour: '#6b479e'},
    { id: 10, name: 'White', pantone: '', cssColour: '#FFFFFF'},
    { id: 11, name: 'Green', pantone: '', cssColour: '#1a9e56'},
    { id: 12, name: 'Black', pantone: '', cssColour: '#010507'},
    { id: 13, name: 'Blue', pantone: '', cssColour: '#1282c5'},
    { id: 14, name: 'Light Blue', pantone: '', cssColour: '#bad1ed'},
    { id: 15, name: 'Yellow', pantone: '', cssColour: '#f5ef58'},
    { id: 16, name: 'Burgundy', pantone: '', cssColour: '#790d37'},
    { id: 17, name: 'Lavender', pantone: '', cssColour: '#9470af'},
    { id: 18, name: 'Orange', pantone: '', cssColour: '#f4783a'},
];

let coloursWithoutOrange = allColours.slice(0,-1);
let coloursWithoutOrangeAndLavender = allColours.slice(0,-2);

let foilColours = [
    {
        id: 1,
        name: '18 inch Hearts',
        folder: 'hearts',
        colours: coloursWithoutOrange
    },
    {
        id: 2,
        name: '18 inch Circles',
        folder: 'circles',
        colours: allColours
    },
    {
        id: 3,
        name: '20 inch Stars',
        folder: 'stars',
        colours: coloursWithoutOrangeAndLavender
    }
];

export default foilColours;
