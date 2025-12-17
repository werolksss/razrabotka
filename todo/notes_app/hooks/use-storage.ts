import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAsyncStorage<T>() {

  const setItems = async (key: string, data: T[]) => {
    // Записывает в хранилище данные по ключу
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  const getItems = async (key: string) => {
    // Возвращает все объекты из хранилища по ключу
    const data = await AsyncStorage.getItem(key);
    if (!data) return []; 
    return JSON.parse(data) as T[];
  }

  const getItem = async <K extends keyof T>(
    key: string,
    field: K,
    value: T[K]
  ): Promise<T | null> => {
    // Возвращает элемент из хранилища по ключу с указаным id
    const data = await getItems(key);
    return data.find((item) => item[field] == value) ?? null;
  }

  const updatedItem = async <K extends keyof T>(
    key: string,
    field: K,
    value: T[K],
    updater: (item: T) => T
  ): Promise<T[]> => {
    const data = await getItems(key);
    const updated = data.map((item) =>
      item[field] === value ? updater (item) : item
    );

    await setItems(key, updated);
    return updated;
  };

  return {
    getItem,
    getItems,
    setItems,
    updatedItem,
  }
}