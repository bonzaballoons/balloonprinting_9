@extends('masterLayout')

@section('content')

<x-page-header>
    <h1><strong>Order</strong> Details</h1>
</x-page-header>
<div id="orderDetails" class="container bg-light border">
    <br>
    <div class="card m-3">
        <div class="card-body">
            <form>
                <div class="row">
                    <div class="col-md-4 text-center">
                        <h5 class="card-title header-lowercase" style="font-weight: bolder">
                            <i class="fa fa-user-edit"></i>
                            <span class="heading-secondary">Your Contact Details</span>
                        </h5>
                        <h6 class="card-subtitle mt-2 mb-2 text-muted">Please fill out your contact details. We only ever use your contact details in relation to your order. We'll never send you spam or share your details with third parties.</h6>
                        <p class="smaller text-dark "><span class="text-danger">*</span> denotes a required field</p>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="customerContactFullName">Full Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="customerContactFullName" name="customerContactFullName" v-model="customerContactFullName" v-validate="'required'" :class="{'is-invalid': errors.has('customerContactFullName') }" autocomplete="section-cd name">
                            <p v-show="errors.has('customerContactFullName')" class="text-danger mb-0">@{{ errors.first('customerContactFullName') }}</p>
                        </div>
                        <div class="form-group">
                            <label for="customerContactEmail">Email <span class="text-danger">*</span></label>
                            <input id="customerContactEmail" type="email" class="form-control" name="customerContactEmail" v-model="customerContactEmail" v-validate="'required|email'" :class="{'is-invalid': errors.has('customerContactEmail') }" autocomplete="section-cd email">
                            <p v-show="errors.has('customerContactEmail')" class="text-danger mb-0">@{{ errors.first('customerContactEmail') }}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="customerContactPhone">Daytime Telephone <span class="text-danger">*</span></label>
                            <input id="customerContactPhone" type="tel" class="form-control" name="customerContactPhone" v-model="customerContactPhone" v-validate="'required'" :class="{'is-invalid': errors.has('customerContactPhone') }" autocomplete="section-cd tel">
                            <p v-show="errors.has('customerContactPhone')" class="text-danger mb-0">@{{ errors.first('customerContactPhone') }}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    @include('order.detailsPartials.bonzaProducts')

    @include('order.detailsPartials.hireDelivery')

    @include('order.detailsPartials.hireCollect')

    <br>

    <div class="row m-3">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="checkbox">
                    <label><input type="checkbox" v-model="termsChecked"> &nbsp;I have read the terms and conditions</label>
                </div>
                <p>
                    <a href="javascript:" data-toggle="modal" data-target="#termsModal">
                        Click to See Terms & Conditions
                    </a>
                </p>
            </div>
        </div>
        <div class="col-sm-6">
            <button type="button" class="btn btn-large btn-primary pull-right" v-on:click="submitForm">Continue to the Next Step</button>
        </div>
    </div>

    <!-- Terms and Conditions Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1" role="dialog" aria-labelledby="termsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="termsModalLabel">Terms and conditions</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    {!! $terms !!}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</div>

@endsection




