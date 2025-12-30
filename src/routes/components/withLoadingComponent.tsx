import { Suspense, type JSX } from "react";
import Loading from "@/components/loading";

//
/**
 * 高阶组件函数，用于为组件添加加载状态
 * @param comp - 需要包裹的React组件，类型为JSX.Element
 * @returns 返回一个带有Suspense包裹的组件，提供加载状态的处理
 */
const withLoadingComponent = (comp: JSX.Element) => (
  // 使用Suspense组件包裹传入的组件，并提供Loading作为加载状态时的回退UI
  <Suspense fallback={<Loading />}>{comp}</Suspense>
);

export default withLoadingComponent;
