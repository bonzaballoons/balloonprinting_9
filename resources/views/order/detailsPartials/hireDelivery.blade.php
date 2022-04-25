<div class="card m-3" v-if="basketDetails.hasHireDelivery">
    <div class="card-body">
        <form>
            <div class="row">
                <div class="col-md-4 text-center">
                    <h5 class="card-title header-lowercase" style="font-weight: bolder">
                        <i class="fa fa-truck"></i>
                        <span class="text-secondary">Delivery & Pick Up of Hired Cylinders</span>
                    </h5>

                    <h6 class="card-title header-lowercase" style="font-weight: bolder">
                        (Business Address Only)
                    </h6>

                    <h6 class="card-subtitle mt-2 mb-2 text-muted"><span v-show="basketDetails.hasHireCollect">In addition to the helium cylinder<span v-show="basketDetails.numCollectHire > 1">s</span> you are collecting from your local depot, you have also chosen to have @{{ basketDetails.numDeliveryHire }} cylinder<span v-show="basketDetails.numDeliveryHire > 1">s</span> delivered to, and picked up from, a business address. </span>Please tell us where you'd like the hire cylinder<span v-show="basketDetails.numDeliveryHire > 1">s</span> to be delivered.</h6>

                    <h6 class="text-secondary mt-4">Please note, hire cylinders can only be delivered to, and picked up from, a business address.</h6>

                    <p class="smaller text-dark"><span class="text-danger">*</span> denotes a required field</p>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="hireDeliveryCustomerName">Recipient Full Name <span class="text-danger">*</span></label>
                        <input id="hireDeliveryCustomerName" type="text" class="form-control" name="hireDeliveryCustomerName" v-model="hireDeliveryCustomerName" v-validate="'required'" :class="{'is-invalid': errors.has('hireDeliveryCustomerName') }" autocomplete="section-hd shipping name">
                        <p v-show="errors.has('hireDeliveryCustomerName')" class="text-danger mb-0">@{{ errors.first('hireDeliveryCustomerName') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="hireDeliveryCustomerPhone">Recipient Daytime Phone Number <span class="text-danger">*</span></label>
                        <input id="hireDeliveryCustomerPhone" type="text" class="form-control" name="hireDeliveryCustomerPhone" v-model="hireDeliveryCustomerPhone" v-validate="'required'" :class="{'is-invalid': errors.has('hireDeliveryCustomerPhone') }" autocomplete="section-hd shipping tel">
                        <p v-show="errors.has('hireDeliveryCustomerPhone')" class="text-danger mb-0">@{{ errors.first('hireDeliveryCustomerPhone') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="hireDeliveryAdd1">Recipient Address Line 1 <span class="text-danger">*</span></label>
                        <input id="hireDeliveryAdd1" type="text" class="form-control" name="hireDeliveryAdd1" v-model="hireDeliveryAdd1" v-validate="'required'" :class="{'is-invalid': errors.has('hireDeliveryAdd1') }" autocomplete="section-hd shipping address-line1">
                        <p v-show="errors.has('hireDeliveryAdd1')" class="text-danger mb-0">@{{ errors.first('hireDeliveryAdd1') }}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="hireDeliveryAdd2">Recipient Address Line 2</label>
                        <input id="hireDeliveryAdd2" type="text" class="form-control" name="hireDeliveryAdd2" v-model="hireDeliveryAdd2">
                    </div>

                    <div class="form-group">
                        <label for="hireDeliveryCityTown">Recipient City/Town</label>
                        <input id="hireDeliveryCityTown" type="text" class="form-control" name="hireDeliveryCityTown" v-model="hireDeliveryCityTown" autocomplete="section-hd shipping address-line2">
                    </div>

                    <div class="form-group">
                        <label for="hireDeliveryPostCode">Postcode <span class="text-danger">*</span></label>
                        <input id="hireDeliveryPostCode" type="text" class="form-control" name="hireDeliveryPostCode" v-model="hireDeliveryPostCode" v-validate="'required'" :class="{'is-invalid': errors.has('hireDeliveryPostCode') }" autocomplete="section-hd shipping postal-code">
                        <p v-show="errors.has('hireDeliveryPostCode')" class="text-danger mb-0">@{{ errors.first('hireDeliveryPostCode') }}</p>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>