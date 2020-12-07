import Stripe from "stripe";

export default function handler(req, res) {
    if (req.method === "POST") {
        const stripe = Stripe("kvBqgq7OCZs9e730tl9nEbG1I2JDfjWo");
        const endpointSecret = "whsec_uqRFAm4Mjcsj8VZzLsa1k4v8itMtW6HG";
        const sig = req.headers["stripe-signature"];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                JSON.stringify(req.body),
                sig,
                endpointSecret
            );
        } catch (err) {
            console.log("ERROR");
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("MADE IT");

        // console.log(event);

        res.json({ received: true });
    }
}
