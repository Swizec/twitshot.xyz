import * as React from "react";
import { Box, Button, Heading, Spinner } from "theme-ui";
import Stripe from "stripe";

import { useLocalStorage } from "../components/useLocalStorage";
import { Layout } from "../components/Layout";
import { useAuth } from "react-use-auth";
import { ScreenshotTaker } from "../components/ScreenshotTaker";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

function LoginWall() {
    const { isAuthenticated, login, logout, user } = useAuth();

    return (
        <Box sx={{ textAlign: "center", pt: [3, 5, 7] }}>
            <Heading>You love TwitShot! Login to continue</Heading>
            {!isAuthenticated() ? (
                <Button onClick={login}>Login</Button>
            ) : (
                user.nickname
            )}
        </Box>
    );
}

export async function getServerSideProps() {
    // TODO: move to env vars
    const stripe = Stripe("kvBqgq7OCZs9e730tl9nEbG1I2JDfjWo");
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 500,
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
    const { user } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);

    async function handleSubmit(event) {
        if (isLoading) return;

        event.preventDefault();
        setIsLoading(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.nickname,
                    email: user.email,
                },
            },
        });

        setIsLoading(false);

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === "succeeded") {
                alert("Thanks!");
            }
        }
    }

    return (
        <Box
            as="form"
            sx={{ width: ["100%", "100%", 280], margin: "auto", pt: [3, 5, 7] }}
            onSubmit={handleSubmit}
        >
            <Box sx={{ width: ["100%", "100%", 280], margin: "auto" }}>
                <CardElement />
            </Box>
            <Button sx={{ mt: 3 }}>
                {isLoading ? <Spinner color="white" /> : "Buy for $5 "}
            </Button>
        </Box>
    );
}

function PayWall({ clientSecret }) {
    // TODO: should be env var
    const stripePromise = loadStripe("pk_5WyhDiasKtEhmWiYGeGLvHRqm5Fcn");

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
        </Elements>
    );
}

export default function Home({ clientSecret }) {
    const { isAuthenticated, isAuthorized, user } = useAuth();
    const [screenshotCount, setScreenshotCount] = useLocalStorage(
        "twitshot.xyz-count",
        "0"
    );

    return (
        <Layout title="twitshot.xyz">
            <Heading sx={{ fontSize: [3, 5, 7], textAlign: "center" }}>
                TwitShot.xyz
            </Heading>
            <Heading sx={{ fontSize: [1, 4, 5], textAlign: "center" }}>
                screenshots of your tweets
            </Heading>

            {/* TODO: block should happen on user action, not page load */}
            {Number(screenshotCount) > 2 && !isAuthenticated() ? (
                <LoginWall />
            ) : Number(screenshotCount) > 6 &&
              isAuthenticated() &&
              !isAuthorized("has_paid") ? (
                <PayWall clientSecret={clientSecret} />
            ) : (
                <ScreenshotTaker />
            )}
        </Layout>
    );
}
