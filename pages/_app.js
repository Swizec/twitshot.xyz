import { ThemeProvider } from "theme-ui";
import { future } from "@theme-ui/presets";
import { AuthConfig, Providers } from "react-use-auth";
import { useRouter } from "next/router";

const theme = {
    ...future,
    container: {
        maxWidth: 900,
    },
};

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <ThemeProvider theme={theme}>
            <AuthConfig
                navigate={(url) => router.push(url)}
                authProvider={Providers.Auth0}
                params={{
                    clientID: "uBfbM4SvGcroXXZq1LKg86m7TDbnC4b2",
                    domain: "twitshotxyz.us.auth0.com",
                }}
            />

            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
