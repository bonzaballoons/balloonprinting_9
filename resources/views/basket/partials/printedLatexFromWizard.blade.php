<tr class="cart_table_item" v-for="(product, index) in printedLatexFromWizard">
    <td class="d-none d-sm-block"></td>
    <td class="basketProductDesc">
        <a href="javascript:">@{{ product.productName }}</a>
        <p class="m-0 hidden-xs">
            <small>@{{ product.description }}</small>
        </p>
        <p class="m-0 hidden-xs text-danger" v-if="product.expressFeeWithVat > 0">
            <small>
                Speedy Turnaround Fee of £@{{ product.expressFeeWithVat | formatCurrency }} - @{{ product.expressFeeDescription }}
            </small>
        </p>
    </td>
    <td class="product-quantity">
        <div class="quantity">
            <input v-on:click="minusQuantity('printedLatexFromWizard', index, product.quantity)" type="button" class="minus" value="-">
            <input type="number" class="input-text qty text" v-on:keyup="changeInputQuantity('printedLatexFromWizard', index, product.quantity)" v-model.number="product.quantity">
            <input v-on:click="addQuantity('printedLatexFromWizard', index, product.quantity)" type="button" class="plus" value="+">
        </div>
    </td>
    <td class="product-subtotal">
        <span v-if="product.calculatingPrice">Calculating...</span>
        <span v-else class="amount">&pound;@{{ product.totalPriceWithVat | formatCurrency }}</span>
    </td>
    <td class="product-remove">
        <a v-on:click="removeProduct('printedLatexFromWizard', index)" title="Remove this item" class="remove">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>