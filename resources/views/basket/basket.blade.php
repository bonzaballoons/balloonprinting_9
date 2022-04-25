@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Your</strong> Basket</h1>
    </x-page-header>
    <div id="basketView">
        <div role="main" class="main shop">
            <div class="container">
                <div v-if="numberItems === 0" class="alert alert-danger text-center" role="alert">
                    <strong>Heads Up!</strong> You have no items in your basket.
                </div>
                <div v-else>
                    <div class="row">
                        <div class="col">
                            <div class="featured-boxes">
                                <div class="row">
                                    <div class="col">
                                        <div class="featured-box featured-box-primary text-left mt-2" style="">
                                            <div class="box-content">
                                                <table class="shop_table cart">
                                                    <thead>
                                                    <tr>
                                                        <th class="basketProductThumbnail d-none d-sm-block">
                                                            &nbsp;
                                                        </th>
                                                        <th class="basketProductDesc">
                                                            Product
                                                        </th>
                                                        <th class="product-quantity">
                                                            Quantity
                                                        </th>
                                                        <th class="product-subtotal">
                                                            Total Price
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>

                                                    @include('basket/partials/bonzaProducts')

                                                    @include('basket/partials/heliumHireCollections')

                                                    @include('basket/partials/heliumHireDeliveries')

                                                    @include('basket/partials/printedLatexFromWizard')

                                                    @include('basket/partials/printedLatexGiantFromWizard')

                                                    @include('basket/partials/printedFoilFromWizard')

                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-6" v-if="hasBonzaProducts">

                            <p v-if="hasBonzaPrintedProducts" class="mb-2">To calculate postage costs and any speedy turnaround fees that may be applicable, please choose a date that you'd like the following items to be delivered on: </p>

                            <p v-else-if="totalPostageWeight > 0">To calculate postage costs that may be applicable, please choose a date that you'd like the following items to be delivered on:</p>
                            <p v-else>Please choose a date that you'd like the following items to be delivered on:</p>

                            <ul>
                                <li v-for="postageWeightItem in allPostageWeightItems" v-if="postageWeightItem.productName">
                                    @{{ postageWeightItem.productName }}
                                </li>
                            </ul>

                            <div class="form-group" style="max-width: 300px">
                                <label for="deliveryBonzaEventDate">Required Delivery Date</label>
                                <flat-pickr v-model="bonzaProductsDeliveryDate" :config="bonzaProductsDeliveryDateFpOptions" class="flatPickr"/>
                            </div>
                            <p class="smaller text-danger">If you'd like a Saturday or Highlands and Islands delivery please give us a call to see if we can fulfil your order.</p>
                        </div>
                        <div class="col-md-6">

                            <br class="d-xs-block d-md-none">
                            <br class="d-xs-block d-md-none">

                            <h4>Basket Totals <span class="text-danger">(Including VAT)</span></h4>
                            <table class="table">
                                <tbody>
                                <tr v-show="hireDeliveryDiscount > 0">
                                    <th>
                                        <strong>Helium Delivery Discount</strong>
                                    </th>
                                    <td>
                                        <strong v-show="calculatingPrice">Calculating Price...</strong>
                                        <strong v-show="!calculatingPrice"> - &pound;@{{ hireDeliveryDiscount | formatCurrency }}</strong>
                                    </td>
                                </tr>
                                <tr v-show="hasBonzaProducts && totalPostageWeight > 0 && bonzaProductsDeliveryDate">
                                    <th>
                                        <strong>Subtotal</strong>
                                    </th>
                                    <td>
                                        <strong v-show="calculatingPrice">Calculating Price...</strong>
                                        <strong v-show="!calculatingPrice">&pound;@{{ basketSubtotal | formatCurrency }}</strong>
                                    </td>
                                </tr>
                                <tr v-show="hasBonzaProducts && totalPostageWeight > 0 && bonzaProductsDeliveryDate">
                                    <th>
                                        Weight Postage Charge (<a  href="javascript:" data-toggle="modal" data-target="#postageWeightCalculationModal">More Info</a>)
                                    </th>
                                    <td>
                                        <strong v-show="calculatingPrice">Calculating Price...</strong>
                                        <span v-show="!calculatingPrice">
                                            <strong v-if="totalPostageWeightPrice > 0">&pound;@{{ totalPostageWeightPrice | formatCurrency  }}</strong>
                                            <strong v-else>Not applicable for this order.</strong>
                                        </span>
                                    </td>
                                </tr>
                                <tr class="total">
                                    <th>
                                        <strong>Order Total</strong>
                                    </th>
                                    <td>
                                        <strong v-show="calculatingPrice">Calculating Price...</strong>
                                        <strong v-show="!calculatingPrice && bonzaProductsDeliveryDate"><span class="amount">&pound;@{{ totalPrice | formatCurrency }}</span></strong>
                                        <strong v-show="!calculatingPrice && !bonzaProductsDeliveryDate"><span class="amount">&pound;@{{ basketSubtotal | formatCurrency }}</span></strong>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div v-show="showDeliveryDateWarning" class="alert alert-danger text-center">
                                Please select a delivery date before continuing the checkout process
                            </div>

                            <div v-show="warningForTurnaroundTime" class="alert alert-danger text-center">
                                You have chosen a delivery date that's within 5 working days and have added custom printed foil balloons to your basket. We usually need at least 5 working days to turnaround foil printed balloons. Please choose either a later delivery date or contact us to find out if we can meet your deadline.
                            </div>

                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <br>
                            <a v-show="showContinueButton" href="{{ url('order/details') }}" class="btn btn-primary pull-right">
                                Click Here to Continue
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="postageWeightCalculationModal" tabindex="-1" role="dialog" aria-labelledby="postageWeightCalculationLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="postageWeightCalculationLabel">Weight Postage Charge</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div class="modal-body">
                        <p>For the items in your basket, that don't already have delivery included in the price (Helium Hire & Disposable Helium), we have a delivery charge based on the total weight of the products. The total weight of the products in your basket is <span class="text-danger">@{{ totalPostageWeight | gramsToKg }} kg</span>. Please see below for the items which this charge is levied against and the total weight that each item contributes:</p>
                        <ul>
                            <li v-for="postageWeightItem in allPostageWeightItems" v-if="postageWeightItem.totalPostageWeightKg > 0">
                                <span v-if="postageWeightItem.productName">@{{ postageWeightItem.productName }}</span>
                                <span v-if="postageWeightItem.name">@{{ postageWeightItem.name }}</span>
                                - <span class="text-danger">@{{ postageWeightItem.totalPostageWeightKg }} kg</span>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        @include('partials/searchDepotModal', [ 'showPrice' => false ] )
    </div>
@endsection
