import {
  ProForm,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Card, Modal } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Apis from "@/apis";

const MenuModel = forwardRef<
  { open: (values?: any, id?: number) => void },
  { onFinish: (values: any, id?: number) => void }
>(({ onFinish }, ref) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const formRef = useRef<ProFormInstance>(null);

  function enhanceMenuTree(tree: any[]): any[] {
    function recursiveEnhance(nodes: any[]): any[] {
      return nodes.map((node: any) => {
        // 为当前节点添加label和value字段
        const enhancedNode = {
          ...node,
          label: node.name,
          value: node.id,
        };

        // 如果当前节点有子节点，递归处理这些子节点
        if (node.children && node.children.length > 0) {
          enhancedNode.children = recursiveEnhance(node.children);
        }

        return enhancedNode;
      });
    }

    return recursiveEnhance(tree);
  }

  const loadMenu = async () => {
    try {
      const res: any = await Apis.system.menu.getMenuTree();
      console.log('原始菜单数据:', res);

      // 先构建树形结构
      const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
          .filter((item) => {
            // 如果 parentId 为 null，匹配所有没有 parentId 或 parentId 为 null/undefined 的项
            if (parentId === null) {
              return !item.parentId || item.parentId === null || item.parentId === undefined;
            }
            // 否则精确匹配 parentId
            return item.parentId === parentId;
          })
          .map((item) => ({
            ...item,
            children: buildTree(items, item.id),
          }));
      };

      const treeData = buildTree(res);
      console.log('构建的树形数据:', treeData);

      const flatMenuTree = enhanceMenuTree(treeData);
      console.log('增强后的树形菜单数据:', flatMenuTree);
      return flatMenuTree;
    } catch (error) {
      console.error('加载菜单失败:', error);
      return [];
    }
  };

  const handleCancel = () => {
    formRef.current?.resetFields();
    setOpen(false);
    setEditId(undefined);
  };

  const handleOk = () => {
    return formRef.current
      ?.validateFields()
      .then((values) => onFinish(values, editId))
      .then(() => handleCancel());
  };

  useImperativeHandle(ref, () => ({
    open: (values?: any, id?: number) => {
      setEditId(id);
      setOpen(true);
      if (values) {
        setTimeout(() => formRef.current?.setFieldsValue(values), 0);
      }
    },
  }));

  return (
    <Modal
      title={editId ? "编辑菜单" : "新增菜单"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <ProForm
        submitter={false}
        scrollToFirstError
        formRef={formRef}
        layout="vertical"
      >
        <Card>
          <ProFormText
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: "请输入菜单名称" }]}
          />

          <ProFormText
            name="path"
            label="路径"
            rules={[{ required: true, message: "请输入路径" }]}
          />

          <ProFormText
            name="component"
            label="组件路径"
            placeholder="如: pages/system/user"
          />

          <ProFormText
            name="icon"
            label="图标"
            placeholder="如: UserOutlined"
          />

          <ProFormText
            name="sortOrder"
            label="排序"
            rules={[{ required: true, message: "请输入序号" }]}
          />

          <ProFormTreeSelect
            name={"parentId"}
            label="父级菜单"
            request={loadMenu}
            fieldProps={{
              allowClear: true,
              placeholder: "请选择父级菜单",
              showSearch: true,
              treeNodeFilterProp: "label",
            }}
          />
        </Card>
      </ProForm>
    </Modal>
  );
});

export default MenuModel;
