import React, {
  ReactNode,
  Reducer,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Area, getAreas } from './sources';

type State = {
  areas: Area[];
};

const initialState: State = {
  areas: [],
};

enum ActionKind {
  SET_AREAS,
}

type Action = {
  type: ActionKind;
  payload: any;
};

function configReducer(state: State, action: Action): State {
  const { type, payload } = action;

  switch (type) {
    case ActionKind.SET_AREAS: {
      return {
        ...state,
        areas: payload,
      };
    }
    default:
      return state;
  }
}

export const configContext = React.createContext(initialState);
const { Provider } = configContext;

export type AreaFilter = (value: Area, index: number, array: Area[]) => boolean;
export type AreaMapper = (value: Area, index: number, array: Area[]) => Area;
export type AreaSorter = (a: Area, b: Area) => number;
const defaultAreaFilter: AreaFilter = () => true;
const defaultAreaMapper: AreaMapper = (area) => area;

export const ConfigProvider = ({
  children,
  locale = {},
  areaFilter = defaultAreaFilter,
  areaMapper = defaultAreaMapper,
  areaSorter,
}: {
  children: ReactNode;
  locale?: any;
  areaFilter?: AreaFilter;
  areaMapper?: AreaMapper;
  areaSorter?: AreaSorter;
}) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    configReducer,
    initialState
  );
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    setAreas(getAreas(locale));
  }, [locale]);

  useEffect(() => {
    let payload = areas
      .filter((area, index, array) => areaFilter(area, index, array))
      .map((area, index, array) => areaMapper(area, index, array));
    if (areaSorter) {
      payload = payload.sort(areaSorter);
    }

    dispatch({ type: ActionKind.SET_AREAS, payload });
  }, [areas, areaFilter, areaMapper, areaSorter]);

  return <Provider value={state}>{children}</Provider>;
};
