<template>
    <div>
        <br>
        <ol class="step-indicator" id="wizardStepsBig">
            <li v-for="(step, index) in steps" :class="{ 'active': step.selected, 'complete': activeStep > index }" @click="changeStep(index)">
                <div class="step">
                    {{ index + 1 }}
                </div>
                <div class="caption d-none d-sm-inline" @click="changeStep(index)">
                    {{ step.title }}
                </div>
            </li>
        </ol>
        <div class="text-center" id="wizardStepsSmall">
            <h4>Step <span class="heading-secondary">{{ activeStep + 1 }}</span> of <span class="heading-secondary">{{ totalStepsIndex + 1 }}</span></h4>
            <h4 class="heading-secondary">{{ currentStep.title }}</h4>
            <hr>
        </div>
        <br>
        <slot></slot>
        <hr>
        <div class="row" id="wizardPriceSmall">
            <div class="col-12 text-center">
                <div v-if="!calculatingPrice">
                    <h5 class="mt-0 header-lowercase">Price Per Balloon: <strong class="heading-tertiary">£{{ pricePerBalloon }}</strong></h5>
                    <h4>Total: <strong class="heading-tertiary">£{{ priceWithVat }}</strong> (exc VAT: <strong class="heading-tertiary">£{{ priceWithoutVat }}</strong>)</h4>
                </div>
                <p v-else>Please Wait Calculating Price</p>
                <br>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <button v-show="activeStep > 0" class="btn btn-primary pull-left" @click="changeStep(activeStep - 1)"><i class="fas fa-chevron-left"></i> Back</button>
            </div>
            <div class="col-8 text-center">
                <div id="wizardPriceBig">
                    <div v-if="!calculatingPrice">
                        <h5 class="header-lowercase" style="margin-top: 0;">Price Per Balloon: <strong class="heading-tertiary">£{{ pricePerBalloon }}</strong></h5>
                        <h4>Total: <strong class="heading-tertiary">£{{ priceWithVat }}</strong> (exc VAT: <strong class="heading-tertiary">£{{ priceWithoutVat }}</strong>)</h4>
                    </div>
                    <p v-else>Please Wait Calculating Price</p>
                </div>
            </div>
            <div class="col-2">
                <button v-show="activeStep !== totalStepsIndex" class="btn btn-primary pull-right" @click="changeStep(activeStep + 1)">
                    Next Step <i class="fas fa-chevron-right d-none d-sm-inline"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        props: ['activeStep', 'pricePerBalloon', 'priceWithVat', 'priceWithoutVat', 'calculatingPrice', 'printingOptionSelected'],

        data() {
            return {
                steps: [],
                currentStep: {},
                totalStepsIndex: 0,
            }
        },

        created() {
            this.steps = this.$children;
        },

        mounted() {
            this.steps[0].selected = true;
            this.totalStepsIndex = this.steps.length - 1;
            this.currentStep = this.steps[0];
        },

        methods: {
            changeStep(stepToGo){
                this.$emit('change-step', stepToGo);
            }
        },

        watch : {
           activeStep(value){
               this.steps.forEach( (step, index) => step.selected = value === index );
               this.currentStep = this.steps[value];
           },
        }
    }
</script>

<style>
    .caption{
        cursor: pointer;
    }
</style>