import { moveIngredient, removeIngredient } from '@/services/slices/constructor-slice';
import { decrementCounter } from '@/services/slices/ingredients-slice';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/services';
import type { TIngredientWithKey } from '@/services/slices/constructor-slice';

import styles from './draggable-ingredient.module.css';

export const DraggableIngredient = ({
  ingredient,
  index,
}: {
  ingredient: TIngredientWithKey;
  index: number;
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const [, drag] = useDrag({
    type: 'ingredient',
    item: { ingredient, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ingredient',
    canDrop: (item: { ingredient: TIngredientWithKey; index: number }) => {
      return item.index !== index;
    },
    hover: (item: { ingredient: TIngredientWithKey; index: number }) => {
      if (item.index === index) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
        drop(node);
      }
    },
    [drag, drop]
  );

  const handleRemoveElement = (key: string, id: string): void => {
    dispatch(removeIngredient(key));
    dispatch(decrementCounter(id));
  };

  return (
    <div ref={ref} className={`${styles.element} ml-4 mr-4 mb-4`}>
      <DragIcon type="primary" className="mr-1" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image_mobile}
        handleClose={() => handleRemoveElement(ingredient.key, ingredient._id)}
      />
    </div>
  );
};
