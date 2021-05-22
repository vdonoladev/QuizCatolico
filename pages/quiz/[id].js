import QuizTemplate from '../../src/template/Quiz';

export default function Page({dbExterno}) {

  return (
    <QuizTemplate backgroundImage={dbExterno.bg} questions={dbExterno.questions} />
  );
}

export async function getServerSideProps({query}) {

  const id = query.id;
  const url = `https://${id}.vercel.app/api/db`;

  console.log(url);

  const dbExterno = await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.text);
    }
  })
  .then((response) => {
    return response;
  })  
  .catch((err) => {
    console.error(err)
  });

  return {
    props: {
      dbExterno
    }
  }

}