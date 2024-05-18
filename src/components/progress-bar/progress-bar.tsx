import styles from './progress-bar.module.scss';

interface Props {
  progress: number; // 0 - 1
  className?: string;
}

function ProgressBar({ progress, className }: Props) {
  const progressPercentage = Math.floor(progress * 100);

  return (
    <div className={[className, styles.container].join(' ')}>
      <div
        className={styles.bar}
        style={{
          width: `${progressPercentage}%`,
        }}
      >
        Progress: {Math.floor(progressPercentage)}%
      </div>
    </div>
  );
}

export default ProgressBar;
