<div class="modal fade" id="artworkChecker" tabindex="-1" role="dialog" aria-labelledby="artworkCheckerLabel" style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="artworkCheckerLabel">Free Artwork Checking Service</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <p>So that you can be sure that your artwork is suitable for printing onto balloons, we provide a free artwork checking service.  Just upload your artwork below and we'll get our graphic designers to take a look at it. We'll try to get back to you on the same day, or the next if we're a little busy.</p>

                <h6 class="text-danger text-center">Firstly, please add your name and email</h6>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group" :class="{ 'has-error': !name }">
                            <label for="checkerEmail">Name:</label>
                            <input id="checkerEmail" v-model="name" class="form-control" type="text">
                            <br>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group" :class="{ 'has-error': !email }">
                            <label for="email">Email Address:</label>
                            <input id="email" v-model="email" class="form-control" type="email">
                            <br>
                        </div>
                    </div>
                </div>

                <uppy v-show="email && name" @add-artwork="addArtwork" :inline="false"></uppy>

                <div v-show="uploadedArtwork.length">
                    <p><strong>Files / Artwork Uploaded:</strong></p>
                    <table class="table table-striped text-left">
                        <thead>
                        <tr>
                            <th>File Name</th>
                            <th class="text-right">Remove Item</th>
                        </tr>
                        </thead>

                        <tr v-for="(artwork, index) in uploadedArtwork">
                            <td>@{{ artwork.name }}</td>
                            <td class="text-right">
                                <button class="btn btn-danger btn-xs" @click="removeArtwork(artwork)">
                                    delete this item
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <p class="smaller mt-4 heading-secondary" v-show="uploadedArtwork.length">Or click the send artwork button below to continue.</p>

            </div>
            <div class="modal-footer">
                <div v-show="!artworkLoading">
                    <button type="button" class="btn btn-primary" v-show="uploadedArtwork.length && email" v-on:click="sendArtworkCheck()">Send Artwork</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
                <p v-show="artworkLoading" class="red">Loading...</p>
            </div>
        </div>
    </div>
</div>