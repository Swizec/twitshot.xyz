import { Container } from "theme-ui";
import Head from "next/head";

export const Layout = ({ title, children }) => {
    return (
        <Container>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {children}
        </Container>
    );
};
