<div v-if="basketDetails.hasHireCollect" class="card m-3">

    <div class="card-body">
        <form>
            <div class="row">
                <div class="col-md-4 text-center">
                    <h5 class="card-title header-lowercase" style="font-weight: bolder">
                        <i class="fa fa-home"></i>
                        <span class="text-secondary">Hire Collection from Local Depot</span>
                    </h5>
                    <h5 class="card-title header-lowercase" style="font-weight: bolder">
                        (Address of Storage)
                    </h5>
                    <h6 class="card-subtitle mt-2 mb-2 text-muted">For our records, please tell us where you will keep the cylinders once you have collected them from our depot - @{{ heliumSupplier.name }}</h6>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="heliumStorageAdd1">Address Line 1 <span class="text-danger">*</span></label>
                        <input id="heliumStorageAdd1" type="text" class="form-control" name="heliumStorageAdd1" v-model="heliumStorageAdd1" v-validate="'required'" :class="{'is-invalid': errors.has('heliumStorageAdd1') }" autocomplete="section-hc shipping address-line1">
                        <p v-show="errors.has('heliumStorageAdd1')" class="text-danger mb-0">@{{ errors.first('heliumStorageAdd1') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="heliumStorageAdd2">Address Line 2</label>
                        <input id="heliumStorageAdd2" type="text" class="form-control" name="heliumStorageAdd2" v-model="heliumStorageAdd2">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="heliumStorageCityTown">City/Town</label>
                        <input id="heliumStorageCityTown" type="text" class="form-control" name="heliumStorageCityTown" v-model="heliumStorageCityTown" autocomplete="section-hc shipping address-line2">
                    </div>

                    <div class="form-group">
                        <label for="heliumStoragePostCode">Postcode <span class="text-danger">*</span></label>
                        <input id="heliumStoragePostCode" type="text" class="form-control" name="heliumStoragePostCode" v-model="heliumStoragePostCode" v-validate="'required'" :class="{'is-invalid': errors.has('heliumStoragePostCode') }" autocomplete="section-hc shipping postal-code">
                        <p v-show="errors.has('heliumStoragePostCode')" class="text-danger mb-0">@{{ errors.first('heliumStoragePostCode') }}</p>
                    </div>
                </div>
            </div>
        </form>

        <div class="alert alert-info">
            <strong>Important!</strong> Full depot address details, for your helium collection, will be provided in your confirmation email once an order has been processed so we can ensure that the cylinder is booked in waiting for you when you go to collect.
        </div>

    </div>
</div>