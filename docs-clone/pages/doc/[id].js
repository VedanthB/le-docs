import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { db } from "../../firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { getSession, signOut, useSession } from "next-auth/client";
import Login from "../../components/Login";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import TextEditor from "../../components/TextEditor";
import Head from "next/head";

function Doc() {
  const [session] = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db
      .collection("userDocs")
      .doc(session?.user?.email)
      .collection("docs")
      .doc(id)
  );

  if (!session) return <Login />;

  // If we are not authorized to display this URL, we are redirected to the home
  // Buggy! @todo: Fix it with Rules Firestore
  /* if (!loadingSnapshot && !snapshot?.data()?.fileName) {
    router.replace("/");
  } */

  return (
    <div >
      <Head>
        <title>{snapshot?.data()?.fileName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gray-800 flex justify-between items-center p-3 pb-1">
        <Link href="/">
          <a>
            <Icon name="description" size="5xl" color="blue" />
          </a>
        </Link>

        <div className="flex-grow px-2">
          <h2 className="text-white">{snapshot?.data()?.fileName}</h2>
          <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-white">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>

        <Button
          color="lightBlue"
          buttonType="filled"
          size="regular"
          className="hidden md:inline-flex h-10"
          rounded={false}
          block={false}
          iconOnly={false}
          ripple="light"
        >
          <Icon name="people" size="md" /> SHARE
        </Button>

        <img
          className="rounded-full cursor-pointer h-12 w-12 ml-2"
          src={session.user.image}
          alt=""
        />
      </header>

      <TextEditor />
    </div>
  );
}

export default Doc;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
