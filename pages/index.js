import styled from 'styled-components';
import { useRouter } from 'next/router';

import db from '../config/db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GithubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import Link from '../src/components/Link';
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  const submit = (evt) => {
    evt.preventDefault();
    router.push(`/quiz?name=${name}`);
  }

  return (
  <QuizBackground backgroundImage={db.bg}>
    <QuizContainer>
      <Widget as={motion.section}
        variants={{
          show: {opacity: 1},
          hidden: {opacity: 0}
        }}
        initial="hidden"
        animate="show"
        >
        <Widget.Header>
          <h1>{db.title}</h1>
        </Widget.Header>
        <Widget.Content>
          <p>{db.description}</p>
        </Widget.Content>
      </Widget>
      <Widget>
        <Widget.Content>
          <form onSubmit={ submit }>
            <Input onChange={({target}) => setName(target.value)} value={name} placeholder="Informe seu nome" />
            <Button disabled={name.length === 0} type="submit">
              Jogar
            </Button>
          </form>    
        </Widget.Content>
      </Widget>

      <Widget>
        
        <Widget.Content>
          <h1>Quizes da galera</h1>

          <ul>
            {db.external.map((link, i) => {
              
              const linkLabel = link
                .replace(/\//g, '')
                .replace('https:','')
                .replace('.vercel.app','');

              return (
                <li key={`external-${i}`}>
                  <Widget.Topic as={Link} href={`/quiz/${linkLabel}`}>
                    {linkLabel}
                  </Widget.Topic>
                </li>

              );

            })}
          </ul>

        </Widget.Content>

      </Widget>

      <Footer />
    </QuizContainer>
    <GitHubCorner projectUrl="https://github.com/vdonoladev" />
  </QuizBackground>
  );
}
