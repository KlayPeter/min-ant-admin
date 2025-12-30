/**
 * 树形结构工具函数
 */

export interface TreeNode {
  id: string;
  parentId?: string | null;
  children?: TreeNode[];
  [key: string]: any;
}

/**
 * 将扁平数组转换为树形结构
 * @param flatList 扁平数组
 * @param idKey ID 字段名，默认 'id'
 * @param parentIdKey 父ID字段名，默认 'parentId'
 * @param childrenKey 子节点字段名，默认 'children'
 * @returns 树形结构数组
 */
export function buildTree<T extends Record<string, any>>(
  flatList: T[],
  idKey: string = 'id',
  parentIdKey: string = 'parentId',
  childrenKey: string = 'children'
): T[] {
  if (!flatList || flatList.length === 0) return [];

  const map = new Map<string, any>();
  const roots: any[] = [];

  // 第一遍：创建所有节点的映射
  flatList.forEach((item) => {
    const node: any = { ...item };
    node[childrenKey] = [];
    map.set(item[idKey], node);
  });

  // 第二遍：建立父子关系
  flatList.forEach((item) => {
    const node = map.get(item[idKey]);
    if (!node) return;

    const parentId = item[parentIdKey];
    if (parentId && parentId !== null) {
      const parent = map.get(parentId);
      if (parent && parent[childrenKey]) {
        parent[childrenKey].push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots as T[];
}

/**
 * 树形结构转扁平数组
 * @param tree 树形结构
 * @param childrenKey 子节点字段名
 * @returns 扁平数组
 */
export function flattenTree<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children'
): T[] {
  const result: T[] = [];

  function traverse(nodes: T[]) {
    nodes.forEach((node) => {
      const children = node[childrenKey];
      const nodeWithoutChildren: any = { ...node };
      delete nodeWithoutChildren[childrenKey];
      result.push(nodeWithoutChildren);
      
      if (children && Array.isArray(children) && children.length > 0) {
        traverse(children);
      }
    });
  }

  traverse(tree);
  return result;
}

/**
 * 在树中查找节点
 * @param tree 树形结构
 * @param predicate 查找条件
 * @param childrenKey 子节点字段名
 * @returns 找到的节点或 undefined
 */
export function findInTree<T extends Record<string, any>>(
  tree: T[],
  predicate: (node: T) => boolean,
  childrenKey: string = 'children'
): T | undefined {
  for (const node of tree) {
    if (predicate(node)) {
      return node;
    }
    const children = node[childrenKey];
    if (children && Array.isArray(children) && children.length > 0) {
      const found = findInTree(children, predicate, childrenKey);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 过滤树节点
 * @param tree 树形结构
 * @param predicate 过滤条件
 * @param childrenKey 子节点字段名
 * @returns 过滤后的树
 */
export function filterTree<T extends Record<string, any>>(
  tree: T[],
  predicate: (node: T) => boolean,
  childrenKey: string = 'children'
): T[] {
  return tree
    .map((node) => {
      const children = node[childrenKey];
      const newNode: any = { ...node };
      
      if (children && Array.isArray(children) && children.length > 0) {
        const filteredChildren = filterTree(children, predicate, childrenKey);
        newNode[childrenKey] = filteredChildren;
        return predicate(newNode) || filteredChildren.length > 0 ? newNode : null;
      }
      
      return predicate(newNode) ? newNode : null;
    })
    .filter((node): node is T => node !== null);
}

/**
 * 获取节点的所有父节点ID
 * @param tree 树形结构
 * @param targetId 目标节点ID
 * @param idKey ID字段名
 * @param childrenKey 子节点字段名
 * @returns 父节点ID数组
 */
export function getParentIds<T extends Record<string, any>>(
  tree: T[],
  targetId: string,
  idKey: string = 'id',
  childrenKey: string = 'children'
): string[] {
  const path: string[] = [];

  function traverse(nodes: T[], parents: string[]): boolean {
    for (const node of nodes) {
      if (node[idKey] === targetId) {
        path.push(...parents);
        return true;
      }
      const children = node[childrenKey];
      if (children && Array.isArray(children) && children.length > 0) {
        if (traverse(children, [...parents, node[idKey]])) {
          return true;
        }
      }
    }
    return false;
  }

  traverse(tree, []);
  return path;
}

/**
 * 获取节点的所有子节点ID
 * @param node 节点
 * @param idKey ID字段名
 * @param childrenKey 子节点字段名
 * @returns 子节点ID数组
 */
export function getChildrenIds<T extends Record<string, any>>(
  node: T,
  idKey: string = 'id',
  childrenKey: string = 'children'
): string[] {
  const ids: string[] = [];

  function traverse(n: T) {
    const children = n[childrenKey];
    if (children && Array.isArray(children) && children.length > 0) {
      children.forEach((child: T) => {
        ids.push(child[idKey]);
        traverse(child);
      });
    }
  }

  traverse(node);
  return ids;
}
