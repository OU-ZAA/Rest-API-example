import useSwr from "swr";
import fetcher from "../../utils/fetcher";
import { GetServerSideProps } from "next";

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home({ fallbackData }: { fallbackData: User }) {
  const { data, error } = useSwr<User>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

  if (data) {
    return <div>Welcome! {data.name}</div>;
  }
  return <div>Please login</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );
  return { props: { fallbackData: data } };
};
