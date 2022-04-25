import latexColours from './data/latexColours';
import foilColours from './data/foilColours';

new Vue({

    el: '#colourCharts',

    data: {
        latexColours : latexColours,
        latexTypeSelected : latexColours[0],
        colourSelected : null,
        foilColours : foilColours,
        foilTypeSelected : foilColours[0],
        foilOrLatexSelected : 'latex'
    },


    methods: {

        showColourPreview(colour, foilOrLatex){

            this.colourSelected = colour;
            this.foilOrLatexSelected = foilOrLatex;
            $('#colourPreview').modal('show');
        }
    },

    computed: {

        displayImagePath(){

            if( this.foilOrLatexSelected === 'latex'){
                return 'https://bballoons.s3.amazonaws.com/printingColours/latexPrintingWizard/'+this.latexTypeSelected.folder+'/jpgs/'+_.snakeCase(this.colourSelected.name)+'.jpg';
            }
            return 'https://bballoons.s3.amazonaws.com/printingColours/foilPrintingWizard/'+this.foilTypeSelected.folder+'/'+_.camelCase(this.colourSelected.name)+'.jpg';
        }
    }

});