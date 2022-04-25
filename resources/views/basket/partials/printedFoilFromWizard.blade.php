<tr class="cart_table_item" v-for="(product, index) in printedFoilFromWizard">
    <td class="d-none d-sm-block"></td>
    <td class="basketProductDesc">
        <a href="javascript:">@{{ product.productName }}</a><br>
        <small class="hidden-xs">@{{ product.description }}</small>
    </td>
    <td class="product-quantity">
        <div class="quantity">
            <input v-on:click="minusQuantity('printedFoilFromWizard', index, product.quantity)" type="button" class="minus" value="-">
            <input type="number" class="input-text qty text" v-on:keyup="changeInputQuantity('printedFoilFromWizard', index, product.quantity)" v-model.number="product.quantity">
            <input v-on:click="addQuantity('printedFoilFromWizard', index, product.quantity)" type="button" class="plus" value="+">
        </div>
    </td>
    <td class="product-subtotal">
        <span v-if="product.calculatingPrice">Calculating...</span>
        <span v-else class="amount">&pound;@{{ product.totalPriceWithVat | formatCurrency }}</span>
    </td>
    <td class="product-remove">
        <a v-on:click="removeProduct('printedFoilFromWizard', index)" title="Remove this item" class="remove">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>