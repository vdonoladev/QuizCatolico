import styled from 'styled-components';
import { useRouter } from 'next/router';
import React from 'react';

import Widget from '../../components/Widget';
import Footer from '../../components/Footer';
import GitHubCorner from '../../components/GithubCorner';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import QuizLogo from '../../components/QuizLogo';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import Link from '../../components/Link';
import Lootie from 'react-lottie';

import animationData from '../../../assets/lootie_loading.json';
import BackLinkArrow from '../../components/BackLinkArrow';

const lootieDefault = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderSettings: {
    preserveAspectRatio: 'xMidYmid slice'
  }
}

function LoadingWidget() {
  const [animationState, setAnimationState] = React.useState({
    isStoped: false, isPaused: false
  });

  return (
    <Widget>
      <Widget.Content>
        <Lootie 
          options={lootieDefault}
          width={120}
          height={120}
          style={{backgroundColor: 'transparent'}}
          isStopped={animationState.isStoped}
          isPaused={animationState.isPaused}
        >

        </Lootie>
        <h2>Carregando...</h2>
      </Widget.Content>
    </Widget>
  );
}

/**
 * 
 * @param {Array} results 
 */
function ResultWidget({results}) {

  const total = results.reduce((sumTotal, current) => {
    if (current === true) {
      return sumTotal + 1;
    } else {
      return sumTotal;
    }
  }, 0);

  return (
    <Widget>
      <Widget.Header>
        Fim do Quiz!
      </Widget.Header>

      <Widget.Content>
        {total === 0 && <p>Você fez {total} pontos. Estude mais para a próxima!</p>}
        {total > 0 && <p>Parabéns! Você fez {total} pontos!</p>}
      </Widget.Content>
      <BackLinkArrow title="Jogar novamente" href="/" />
    </Widget>
  );
}

function QuizQuestion({question, totalQuestions, questionIndex, onSubmit, onResult}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false); 
  const questionId = `question__${questionIndex}`;
  
  let isCorrect = (selectedAlternative === question.answer);
  let isAlternativeSelected = (selectedAlternative !== undefined);

  return (
    <>
      <Widget>
        <Widget.Header>
          <h3>Pergunta {questionIndex + 1 } de {totalQuestions}</h3>
        </Widget.Header>
        <img alt="Descrição" src={question.image} style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }} />
        <Widget.Content>
          <h2>{question.title}</h2>

          <p></p>

          <AlternativesForm onSubmit={(evt) => {
            evt.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              onResult(isCorrect);
              setSelectedAlternative(undefined);
              setIsQuestionSubmited(false);
              onSubmit();
            }, 2 * 1000);
          }}>
            {question.alternatives.map((alternative, i) => {
              const id = `alternative-${i}`;
              const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
              const isSelected = selectedAlternative === i;

              return (
                <Widget.Topic 
                  data-status={isQuestionSubmited && alternativeStatus} 
                  data-selected={isSelected} 
                  as="label" 
                  key={id}>
                  
                  <input 
                    checked={isSelected} 
                    name={questionId} 
                    type="radio" 
                    id={id} 
                    onChange={() => setSelectedAlternative(i)}/>
                
                  {alternative}
                
                </Widget.Topic>
              );

            })}

          <Button disabled={!isAlternativeSelected} type="submit">
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você ERROU!!!</p>}

          </AlternativesForm>

        </Widget.Content>
      </Widget>
    </>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT'
};

export default function QuizPage({questions, backgroundImage}) {
  const router = useRouter();
  const name = router.query.name;
  const totalQuestions = questions.length;

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);


  function addResult(result) {
    setResults([...results, result]);
  }

  function goHome(evt) {
    router.push('/');
  }

  const handleSubmit = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      console.log("acaboou");
      setScreenState(screenStates.RESULT);
    }

  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3000);
  }, []);

  return (
    <QuizBackground backgroundImage={backgroundImage}>
      <QuizContainer>
        <QuizLogo onClick={goHome} href="/" />

        {screenState === screenStates.LOADING && <LoadingWidget /> }

        {screenState === screenStates.QUIZ && (
          <QuizQuestion 
            questionIndex={currentQuestion} 
            totalQuestions={totalQuestions} 
            onSubmit={handleSubmit}
            onResult={addResult}
            question={questions[currentQuestion]} />

        )}
        
        {screenState === screenStates.RESULT && <ResultWidget results={results} /> }
      
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/jbqneto" />
    </QuizBackground>
  );
}
