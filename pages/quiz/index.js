import styled from 'styled-components';
import { useRouter } from 'next/router';
import React from 'react';

import db from '../../config/db.json';
import QuizTemplate from '../../src/template/Quiz';

export default function QuizPage() {
  return (<QuizTemplate questions={db.questions} backgroundImage={db.bg} />);
}
