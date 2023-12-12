import {
    i19checkout,
    i19close,
    i19continueShopping,
    i19emptyCart,
    i19myShoppingCart,
    i19seeCart,
    i19subtotal
  } from '@ecomplus/i18n'
  
  import {
    i18n,
    formatMoney
  } from '@ecomplus/utils'
  
  import ecomCart from '@ecomplus/shopping-cart'
  import { store, modules } from '@ecomplus/client'
  import ALink from '@ecomplus/storefront-components/src/ALink.vue'
  import ABackdrop from '@ecomplus/storefront-components/src/ABackdrop.vue'
  import APrices from '@ecomplus/storefront-components/src/APrices.vue'
  import CartItem from '@ecomplus/storefront-components/src/CartItem.vue'
  import ecomPassport from '@ecomplus/passport-client'
  import ShippingCalculator from '@ecomplus/storefront-components/src/ShippingCalculator.vue'

  const addFreebieItems = (ecomCart, productIds) => {
    if (Array.isArray(productIds)) {
      ecomCart.data.items.forEach(({ _id, product_id: productId, flags }) => {
        if (flags && flags.includes('freebie') && !productIds.includes(productId)) {
          ecomCart.removeItem(_id)
        }
      })
      productIds.forEach(productId => {
        const canAddFreebie = !ecomCart.data.items.find(item => {
          return item.product_id === productId && item.flags && item.flags.includes('freebie')
        })
        if (canAddFreebie) {
          store({ url: `/products/${productId}.json` })
            .then(({ data }) => {
              if (data.quantity > 0 && (!data.variations || !data.variations.length)) {
                ecomCart.addProduct(
                  {
                    ...data,
                    flags: ['freebie', '__tmp']
                  },
                  null,
                  productIds.reduce((qnt, _id) => {
                    return _id === productId ? qnt + 1 : qnt
                  }, 0)
                )
              }
            })
            .catch(console.error)
        }
      })
    }
  }

  
  export default {
    name: 'CartQuickview',
  
    components: {
      ALink,
      ABackdrop,
      APrices,
      CartItem,
      ShippingCalculator
    },
  
    props: {
      isVisible: {
        type: Boolean,
        default: true
      },
      hasShippingCalculator: Boolean,
      checkoutUrl: {
        type: String,
        default: '/app/#/checkout'
      },
      canAddFreebieItems: {
        type: Boolean,
        default: true
      },
      cartUrl: {
        type: String,
        default: '/app/#/cart'
      },
      canOpenOnNewItem: {
        type: Boolean,
        default: true
      },
      ecomCart: {
        type: Object,
        default () {
          return ecomCart
        }
      },
      ecomPassport: {
        type: Object,
        default () {
          return ecomPassport
        }
      }
    },
  
    data () {
      return {
        selectedShippingPrice: 0,
        isLoading: false,
      }
    },
  
    computed: {
      i19checkout: () => i18n(i19checkout),
      i19close: () => i18n(i19close),
      i19continueShopping: () => i18n(i19continueShopping),
      i19emptyCart: () => i18n(i19emptyCart),
      i19myShoppingCart: () => i18n(i19myShoppingCart),
      i19seeCart: () => i18n(i19seeCart),
      i19subtotal: () => i18n(i19subtotal),
  
      cart () {
        return this.ecomCart.data
      },
  
      total () {
        return this.cart.subtotal + this.selectedShippingPrice
      }
    },
  
    methods: {
      formatMoney,
  
      toggle (isVisible) {
        this.$emit(
          'update:is-visible',
          typeof isVisible === 'boolean' ? isVisible : !this.isVisible
        )
      },
  
      selectShippingService (service) {
        this.selectedShippingPrice = service.shipping_line
          ? service.shipping_line.total_price
          : 0
      },

      parseDiscountOptions (listResult = []) {
        if (listResult.length) {
          listResult.forEach(appResult => {
            const { validated, error, response } = appResult
            if (validated && !error) {
              if (response.freebie_product_ids) {
                addFreebieItems(this.ecomCart, response.freebie_product_ids)
              } else {
                this.ecomCart.data.items.forEach(({ _id, flags }) => {
                    console.log(_id)
                    if (Array.isArray(flags) && flags.includes('freebie')) {
                      ecomCart.removeItem(_id)
                    }
                })
              }
            }
          })
        }
      },

      fetchDiscountOptions (data = {}) {
        this.isLoading = true
        if (this.ecomPassport.checkLogin()) {
          const customer = this.ecomPassport.getCustomer()
          data.customer = {
            _id: customer._id
          }
          if (customer.display_name) {
            data.customer.display_name = customer.display_name
          }
        }
        modules({
          url: '/apply_discount.json',
          method: 'POST',
          data: {
            amount: {
              subtotal: this.ecomCart.data.subtotal,
              total: this.ecomCart.data.subtotal,
              discount: 0
            },
            items: this.ecomCart.data.items
          }
        })
          .then(({ data }) => this.parseDiscountOptions(data.result))
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
  
    created () {
      if (this.canOpenOnNewItem) {
        this.ecomCart.on('addItem', ({ data }) => {
          this.$set(this.ecomCart, 'data', data)
          this.fetchDiscountOptions()
          this.$nextTick(() => {
            this.toggle(true)
          })
        })
      }
    },

    mounted () {
        this.fetchDiscountOptions()
        ecomCart.on('change', this.fetchDiscountOptions)
    }
  }
  