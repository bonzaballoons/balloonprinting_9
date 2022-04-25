<div class="modal fade" id="modalSearchDepot" tabindex="-1" role="dialog" aria-labelledby="modalSearchDepotLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalSearchDepotLabel">Please choose a supplier to collect your helium from</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <p v-show="loadingSuppliers" class="red text-center">Loading...</p>

                @if($showPrice)
                    <div v-if="postcodeNotFound" class="alert alert-danger text-center" role="alert">
                        <h4>Sorry! We couldn't find your postcode!</h4>
                        <p>Please try again, making sure that you use the full postcode with the correct spacing in your search. e.g. LS13 2DN, NOT LS132DN. Please note that we may not have some of the newer postcodes in our database; In this case just use an older postcode nearby.</p>
                        <p class="smaller"><strong>If you still are having trouble, just give us a call on {{ env('SITE_PHONE_NUMBER') }} and we can help you find your nearest depot.</strong></p>
                    </div>
                @endif

                <div v-if="supplierList.length" class="d-flex flex-wrap justify-content-around">
                    <div v-for="(supplier, index) in supplierList" class="card mb-1" style="width: 250px;">
                        <div class="card-body">
                            <h5 class="mt-0 mb-1">@{{ supplier.name }}</h5>
                            <p class="heading-secondary m-0">@{{ supplier.opening_hours }}</p>
                            <p class="m-0"><span class="text-danger">@{{ supplier.distance_miles }} miles</span> from @{{ postcode }}</p>
                            @if($showPrice)
                                <h5 class="mt-2">Price: <span class="text-danger">£@{{ supplier.price }}</span></h5>
                            @endif
                            <button class="btn btn-info btn-sm text-white mt-2" v-on:click="selectSupplier(supplier)">
                                Select <span class="hidden-xs">this depot</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>