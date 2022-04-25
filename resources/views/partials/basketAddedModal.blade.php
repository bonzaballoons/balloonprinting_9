<div class="modal fade" id="basketAddedModal" tabindex="-1" role="dialog" aria-labelledby="basketAddedLabel" style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="basketAddedLabel">Basket Added Success</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <p>Thanks. Your item has been added to the basket</p>
            </div>
            <div class="modal-footer">
                <a href="{{ url('basket') }}" class="btn btn-primary">Go To Basket</a>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Continue Shopping</button>
            </div>
        </div>
    </div>
</div>