import { Heading } from "theme-ui";
import { Layout } from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <Layout title="twitshot.xyz">
            <Heading sx={{ fontSize: [3, 5, 7], textAlign: "center" }}>
                TwitShot.xyz
            </Heading>
            <Heading sx={{ fontSize: [1, 4, 5], textAlign: "center" }}>
                screenshots of your tweets
            </Heading>
        </Layout>
    );
}
