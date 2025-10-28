import { selectIngredients } from '@/services/slices/ingredients';
import { useAppSelector } from '@/utils/hooks';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef, useEffect, useCallback } from 'react';

import { BurgerIngredientCard } from './burger-ingredient-card/burger-ingredient-card';

import type { TIngredientWithCounter } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients = useAppSelector(selectIngredients);

  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const ingredientsListRef = useRef<HTMLDivElement>(null);

  const refs = {
    bun: bunRef,
    sauce: sauceRef,
    main: mainRef,
  };

  const groupedIngredients = ingredients.reduce(
    (acc, ing) => {
      if (ing.type === 'bun' || ing.type === 'sauce' || ing.type === 'main') {
        if (!acc[ing.type]) acc[ing.type] = [];
        acc[ing.type].push(ing);
      }
      return acc;
    },
    {} as Record<'bun' | 'sauce' | 'main', TIngredientWithCounter[]>
  );

  const handleTabClick = useCallback((tab: 'bun' | 'sauce' | 'main'): void => {
    setCurrentTab(tab);
    const targetRef = refs[tab].current;
    const listRef = ingredientsListRef.current;

    if (targetRef && listRef) {
      const targetOffset = targetRef.offsetTop - listRef.offsetTop;
      listRef.scrollTo({
        top: targetOffset,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const list = ingredientsListRef.current;
    if (!list) return;

    const scrollTop = list.scrollTop;

    const positions = [
      { type: 'bun' as const, pos: bunRef.current?.offsetTop ?? 0 },
      { type: 'main' as const, pos: mainRef.current?.offsetTop ?? 0 },
      { type: 'sauce' as const, pos: sauceRef.current?.offsetTop ?? 0 },
    ] as const;

    let closestType: 'bun' | 'sauce' | 'main' = 'bun';
    let minDiff = Math.abs(scrollTop - positions[0].pos);

    for (let i = 1; i < positions.length; i++) {
      const diff = Math.abs(scrollTop - positions[i].pos);
      if (diff < minDiff) {
        minDiff = diff;
        closestType = positions[i].type;
      }
    }

    setCurrentTab(closestType);
  }, []);

  useEffect(() => {
    const list = ingredientsListRef.current;
    if (!list) return;

    list.addEventListener('scroll', handleScroll, { passive: true });
    return (): void => list.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getCategoryTitle = (
    type: 'bun' | 'sauce' | 'main'
  ): 'Булки' | 'Начинки' | 'Соусы' => {
    return type === 'bun' ? 'Булки' : type === 'main' ? 'Начинки' : 'Соусы';
  };

  return (
    <section className={`${styles.burger_ingredients}`}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.ingredients_list} mr-4`} ref={ingredientsListRef}>
        {(['bun', 'main', 'sauce'] as const).map(
          (type) =>
            groupedIngredients[type] && (
              <div key={type} ref={refs[type]} className="mt-10">
                <h2 className={`${styles.category_title} mb-6`}>
                  {getCategoryTitle(type)}
                </h2>
                <div className={`${styles.ingredients_grid} mb-15`}>
                  {groupedIngredients[type].map((ing) => (
                    <BurgerIngredientCard
                      key={ing._id}
                      ingredient={ing}
                      count={ing.count}
                    />
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
};
