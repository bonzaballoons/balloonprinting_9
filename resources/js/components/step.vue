<template>
    <div v-show="selected">
        <slot></slot>
    </div>
</template>

<script>

    export default {
        data() {
            return {
              selected : false
            }
        },
        props: {
            title : String,
        }
    }

</script>