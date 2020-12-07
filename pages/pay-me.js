import { Button, Heading } from "theme-ui";
import Stripe from "stripe";
import { Layout } from "../components/Layout";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

// TODO: move to an ENV var
const stripe = Stripe("kvBqgq7OCZs9e730tl9nEbG1I2JDfjWo");

export async function getServerSideProps() {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: "usd",
    });

    return {
        props: {
            clientSecret: paymentIntent.client_secret,
        },
    };
}

function CheckoutForm({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();

    async function buy(event) {
        event.preventDefault();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: "Jenny Rosen",
                },
            },
        });
    }

    return (
        <form onSubmit={buy}>
            <CardElement />
            <Button disabled={!stripe}>Buy</Button>
        </form>
    );
}

export default function PayMe({ clientSecret }) {
    // TODO: move to an ENV var
    const stripePromise = loadStripe("pk_5WyhDiasKtEhmWiYGeGLvHRqm5Fcn");

    return (
        <Layout title="Pay Me">
            <Heading>Hello world</Heading>
            <Elements stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} />
            </Elements>
        </Layout>
    );
}
