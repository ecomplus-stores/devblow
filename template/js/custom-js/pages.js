// Add your custom JavaScript for storefront pages here.
import EcomSearch from '@ecomplus/search-engine'
if (storefront && storefront.context && storefront.context.resource === 'products') {
  ecomCart.on('addItem', (data) => { 
    window.location = '/app/#/cart/'
    // Measure when a product is added to a shopping cart
    /* let item = data.item
    let specifications = item.specifications
    let variant = specifications ? window.ecomUtils.specTextValue(item, 'flavor') : undefined 
    window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [{
          item_name: item.name, // Name or ID is required.
          item_id: item.sku,
          price: item.final_price,
          item_brand: "Blow Gummies",
          item_category: "Comprar Agora",
          item_variant: variant,
          quantity: item.quantity
        }]
      }
    }); */
    
  })
}

  /* if (storefront && storefront.context && storefront.context.resource === 'products') {
    const pageProduct = storefront.context.body
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [{
          item_name: pageProduct.name, // Name or ID is required.
          item_id: pageProduct.sku,
          price: pageProduct.price,
          item_brand: "Blow Gummies",
          item_category: "Comprar Agora",
          quantity: pageProduct.quantity
        }]
      }
    });

  } */

// comente a linha abaixo para buscar regras de frete grátis
window.modulesToFetch = [{ endpoint: 'list_payments' }]

$(document).ready(function(){
  $('#apx_form').closest('.custom-html').toggleClass('my-4 my-0');
  $('#apx_form').closest('.custom-html').toggleClass('my-lg-5 my-lg-0');
});

$('#apx_form').submit(function(e){
  e.preventDefault();
  $('#conversion-form-am-formulario-de-newsletter [name="email"]').val($(this).find('[name="mail"]').val());
  $('#conversion-form-am-formulario-de-newsletter').submit();
});


const toggleButton = document.getElementById('mgnr_search-trigger');
toggleButton.addEventListener('click', () => {
  const instantSearchComponent = document.querySelector('[name="InstantSearch"]');
  if (instantSearchComponent) {
    instantSearchComponent.__vue__.toggleVisibility(); // Chama o método do componente Vue
  }
});

setInterval(() => {
  if ($('#mgnr_search-trigger.collapsed') && $('#mgnr_search-trigger.collapsed').length && !document.getElementById('search-bar').classList.contains('show')) {
    document.getElementById('search-bar').classList.add('show')
  }
  $('#mgnr_search-trigger.collapsed')
}, 1000)

$('.faq_list button').click(function(){
  $(this).closest('.faq_list-item').toggleClass('visible')
});