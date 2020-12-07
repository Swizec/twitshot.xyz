import { ThemeProvider } from "theme-ui";
import { future } from "@theme-ui/presets";

const theme = {
    ...future,
    container: {
        maxWidth: 900,
    },
};

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
