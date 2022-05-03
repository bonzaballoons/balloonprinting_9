<template>
    <div>
        <button v-if="!inline" id="open_uppy_modal" class="btn btn-primary mx-auto d-block">Upload Artwork</button>
        <div class="DashboardContainer" style="z-index: 10000; position: relative"></div>
    </div>
</template>

<script>
    const Uppy = require('@uppy/core');
    const Dashboard = require('@uppy/dashboard');
    const XHRUpload = require('@uppy/xhr-upload');

    export default {

        props : ['inline', 'inlineHeight'],

        mounted() {

            const uppy = new Uppy({
                id: 'uppyWizard',
                autoProceed: true,
                debug: true,
                allowMultipleUploads: true,
                restrictions: {
                    maxFileSize: false,
                    allowedFileTypes: ['image/*', '.pdf', '.eps', '.ai', '.svg', '.dxf']
                }
            });

            let dashboardSettings = {
                inline: this.inline,
                target: '.DashboardContainer',
                replaceTargetContent: true,
                showProgressDetails: true,
                proudlyDisplayPoweredByUppy: false,
                showLinkToFileUploadResult: false,
                showSelectedFiles: this.inline,
                trigger: '#open_uppy_modal',
                closeAfterFinish: true,
                browserBackButtonClose: true,
                closeModalOnClickOutside: true,
            };

            if(this.inline){
                dashboardSettings.height = this.inlineHeight;
            }

            uppy.use(Dashboard, dashboardSettings);

            uppy.use(XHRUpload, {
                endpoint: window.rootUrl+'artwork',
                headers: {
                    'X-CSRF-TOKEN': window.token
                },
                fieldName: 'file',
            });

            uppy.on('upload-success', (file, body) => {
                this.$emit('add-artwork', { name: file.name, s3Path: body.body.path } );
            });

        }
    }
</script>

<style src="../../../node_modules/@uppy/dashboard/dist/style.css"></style>
<style src="../../../node_modules/@uppy/core/dist/style.css"></style>
