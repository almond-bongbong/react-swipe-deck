import { useLayoutEffect, useState } from 'react';
import styles from './progress-mask.module.scss';
import { clamp } from '@/utils/math.ts';
import iconThumbUpFilled from '@/assets/icons/thumb-up.svg';
import iconThumbDownFilled from '@/assets/icons/thumb-down.svg';

interface Props {
  progress: number; // -1 ~ 1
  isInteracting: boolean;
}

function ProgressMask({ progress, isInteracting }: Props) {
  const [status, setStatus] = useState<'good' | 'bad' | null>(null);
  const isGood = status === 'good';
  const isBad = status === 'bad';

  useLayoutEffect(() => {
    if (progress > 0) {
      setStatus('good');
    }

    if (progress < 0) {
      setStatus('bad');
    }
  }, [progress]);

  const dasharray = Math.PI * 2 * 27;
  const dashoffset = dasharray - Math.PI * 2 * 27 * clamp(progress, -1, 1);
  const isActive = Math.abs(progress) === 1;

  return (
    <div
      className={[
        styles.container,
        isActive && styles.active,
        isGood && styles.good,
        isBad && styles.bad,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        opacity: Math.abs(progress) * 0.95, // 최대 0.8
        transition: isInteracting ? '' : 'opacity 0.3s linear',
      }}
    >
      <div className={styles.circle_wrap}>
        <svg
          className={styles.circle_progress}
          width="60"
          height="60"
          viewBox="0 0 60 60"
        >
          <circle
            className={styles.bar}
            cx="30"
            cy="30"
            r="27"
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            style={{
              transition: isInteracting ? '' : 'stroke-dashoffset 0.3s linear',
            }}
          />
        </svg>

        <div className={styles.icon_wrap}>
          {isGood && (
            <img
              src={iconThumbUpFilled}
              className={styles.icon_good}
              alt="good"
            />
          )}
          {isBad && (
            <img
              src={iconThumbDownFilled}
              className={styles.icon_bad}
              alt="bad"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressMask;
