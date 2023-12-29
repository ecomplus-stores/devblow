// Add your custom JavaScript for storefront pages here.
if (storefront && storefront.context && storefront.context.resource === 'products') {
    ecomCart.on('addItem', () => { 
        window.location = '/app/#/cart/' 
    })
}

const toggleButton = document.getElementById('mobile-search-btn');
toggleButton.addEventListener('click', () => {
  const instantSearchComponent = document.querySelector('[name="InstantSearch"]');
  if (instantSearchComponent) {
    instantSearchComponent.__vue__.toggleVisibility(); // Chama o método do componente Vue
  }
});