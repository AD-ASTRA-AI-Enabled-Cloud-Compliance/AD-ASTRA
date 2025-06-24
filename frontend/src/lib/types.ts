
export type DataContextReturn<T> = {
    data: T[];
    dataLength: number;
    filter: string;
    setFilter: (val: string) => void;
  };