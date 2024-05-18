import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './pick-card.module.scss';
import iconThumbUpFilled from '@/assets/icons/thumb-up.svg';
import iconThumbDownFilled from '@/assets/icons/thumb-down.svg';
import { clamp } from '@/utils/math.ts';
import PickCardResult from '@/components/pick-card-result';
import ProgressMask from '@/components/progress-mask';

interface InteractionStart {
  x: number;
  y: number;
  $card?: HTMLDivElement;
}

export type EvaluateStatus = 'good' | 'bad';

interface Card {
  name: string;
  image: string;
}

interface Props {
  cardList: Card[];
  onEvaluate?: (card: Card, status: EvaluateStatus) => void;
}

/**
 * Get position of mouse or touch event
 * @param event mouse or touch event
 * @returns position of x and y
 */
const getPosition = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
) => {
  if ('touches' in event) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  } else {
    return { x: event.clientX, y: event.clientY };
  }
};

function PickCard({ cardList = [], onEvaluate }: Props) {
  const interactionRef = useRef<InteractionStart>();
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(cardList.length - 1);

  // animation progress(-1 ~ 1)
  const [progress, setProgress] = useState(0);

  /**
   * Start interaction
   * @param e mouse or touch event
   * @returns void
   */
  const handleStart = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    ) => {
      document.body.classList.add(styles.fix_container);
      e.currentTarget.style.transition = '';

      const { x, y } = getPosition(e);
      interactionRef.current = {
        x,
        y,
        $card: e.currentTarget,
      };

      setIsInteracting(true);
    },
    [],
  );

  /**
   * Move interaction
   * @param e mouse or touch event
   * @returns void
   */
  const handleMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!interactionRef.current) {
      return;
    }

    const $card = interactionRef.current.$card;
    if (!$card) {
      return;
    }

    const { x, y } = getPosition(e);
    const dx = (x - interactionRef.current.x) * 0.8;
    const dy = (y - interactionRef.current.y) * 0.5;
    const deg = (dx / 600) * -30;

    $card.style.transform = `translate(${dx}px, ${dy}px) rotate(${deg}deg)`;

    const newProgress = clamp(dx / 100, -1, 1);
    setProgress(newProgress);
  }, []);

  /**
   * End interaction
   * @returns void
   */
  const handleEnd = useCallback(() => {
    const $card = interactionRef.current?.$card;
    if (!$card) {
      return;
    }

    const isSelect = Math.abs(progress) === 1;
    const isGood = progress === 1;
    const [, currentXString] =
      $card.style.transform.match(/translate\(([^,]+), [^)]+\)/) || [];
    const [, currentYString] =
      $card.style.transform.match(/translate\([^,]+, ([^)]+)\)/) || [];
    const [, currentRotateString] =
      $card.style.transform.match(/rotate\(([^)]+)\)/) || [];

    const currentX = parseInt(currentXString, 10);
    const currentY = parseInt(currentYString, 10);
    const currentRotate = parseInt(currentRotateString, 10);
    const dx = isGood
      ? window.innerWidth
      : (window.innerWidth + $card.getBoundingClientRect().width) * -1;

    $card.style.transition = 'transform 0.3s ease-in-out';
    $card.style.transform = isSelect
      ? `translate(${currentX + dx}px, ${currentY}px) rotate(${currentRotate * 2}deg)`
      : 'translate(0, 0) rotate(0deg)';

    interactionRef.current = undefined;
    setIsInteracting(false);
    setProgress(0);

    if (isSelect) {
      setActiveIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      document.body.classList.remove(styles.fix_container);

      if (isSelect) {
        const selectedCard = cardList[cardList.length - 1];
        onEvaluate?.(selectedCard, isGood ? 'good' : 'bad');
      }
    }, 300);
  }, [cardList, onEvaluate, progress]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleMove, handleEnd]);

  /**
   * Good or Bad evaluate
   */
  const handleEvaluate = (status: EvaluateStatus) => {
    window.navigator?.vibrate?.(50);
    const selectedCard = cardList[cardList.length - 1];

    if (!selectedCard || activeIndex !== cardList.length - 1) {
      return;
    }

    const $cardAll = document.querySelectorAll(`.${styles.card}`);
    const selectedCardElement = $cardAll[$cardAll.length - 1] as HTMLDivElement;

    setProgress(status === 'good' ? 1 : -1);
    selectedCardElement.style.transition = 'transform 0.3s ease-in-out';
    selectedCardElement.style.transform =
      status === 'good'
        ? `translateX(120%) rotate(-30deg)`
        : `translateX(-150%) rotate(30deg)`;

    setActiveIndex((prev) => prev - 1);
    setTimeout(() => {
      setProgress(0);
      onEvaluate?.(selectedCard, status);
    }, 300);
  };

  return (
    <>
      <div className={styles.container}>
        <PickCardResult />

        {cardList.map((card, index) => {
          const isActiveCard = index >= activeIndex;
          const isLastCard = index === cardList.length - 1;

          return (
            <div
              key={index}
              className={[styles.card, isActiveCard && styles.active]
                .filter(Boolean)
                .join(' ')}
              {...(isLastCard && {
                onTouchStart: handleStart,
                onMouseDown: handleStart,
              })}
            >
              <div className={styles.card_inner}>
                <div className={styles.image_wrap}>
                  <img
                    src={card.image}
                    width={600}
                    height={600}
                    alt={card.name}
                    className={styles.image}
                  />
                </div>
                <div className={styles.name}>{card.name}</div>

                {isLastCard && (
                  <ProgressMask
                    progress={progress}
                    isInteracting={isInteracting}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeIndex >= 0 && (
        <div className={styles.button_wrap}>
          <button
            type="button"
            className={styles.bad_button}
            onClick={() => handleEvaluate('bad')}
          >
            <img src={iconThumbDownFilled} alt="bad" />
          </button>

          <button
            type="button"
            className={styles.good_button}
            onClick={() => handleEvaluate('good')}
          >
            <img src={iconThumbUpFilled} alt="good" />
          </button>
        </div>
      )}
    </>
  );
}

export default PickCard;
