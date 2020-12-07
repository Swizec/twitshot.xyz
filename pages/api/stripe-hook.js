import Stripe from "stripe";
const stripe = Stripe("kvBqgq7OCZs9e730tl9nEbG1I2JDfjWo");

// TODO: should be in env vars
const endpointSecret = "whsec_uqRFAm4Mjcsj8VZzLsa1k4v8itMtW6HG";

export default function handler(req, res) {
    if (req.method === "POST") {
        const sig = req.headers["stripe-signature"];

        console.log(req);

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret
            );
        } catch (err) {
            console.log(err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(event);
        // TODO: add auth role to user

        return res.json({ received: true });
    } else {
        res.json({ hello: "world" });
    }
}
