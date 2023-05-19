#sf-node-stripe

Provides a jump start to implementing [Stripe](https://stripe.com/docs/api) into salesforce. Contains a single endpoint ```/payment``` that will issue a PCI Compliant url for you to be redirected to. Also contains to a webhook endpoint ```/webhook``` to perform any other actions you need once the payment is complete.

Currently the webhook is configured for the event ```checkout.session.completed``` [See Docs](https://stripe.com/docs/api/events/types)

##Getting Started

For the Salesforce side [click here](https://github.com/effordDev/sf-stripe)

For dynamic payments, a map of store items containing an id, and price should be built and stored on the server. Then in the request pass the quantity and id of the item in the request and populate the ```line_items``` object in the ```/payment``` endpoint.

```js
const storeItems = new Map([
     [1, { priceInCents: 10000, name: "Item 1" }],
     [2, { priceInCents: 20000, name: "Item 2" }],
])

const session = await stripe.checkout.sessions.create({
     payment_method_types: ["card"],
     mode: "payment",
     line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
               price_data: {
                    currency: "usd",
                    product_data: {
                         name: storeItem.name,
                    },
                    unit_amount: storeItem.priceInCents,
               },
               quantity: item.quantity,
          }
     }),
     ...
})
```

###Webhooks

To configure your webhook, navigate to the [Stripe Developer Dashboard](https://dashboard.stripe.com/test/developers) and select Webhooks.

The Hosted Endpoint URL will be your server url + ```/webhook```. [See the docs](https://stripe.com/docs/api/webhook_endpoints)

### Environment Variables

ENC_KEY, IV should be 128 bits (I used https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx)

SECRET_HASH should be the hex value of the plain text value hashed.

     STRIPE_PRIVATE_KEY
     WEBHOOK_SECRET

     SECRET_HASH
     ENC_KEY
     IV

     sfLoginUrl
     sfUsername
     sfPassword
     sfToken
     sfOrgId

     ReturnUrl

     ALLOWED_01