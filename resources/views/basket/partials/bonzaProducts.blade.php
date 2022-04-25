<tr class="cart_table_item" v-for="(product, index) in bonzaProducts">
    <td class="d-none d-sm-block">
        <a :href="product.pagePath">
            <img :alt="product.productName" class="img-fluid" :src="product.refNum | imgThumb">
        </a>
    </td>
    <td>
        <a class="d-block mt-2" :href="product.pagePath">@{{ product.productName }}</a>
        <p v-if="product.deliveryName">
            <small>With Delivery Option: @{{ product.deliveryName }} - &pound;@{{ product.unitDeliveryPrice  | formatCurrency }}</small>
        </p>

        <p v-if="product.totalPostageWeightKg > 0">
            <small>Postage Weight: @{{ product.totalPostageWeightKg }} kg</small>
        </p>
    </td>
    <td class="product-quantity">
        <div class="quantity">
            <input @click="minusQuantity('bonzaProducts', index, product.quantity)" type="button" class="minus" value="-">
            <input type="number" class="input-text qty text" min="1" step="1" @keyup="changeInputQuantity('bonzaProducts', index, product.quantity)" v-model.number="product.quantity">
            <input @click="addQuantity('bonzaProducts', index, product.quantity)" type="button" class="plus" value="+">
        </div>
    </td>
    <td class="product-subtotal">
        <span v-if="product.calculatingPrice">Calculating...</span>
        <span v-else class="amount">&pound;@{{ product.totalPriceWithVat | formatCurrency }}</span>
    </td>
    <td class="product-remove">
        <a v-on:click="removeProduct('bonzaProducts', index)" title="Remove this item" class="remove">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>