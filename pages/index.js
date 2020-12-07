import * as React from "react";
import { Box, Button, Heading } from "theme-ui";
import Stripe from "stripe";

import { useLocalStorage } from "../components/useLocalStorage";
import { Layout } from "../components/Layout";
import { useAuth } from "react-use-auth";
import { ScreenshotTaker } from "../components/ScreenshotTaker";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements } from "@stripe/react-stripe-js";

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

function PayWall({ clientSecret }) {
    // TODO: should be env var
    const stripePromise = loadStripe("pk_5WyhDiasKtEhmWiYGeGLvHRqm5Fcn");

    return (
        <Elements stripe={stripePromise}>
            <CardElement />
        </Elements>
    );
}

export default function Home({ clientSecret }) {
    const { isAuthenticated } = useAuth();
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
            ) : Number(screenshotCount) > 6 && isAuthenticated() ? (
                <PayWall clientSecret={clientSecret} />
            ) : (
                <ScreenshotTaker />
            )}
        </Layout>
    );
}
