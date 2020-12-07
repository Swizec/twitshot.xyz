import * as React from "react";
import { Box, Button, Heading, Input } from "theme-ui";
import { Layout } from "../components/Layout";

function ScreenshotTaker() {
    const [tweetUrl, setTweetUrl] = React.useState("");
    return (
        <Box as="form" sx={{ pt: [3, 5, 7], textAlign: "center" }}>
            <Input
                text={tweetUrl}
                onChange={(event) => setTweetUrl(event.target.value)}
                placeholder="Paste tweet URL"
            />
            <Button sx={{ mt: 2, cursor: "pointer" }}>Screenshot!</Button>
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
