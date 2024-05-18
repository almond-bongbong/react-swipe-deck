import styles from './pick-card-result.module.scss';

function PickCardResult() {
  return (
    <div className={styles.empty}>
      <div className={styles.title}>Done! 🎉</div>
      <div>
        To check the source code of this project, please visit{' '}
        <a
          href="https://github.com/almond-bongbong/react-swipe-deck"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </div>
    </div>
  );
}

export default PickCardResult;
