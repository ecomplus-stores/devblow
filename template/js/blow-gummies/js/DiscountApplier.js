import {
  i19add,
  i19addDiscountCoupon,
  i19campaignAppliedMsg,
  i19code,
  i19couponAppliedMsg,
  i19discountCoupon,
  i19errorMsg,
  i19hasCouponOrVoucherQn,
  i19invalidCouponMsg
} from '@ecomplus/i18n'

import { i18n } from '@ecomplus/utils'
import { store, modules } from '@ecomplus/client'
import ecomCart from '@ecomplus/shopping-cart'
import ecomPassport from '@ecomplus/passport-client'
import AAlert from '@ecomplus/storefront-components/src/AAlert.vue'

const sessionStorage = typeof window === 'object' && window.sessionStorage

const addFreebieItems = (ecomCart, productIds) => {
  if (Array.isArray(productIds)) {
    let storedFreebies = typeof sessionStorage.getItem('freebieData') !== "undefined" ? JSON.parse(sessionStorage.getItem('freebieData')) : []

    productIds.forEach(productId => {
      // if (!ecomCart.data.items.find(item => item.product_id === productId.slice(0,20) + '000f')) {
        if (!ecomCart.data.items.find(item => item.product_id === productId)) {
        store({ url: `/products/${productId}.json` })
          .then(({ data }) => {
            if((!data.variations || !data.variations.length)){
              if (data.quantity > 0) {
                data.price = 0
                data.quantity = 1
                // ecomCart.addItem({
                //   ...data,
                //   keep_item_price: true,
                //   flags: ['freebie', '__tmp']                
                // })
                ecomCart.addProduct(
                  {
                    ...data,
                    keep_item_price: true,
                    flags: ['freebie', '__tmp']
                  },
                  null,
                  productIds.reduce((qnt, _id) => {
                    return _id === productId ? qnt + 1 : qnt
                  }, 0)
                )
              }
            }else{
              if(storedFreebies){                    
                Object.keys(storedFreebies).forEach(key => {                    
                  for(let x = 0; x < storedFreebies[key]._id.length; x++){
                    if(storedFreebies[key]._id[x].includes('|')){
                      if(storedFreebies[key]._id[x].split('|')[0] == productId){
                        let variant_id = storedFreebies[key]._id[x].split('|')[1]
                        let add = data.variations.find(el => el._id == variant_id && el.quantity > 0)
                        //console.log('-------')
                        //console.log(add)
                        if(add !== "undefined"){
                          data.price = 0
                          data.quantity = 1
                          data.name = add.name
                          console.log(data)
                          ecomCart.addProduct(
                            {
                              ...data,
                              variation_id : variant_id,
                              keep_item_price: true,
                              flags: ['freebie', '__tmp']
                            },
                            null,
                            productIds.reduce((qnt, _id) => {
                              return _id === productId ? qnt + 1 : qnt
                            }, 0)
                          )
                        }
                         
                        // console.log('ae')
                        // console.log(data)
                      }
                    }                     
                  }    
                });
              }
            }            
          })
          .catch(console.error)
      }
    })
  }
}

export default {
  name: 'DiscountApplier',

  components: {
    AAlert
  },

  props: {
    amount: Object,
    couponCode: String,
    hasCouponInput: {
      type: Boolean,
      default: true
    },
    isFormAlwaysVisible: Boolean,
    isCouponApplied: Boolean,
    isAttentionWanted: Boolean,
    canAddFreebieItems: {
      type: Boolean,
      default: true
    },
    modulesPayload: Object,
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
      alertText: null,
      alertVariant: null,
      isFormVisible: this.isFormAlwaysVisible || this.couponCode,
      isLoading: false,
      localCouponCode: this.couponCode,
      localAmountTotal: null,
      isUpdateSheduled: false,
      freebieData:null
    }
  },

  computed: {
    i19add: () => i18n(i19add),
    i19addDiscountCoupon: () => i18n(i19addDiscountCoupon),
    i19code: () => i18n(i19code),
    i19couponAppliedMsg: () => i18n(i19couponAppliedMsg),
    i19discountCoupon: () => i18n(i19discountCoupon),
    i19hasCouponOrVoucherQn: () => i18n(i19hasCouponOrVoucherQn),
    i19invalidCouponMsg: () => i18n(i19invalidCouponMsg),
    i19campaignAppliedMsg: () => i18n(i19campaignAppliedMsg),

    canAddCoupon () {
      return !this.couponCode || !this.isCouponApplied ||
        this.couponCode !== this.localCouponCode
    }
  },

  methods: {
    getFreebies(){
      const { freebieData } = this
      
      let _customer = {}
     
      if (this.ecomPassport.checkLogin()) {
        const customer = this.ecomPassport.getCustomer()        
        _customer._id = customer._id        
        if (customer.display_name) {
          _customer._id = customer.display_name        
        }
      }

      axios.post('https://us-central1-blow-gummies-app-brinde.cloudfunctions.net/app/ws/available-gifts', {
        storeId : storefront.settings.store_id,      
        params: {
          customer: _customer,
          amount: {
            subtotal: this.localAmountTotal,
            ...this.amount,
            total: this.localAmountTotal,
            discount: 0
          },
          items: this.ecomCart.data.items,
        }
      })
      .then((response) => {
        $('#app-blow_gummies').remove();
        $('.cart__list').after('<div id="app-blow_gummies"></div>');
        let selected_ids = []
        $.each(response.data.rules, function(k, rule){
          $('#app-blow_gummies').append('<p class="freebie-rule-name">Selecione até <b>'+ rule.selectable +' brinde(s)</b> para a campanha: <b>'+ rule.label +'</b></p>')
          let _rule = $('<div class="freebie-rule" selectable="'+ rule.selectable +'" rule="rule_'+ k +'" label="'+ rule.label +'"></div>')
          _rule.append('<input type="hidden" name="rule_'+ k +'"/>')
          $.each(rule.product_ids, function(k2, product_id){
            store({ url: `/products/${product_id}.json` })
            .then(({ data }) => {
              //console.log(data)
              if ((!data.variations || !data.variations.length)) {
                if(data.quantity > 0){
                  let is_selected = freebieData != null ? (typeof freebieData[rule.label] !== 'undefined' ? (freebieData[rule.label]._id.find(el => el == data._id) ? true : false) : false ) : false;
                  
                  let already_selected = selected_ids.includes(data._id) ? true : false;
                  
                  if(!selected_ids.includes(data._id) && is_selected){
                    selected_ids.push(data._id)                    
                  }
                  
                  _rule.append('<div class="freebie-item '+ (already_selected == true ? 'already_selected' : '') +'" product_id="'+ data._id +'">'+ (already_selected ? '<span>Brinde já adicionado</span>' : '') +'<img src="'+ data.pictures[0].normal.url +'"/><label>' + data.name + '</label><button class="btn '+ (is_selected ? 'active' : '') +'" type="button">'+ (is_selected ? 'Selecionado' : 'Selecionar') +'</button></div>')        
                }
              }else{
                let is_selected = freebieData != null ? (typeof freebieData[rule.label] !== 'undefined' ? (freebieData[rule.label]._id.find(el => el .includes(data._id)) ? true : false) : false ) : false;
                let variant_selected = freebieData != null ? (typeof freebieData[rule.label] !== 'undefined' ? (freebieData[rule.label]._id.find(el => el .includes(data._id)) ? freebieData[rule.label]._id.find(el => el .includes(data._id)).split('|')[1] : false) : false ) : false;
                
                let already_selected = selected_ids.includes(data._id) ? true : false;
                if(!selected_ids.includes(data._id) && is_selected){
                  selected_ids.push(data._id)                    
                }

                let freebie_item = $('<div class="freebie-item '+ (already_selected == true ? 'already_selected' : '') +'" product_id="'+ data._id +'">'+ (already_selected ? '<span>Brinde já adicionado</span>' : '') +'<img src="'+ data.pictures[0].normal.url +'"/><label>' + data.name + '</label><select attr="variant_id" '+ (variant_selected != false ? "class=\"readonly\"" : '') + '></select><button class="btn '+ (is_selected ? 'active' : '') +'" type="button">'+ (is_selected ? 'Selecionado' : 'Selecionar') +'</button></div>');
                let select = freebie_item.find('select');
                $.each(data.variations, function(k3, variant){
                  if(variant.quantity > 0){
                    //console.log(variant._id + ' --- ' + variant_selected)
                    select.append('<option value="'+ variant._id+'" '+ (variant_selected == variant._id ? "selected" : '') +'>'+ variant.name.replace(data.name + ' / ','') +'</option>');
                  }
                })  
                _rule.append(freebie_item)        
              }
            })
            .catch(console.error())           
          })          
          $('#app-blow_gummies').append(_rule)
        })  
        $('body').on('click','',function(){
          
        })
      })      
    },
    fixAmount () {
      const amount = this.amount || {
        subtotal: this.ecomCart.data.subtotal
      }
      this.localAmountTotal = (amount.subtotal || 0) + (amount.freight || 0)
    },

    parseDiscountOptions (listResult = []) {
      let extraDiscountValue = 0
      if (listResult.length) {
        let discountRule, invalidCouponMsg
        listResult.forEach(appResult => {
          const { validated, error, response, app_id } = appResult
          if (validated && !error) {
            const appDiscountRule = response.discount_rule
            if (appDiscountRule) {
              const discountRuleValue = appDiscountRule.extra_discount.value
              if (!(extraDiscountValue > discountRuleValue)) {
                extraDiscountValue = discountRuleValue
                discountRule = {
                  app_id: appResult.app_id,
                  ...appDiscountRule
                }
              }
            } else if (response.invalid_coupon_message) {
              invalidCouponMsg = response.invalid_coupon_message
            }
            if (this.canAddFreebieItems) {
              if(app_id == 120452){
                //addFreebieItems(this.ecomCart, response.freebie_product_ids)
                if(typeof response.freebie_product_ids !== "undefined"){                
                  let availableFreebies = []
                  let storedFreebies = typeof sessionStorage.getItem('freebieData') !== "undefined" ? JSON.parse(sessionStorage.getItem('freebieData')) : []
                  
                  
                  if(storedFreebies){                    
                    Object.keys(storedFreebies).forEach(key => {                    
                      for(let x = 0; x < storedFreebies[key]._id.length; x++){
                        if(storedFreebies[key]._id[x].includes('|')){
                          availableFreebies.push(storedFreebies[key]._id[x].split('|')[0])
                        }else{
                          availableFreebies.push(storedFreebies[key]._id[x])
                        }                      
                      }    
                    });
                  }

                  let freebieCall = []
                  response.freebie_product_ids.forEach(item => {
                    if(availableFreebies.find(el => el === item)){
                      //console.log('add - ' + item)
                      freebieCall.push(item)
                      
                    }
                  })
                  //console.log('app blow')
                  addFreebieItems(this.ecomCart, freebieCall)
                }   
              }else{
                //console.log('app default')
                addFreebieItems(this.ecomCart, response.freebie_product_ids)
              }           
            }
          }
        })
        if (extraDiscountValue) {
          if (this.localCouponCode) {
            this.$emit('update:coupon-code', this.localCouponCode)
            this.alertText = this.i19couponAppliedMsg
          } else {
            this.alertText = this.i19campaignAppliedMsg
          }
          this.$emit('set-discount-rule', discountRule)
          this.alertVariant = 'info'
        } else {
          if (this.localCouponCode) {
            this.alertText = invalidCouponMsg || this.i19invalidCouponMsg
            this.alertVariant = 'warning'
          } else {
            this.alertText = null
          }
          this.$emit('set-discount-rule', {})
        }
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
          ...this.modulesPayload,
          amount: {
            subtotal: this.localAmountTotal,
            ...this.amount,
            total: this.localAmountTotal,
            discount: 0
          },
          items: this.ecomCart.data.items,
          ...data,
          gummies_app : (typeof sessionStorage.getItem('freebieData') !== "undefined" ? JSON.parse(sessionStorage.getItem('freebieData')) : [])
        }
      })
        .then(({ data }) => this.parseDiscountOptions(data.result))
        .catch(err => {
          console.error(err)
          this.alertVariant = 'danger'
          this.alertText = i18n(i19errorMsg)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    submitCoupon (isForceUpdate) {
      if (isForceUpdate || this.canAddCoupon) {
        const { localCouponCode } = this
        const data = {
          discount_coupon: localCouponCode
        }
        this.fetchDiscountOptions(data)
      }
    },

    updateDiscount (isForceUpdate = true) {
      if (this.couponCode) {
        if (isForceUpdate || !this.isCouponApplied) {
          this.submitCoupon(isForceUpdate)
        }
      } else if (
        isForceUpdate ||
        (!this.isUpdateSheduled && this.amount && this.localAmountTotal)
      ) {
        this.fetchDiscountOptions()
      }
    }
  },

  watch: {
    couponCode (couponCode) {
      if (couponCode !== this.couponCode) {
        this.localCouponCode = couponCode
        if (couponCode && !this.isFormVisible) {
          this.isFormVisible = true
        }
      }
    },

    isFormAlwaysVisible (isFormVisible) {
      if (isFormVisible) {
        this.isFormVisible = true
      }
    },

    isFormVisible (isFormVisible) {
      if (isFormVisible) {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    },

    localAmountTotal (total, oldTotal) {
      if (oldTotal !== null && Math.abs(total - oldTotal) > 0.01 && !this.isUpdateSheduled) {
        this.isUpdateSheduled = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.updateDiscount()
            this.isUpdateSheduled = false
          }, 600)
        })
      }
    },

    amount: {
      handler () {
        this.fixAmount()
      },
      deep: true
    }
  },

  mounted () {
    this.fixAmount()
    this.updateDiscount(false)
    
    this.freebieData = JSON.parse(sessionStorage.getItem('freebieData'))    
    this.getFreebies()   
    
    
  },
  created(){
    window.frontFetchFreebies = this.fetchDiscountOptions
    window.removeFreebie = this.ecomCart.removeItem
    window.ecomCustomCart = this.ecomCart
  }
}
