// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`/api/`);
  const data = (await res.json()) as object;

  // Pass data to the page via props
  return { props: { data } };
}

export default function Page({ data }: { data: object }) {
  return <div>{data.toString()}</div>;
}
