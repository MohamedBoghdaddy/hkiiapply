// import stripe

// stripe.api_key = 'your_stripe_api_key'

// @app.route('/create-checkout-session', methods=['POST'])
// @jwt_required()
// def create_checkout_session():
//     session = stripe.checkout.Session.create(
//         payment_method_types=['card'],
//         line_items=[{
//             'price_data': {
//                 'currency': 'usd',
//                 'product_data': {
//                     'name': 'Subscription Plan',
//                 },
//                 'unit_amount': 1500,
//             },
//             'quantity': 1,
//         }],
//         mode='subscription',
//         success_url='https://your-website.com/success',
//         cancel_url='https://your-website.com/cancel',
//     )
//     return jsonify(id=session.id)
