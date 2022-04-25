<tr class="cart_table_item" v-for="(product, index) in heliumHireCollections">
    <td class="d-none d-sm-block">
        <a :href="product.pagePath">
            <img :alt="product.productName" class="img-fluid" :src="product.refNum | imgThumb">
        </a>
    </td>
    <td>
        <a class="d-block mt-2" :href="product.pagePath">
            @{{ product.productName }}
        </a>
        <p class="m-0" v-if="heliumSupplier">
            <small>To be collected from
                <strong>@{{ heliumSupplier.name }}</strong> (<a href="javascript:" @click="changeHeliumSupplier(product.id)">click to change</a>)
            </small>
        </p>

        <p class="m-0" v-if="product.additionalWeeks > 0">
            <small>Extra charge of <span class="text-danger">£@{{ product.additionalWeekPrice | formatCurrency }} - @{{ product.additionalWeeks }} week<span v-if="product.additionalWeeks > 1">s</span> additional hire</span></small>
        </p>

    </td>
    <td class="product-quantity">
        <div class="quantity">
            <input @click="minusQuantity('heliumHireCollections', index, product.quantity)" type="button" class="minus" value="-">
            <input type="number" class="input-text qty text" min="1" step="1" @keyup="changeInputQuantity('bonzaProducts', index, product.quantity)" v-model.number="product.quantity">
            <input @click="addQuantity('heliumHireCollections', index, product.quantity)" type="button" class="plus" value="+">
        </div>
    </td>
    <td class="product-subtotal">
        <span v-if="product.calculatingPrice">Calculating...</span>
        <span v-else class="amount">&pound;@{{ product.totalPriceWithVat | formatCurrency }}</span>
    </td>
    <td class="product-remove">
        <a @click="removeProduct('heliumHireCollections', index)" title="Remove this item" class="remove">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>