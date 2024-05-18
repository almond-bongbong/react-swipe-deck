import { useState } from 'react';
import styles from './App.module.scss';
import { CARD_LIST } from '@/constants/card.ts';
import Layout from '@/components/layout';
import ProgressBar from '@/components/progress-bar';
import PickCard from '@/components/pick-card';

function App() {
  const [cardList, setCardList] = useState(CARD_LIST);
  const progress = 1 - cardList.length / CARD_LIST.length;

  return (
    <Layout className={styles.container}>
      <ProgressBar progress={progress} className={styles.progress} />

      <PickCard
        cardList={cardList}
        onEvaluate={(card) => {
          setCardList((prev) => prev.filter((c) => c.name !== card.name));
        }}
      />
    </Layout>
  );
}

export default App;
