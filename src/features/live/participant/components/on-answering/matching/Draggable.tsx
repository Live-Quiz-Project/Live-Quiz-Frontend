import {
  MouseEvent,
  RefObject,
  ReactNode,
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

type Props = {
  id?: string;
  children?: ReactNode;
  promptRefs: RefObject<HTMLDivElement>[];
  optionRefs: RefObject<HTMLDivElement>[];
  draggedOver: { [x: string]: boolean };
  isEliminated: boolean;
  match?: string;
  setDraggedOver: Dispatch<SetStateAction<{ [x: string]: boolean }>>;
  selectedOptions: { [x: string]: string };
  setSelectedOptions: Dispatch<SetStateAction<{ [x: string]: string }>>;
};

export default function Draggable(props: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
    }

    return () => {
      if (boxRef.current) {
        boxRef.current.removeEventListener("touchstart", onTouchStart);
      }
    };
  }, [boxRef]);

  useEffect(() => {
    const onDrag = () => {
      const thisElement = boxRef.current;
      if (!isDragging || !thisElement) return;
      props.promptRefs.forEach((promptRef) => {
        const otherElement = promptRef.current;
        if (otherElement) {
          if (checkIntersection(thisElement, otherElement)) {
            let newDraggedOver = { ...props.draggedOver };
            Object.entries(newDraggedOver).forEach(([key]) => {
              newDraggedOver[key] = false;
            });
            newDraggedOver[otherElement.id] = true;
            props.setDraggedOver(newDraggedOver);
          }
        }
      });
    };

    document.addEventListener("mousemove", onDrag);
    return () => {
      document.removeEventListener("mousemove", onDrag);
    };
  }, [isDragging, boxRef, props.promptRefs]);

  function checkIntersection(
    element: HTMLDivElement,
    otherElement: HTMLDivElement
  ) {
    const rect1 = element.getBoundingClientRect();
    const rect2 = otherElement.getBoundingClientRect();

    return (
      rect1.x < rect2.x + rect2.width / 3 &&
      rect1.x + rect1.width / 3 > rect2.x &&
      rect1.y < rect2.y + rect2.height / 3 &&
      rect1.y + rect1.height / 3 > rect2.y
    );
  }

  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (props.isEliminated) return;
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  }

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (props.isEliminated) return;
    if (!isDragging) return;
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    setPosition((prevPosition) => ({
      x: prevPosition.x + deltaX,
      y: prevPosition.y + deltaY,
    }));
    setStartPosition({ x: e.clientX, y: e.clientY });
  }

  function onMouseUp() {
    if (props.isEliminated) return;
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    const thisElement = boxRef.current;
    props.promptRefs.forEach((promptRef) => {
      const otherElement = promptRef.current;
      if (thisElement && otherElement) {
        if (checkIntersection(thisElement, otherElement)) {
          let newDraggedOver = { ...props.draggedOver };
          for (const key in newDraggedOver) {
            newDraggedOver[key] = false;
          }
          newDraggedOver[otherElement.id] = true;
          props.setDraggedOver(newDraggedOver);

          let newSelectedOptions = { ...props.selectedOptions };
          for (const key in newSelectedOptions) {
            if (key === props.match) {
              newSelectedOptions[key] = "";
            }
            if (key === otherElement.id) {
              newSelectedOptions[key] = thisElement.id;
            }
          }
          props.setSelectedOptions(newSelectedOptions);
        }
      }
    });
    props.optionRefs.forEach((optionRef) => {
      const otherElement = optionRef.current;
      if (thisElement && otherElement) {
        if (checkIntersection(thisElement, otherElement)) {
          let newDraggedOver = { ...props.draggedOver };
          for (const key in newDraggedOver) {
            newDraggedOver[key] = false;
          }
          props.setDraggedOver(newDraggedOver);
          if (props.match) {
            props.setSelectedOptions((prevSelectedOptions) => {
              let newSelectedOptions = { ...prevSelectedOptions };
              for (const key in newSelectedOptions) {
                if (key === props.match) {
                  newSelectedOptions[key] = "";
                } else {
                  newSelectedOptions[key] = newSelectedOptions[key];
                }
              }
              return newSelectedOptions;
            });
          }
        }
      }
    });
  }

  function onTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (props.isEliminated) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setStartPosition({ x: touch.clientX, y: touch.clientY });
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (props.isEliminated) return;
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosition.x;
    const deltaY = touch.clientY - startPosition.y;
    setPosition((prevPosition) => ({
      x: prevPosition.x + deltaX,
      y: prevPosition.y + deltaY,
    }));
    setStartPosition({ x: touch.clientX, y: touch.clientY });
  }

  function onTouchEnd() {
    if (props.isEliminated) return;
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    const thisElement = boxRef.current;
    props.promptRefs.forEach((promptRef) => {
      const otherElement = promptRef.current;
      if (thisElement && otherElement) {
        if (checkIntersection(thisElement, otherElement)) {
          let newDraggedOver = { ...props.draggedOver };
          for (const key in newDraggedOver) {
            newDraggedOver[key] = false;
          }
          newDraggedOver[otherElement.id] = true;
          props.setDraggedOver(newDraggedOver);

          let newSelectedOptions = { ...props.selectedOptions };
          for (const key in newSelectedOptions) {
            if (key === props.match) {
              newSelectedOptions[key] = "";
            }
            if (key === otherElement.id) {
              newSelectedOptions[key] = thisElement.id;
            }
          }
          props.setSelectedOptions(newSelectedOptions);
        }
      }
    });
    props.optionRefs.forEach((optionRef) => {
      const otherElement = optionRef.current;
      if (thisElement && otherElement) {
        if (checkIntersection(thisElement, otherElement)) {
          let newDraggedOver = { ...props.draggedOver };
          for (const key in newDraggedOver) {
            newDraggedOver[key] = false;
          }
          props.setDraggedOver(newDraggedOver);
          if (props.match) {
            props.setSelectedOptions((prevSelectedOptions) => {
              let newSelectedOptions = { ...prevSelectedOptions };
              for (const key in newSelectedOptions) {
                if (key === props.match) {
                  newSelectedOptions[key] = "";
                } else {
                  newSelectedOptions[key] = newSelectedOptions[key];
                }
              }
              return newSelectedOptions;
            });
          }
        }
      }
    });
  }

  return (
    <div
      id={props.id}
      ref={boxRef}
      className={`w-full h-full absolute select-none transition-transform duration-300 touch-none ${
        props.isEliminated
          ? "cursor-default"
          : isDragging
          ? "z-10 cursor-grabbing scale-95"
          : "z-auto cursor-grab scale-100"
      }`}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {!props.isEliminated && props.children}
    </div>
  );
}
