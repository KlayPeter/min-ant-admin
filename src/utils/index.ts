/**
 * type: String、Number、Boolean、Null、Undefined、Array、Object、Map、Set、Function、Date、Promise、Error、FormData
 * useage: isType('Number')(1) // true
 */

// 判断变量类型
type Types =
  | "String"
  | "Number"
  | "Boolean"
  | "Null"
  | "Undefined"
  | "Array"
  | "Object"
  | "Map"
  | "Set"
  | "Function"
  | "Date"
  | "Promise"
  | "Error"
  | "FormData"
  | "Blob";

export const isType =
  (type: Types) =>
  (target: any): boolean =>
    `[object ${type}]` === Object.prototype.toString.call(target);

// 平铺数据结构
export const flatTree = (data: any[], childrenField = "children") => {
  return data.reduce((prev: any[], next: any) => {
    prev.push(next);
    if (next[childrenField]) {
      const arr = flatTree(next[childrenField], childrenField);
      arr.forEach((item) => prev.push(item));
    }
    return prev;
  }, []);
};

export function isSmallDevice() {
  const userAgent = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export function delay(timeout = 300) {
  return new Promise((res) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      res(true);
    }, timeout);
  });
}
