<step title="Options">
    <div class="row">
        <div class="col-xs-12 col-sm-6 text-center">

            <div v-if="typeSelected.sizes.length > 1">
                <h5 class="heading-primary header-lowercase"><strong><i class="fas fa-angle-down heading-secondary"></i> Select the size of your balloons</strong></h5>
                <select v-model="sizeSelected" style="max-width: 300px;" class="form-control mx-auto">
                    <option v-for="size in typeSelected.sizes" :value="size">
                        @{{ size }} Inch
                    </option>
                </select>
                <br>
            </div>
            <h5 class="heading-primary header-lowercase mt-3"><strong><i class="fas fa-angle-down heading-secondary"></i> Select one of the printing options</strong></h5>
            <select v-model="printingOptionSelected" class="form-control mx-auto" style="max-width: 300px;">
                <option v-for="option in printingOptions" v-bind:value="option">
                    @{{ option.name }}
                </option>
            </select>
            <br>
            <p class="red text-center">If the printing option you want is not available, please contact us for a quote.</p>

        </div>
        <div class="col-xs-12 col-sm-6">
            <img class="mx-auto d-block img-responsive" style="height: 225px; width: 225px" v-bind:src="printingOptionSelected.imgSrc | displayPrintingOptionPreview" v-bind:alt="printingOptionSelected.name">
        </div>
    </div>
</step>