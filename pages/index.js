import * as React from "react";
import { useMutation } from "react-query";
import { Box, Button, Heading, Image, Input, Spinner } from "theme-ui";

import { useLocalStorage } from "../components/useLocalStorage";
import { Layout } from "../components/Layout";
import { useAuth } from "react-use-auth";

async function screenshotRequest(tweetUrl) {
    const res = await fetch(
        `https://pifc233qp6.execute-api.us-east-1.amazonaws.com/dev/embed?url=${tweetUrl}`
    );

    return res.json();
}

// https://twitter.com/KatieFujihara/status/1335796664527818752
function ScreenshotTaker() {
    const { user } = useAuth();

    const [tweetUrl, setTweetUrl] = React.useState("");
    const [screenshotUrl, setScreenshotUrl] = React.useState(null);
    const [screenshotCount, setScreenshotCount] = useLocalStorage(
        "twitshot.xyz-count",
        "0"
    );

    const [takeScreenshot, { isLoading }] = useMutation(screenshotRequest, {
        onSuccess: (data) => {
            setScreenshotUrl(data.url);
        },
    });

    function handleSubmit(event) {
        event.preventDefault();

        takeScreenshot(tweetUrl);
        setScreenshotCount(Number(screenshotCount) + 1);
    }

    return (
        <Box
            as="form"
            sx={{ pt: [3, 5, 7], textAlign: "center" }}
            onSubmit={handleSubmit}
        >
            {user ? (
                <Heading sx={{ pb: 3 }}>
                    Seen a good tweet, {user.nickname}?
                </Heading>
            ) : null}
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Input
                        text={tweetUrl}
                        onChange={(event) => setTweetUrl(event.target.value)}
                        placeholder="Paste tweet URL"
                    />
                    <Button sx={{ mt: 2, cursor: "pointer" }}>
                        Screenshot!
                    </Button>
                </>
            )}
            {screenshotUrl ? <Image src={screenshotUrl} /> : null}
        </Box>
    );
}

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

export default function Home() {
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
            ) : (
                <ScreenshotTaker />
            )}
        </Layout>
    );
}
