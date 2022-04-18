// Add your custom JavaScript for storefront pages here.
if (storefront && storefront.context && storefront.context.resource === 'products') {
    ecomCart.on('addItem', () => { 
        window.location = '/app/#/cart/' 
    })
}
