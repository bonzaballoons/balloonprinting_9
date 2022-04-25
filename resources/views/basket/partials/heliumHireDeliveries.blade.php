<tr class="cart_table_item" v-for="(product, index) in heliumHireDeliveries">
    <td class="basketProductThumbnail d-none d-sm-block">
        <a :href="product.pagePath">
            <img :alt="product.productName" class="img-fluid" :src="product.refNum | imgThumb">
        </a>
    </td>
    <td class="basketProductDesc">
        <a class="d-block mt-2" :href="product.pagePath">@{{ product.productName }}</a>
        <small>To be delivered to a business address</small>
        <p class="m-0" v-if="product.additionalWeeks > 0">
            <small class="text-danger">Extra charge of £@{{ product.additionalWeekPrice | formatCurrency }} - @{{ product.additionalWeeks }} week<span v-if="product.additionalWeeks > 1">s</span> additional hire</small>
        </p>
    </td>
    <td class="product-quantity">
        <div class="quantity">
            <input @click="minusQuantity('heliumHireDeliveries', index, product.quantity)" type="button" class="minus" value="-">
            <input type="number" class="input-text qty text" min="1" step="1" @keyup="changeInputQuantity('heliumHireDeliveries', index, product.quantity)" v-model.number="product.quantity">
            <input @click="addQuantity('heliumHireDeliveries', index, product.quantity)" type="button" class="plus" value="+">
        </div>
    </td>
    <td class="product-subtotal">
        <span v-if="product.calculatingPrice">Calculating...</span>
        <span v-else class="amount">&pound;@{{ product.totalPriceWithVat | formatCurrency }}</span>
    </td>
    <td class="product-remove">
        <a v-on:click="removeProduct('heliumHireDeliveries', index)" title="Remove this item" class="remove">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>