import * as React from "react";
import { useMutation } from "react-query";
import { Box, Button, Heading, Image, Input, Spinner } from "theme-ui";
import { Layout } from "../components/Layout";

async function screenshotRequest(tweetUrl) {
    const res = await fetch(
        `https://pifc233qp6.execute-api.us-east-1.amazonaws.com/dev/embed?url=${tweetUrl}`
    );

    return res.json();
}

// https://twitter.com/KatieFujihara/status/1335796664527818752
function ScreenshotTaker() {
    const [tweetUrl, setTweetUrl] = React.useState("");
    const [screenshotUrl, setScreenshotUrl] = React.useState(null);
    const [takeScreenshot, { isLoading }] = useMutation(screenshotRequest, {
        onSuccess: (data) => {
            setScreenshotUrl(data.url);
        },
    });

    function handleSubmit(event) {
        event.preventDefault();

        takeScreenshot(tweetUrl);
    }

    return (
        <Box
            as="form"
            sx={{ pt: [3, 5, 7], textAlign: "center" }}
            onSubmit={handleSubmit}
        >
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

export default function Home() {
    return (
        <Layout title="twitshot.xyz">
            <Heading sx={{ fontSize: [3, 5, 7], textAlign: "center" }}>
                TwitShot.xyz
            </Heading>
            <Heading sx={{ fontSize: [1, 4, 5], textAlign: "center" }}>
                screenshots of your tweets
            </Heading>

            <ScreenshotTaker />
        </Layout>
    );
}
