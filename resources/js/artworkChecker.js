const bus = new Vue();
import uppy from './components/uppy.vue';

new Vue({

    el: '#artworkChecker',

    components: {uppy},

    data: {
        name: '',
        email: '',
        uploadedArtwork: [],
        artworkLoading: false,
        artworkCheckSentSuccess: false
    },

    created() {
        bus.$on('addArtwork', this.addArtwork);
    },

    methods: {

        addArtwork(result){

            this.uploadedArtwork.push(result);
        },

        removeArtwork(index){

            this.uploadedArtwork.splice(index, 1);
        },

        sendArtworkCheck() {

            this.sendingArtworkCheck = true;

            let data = {
                name: this.name,
                email: this.email,
                uploadedArtwork: this.uploadedArtwork,
            };

            axios.post('/api/printingCheckArtwork', data).then( response => {

                this.sendingArtworkCheck = false;
                this.artworkCheckSentSuccess = true;
                toastr.success('Thank you. Your artwork has been sent and we\'ll get back to you as soon as possible');

            }).catch( () => {

                this.sendingArtworkCheck = false;
                toastr.error('Unfortunately there\'s been a problem sending your artwork to our team. Please check your internet connection and try again or send your artwork to info@balloonprinting.co.uk and our team will get back to you.');
            });
        }
    }
});