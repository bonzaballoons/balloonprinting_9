<step title="Artwork">

    <div class="row">
        <div class="col-lg-6">

            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Upload your artwork by clicking the button below</strong>
            </h5>

            <uppy @add-artwork="addArtwork" :inline="false" :inline-height="false"></uppy>

            <div v-show="uploadedArtwork.length">
                <hr>
                <h5 class="text-center heading-primary header-lowercase"><strong>Files / Artwork Uploaded:</strong></h5>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>File Name</th>
                            <th class="text-right">Delete Artwork</th>
                        </tr>
                    </thead>
                    <tr v-for="(artwork, index) in uploadedArtwork">
                        <td>@{{ index + 1 }}</td>
                        <td>@{{ artwork.name }}</td>
                        <td class="text-right">
                            <button class="btn btn-danger btn-xs" v-on:click="removeArtwork(artwork)">
                                delete
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <br>
        </div>
        <div class="col-lg-6">
            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Or, if you'd just like text printed on the balloons</strong>
            </h5>
            <div class="row justify-content-center">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="artworkText">Text to print on the balloon</label>
                        <input title="artworkText" type="text" class="form-control" name="artworkText" v-model="artworkText">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="artworkFont">Font to use:</label>
                        <input title="artworkFont" type="text" class="form-control" name="artworkFont" v-model="artworkFont">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hr>
    <p class="text-center text-danger">Uploading/telling us about your artwork/design before placing an order is optional. We can organise artwork once we've received the order.</p>

</step>